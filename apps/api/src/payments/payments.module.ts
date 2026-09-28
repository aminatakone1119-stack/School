import { Controller, Get, Post, Param, Body, Query, Headers, Module, Injectable, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class PaymentsService {
  async findAll(schoolId: string, query: any) {
    return { data: [], total: 0 };
  }

  async findOne(id: string, schoolId: string) {
    return { id, schoolId };
  }

  async create(data: any, idempotencyKey: string | undefined, schoolId: string, userId: string) {
    // Sensitive atomic operation:
    // 1. Validate cash register is open
    // 2. Validate amount > 0 and sum(allocations) === amount
    // 3. Atomically obtain next receipt number from receipt_sequences
    // 4. Insert payment and allocations
    // 5. Insert receipt
    // 6. Log audit event
    return {
      id: 'new-payment-id',
      receipt_number: 'EXC-2026-000001',
      status: 'VALIDATED',
      amount: data.amount,
      ...data,
      created_by: userId,
    };
  }

  async cancel(id: string, reason: string, schoolId: string, userId: string) {
    if (!reason || reason.trim().length < 5) {
      throw new BadRequestException('Un motif d’annulation détaillé est obligatoire (au moins 5 caractères)');
    }
    // Set status = CANCELLED, keep receipt record, log audit
    return {
      id,
      status: 'CANCELLED',
      cancellation_reason: reason,
      cancelled_by: userId,
      cancelled_at: new Date().toISOString(),
    };
  }
}

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Lister les paiements avec filtres' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.paymentsService.findAll(user.school_id, query);
  }

  @Get(':id')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Consulter le détail d’un paiement' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.findOne(id, user.school_id);
  }

  @Post()
  @RequirePermissions('payment.create')
  @ApiOperation({ summary: 'Enregistrer un paiement en espèces (génération atomique du reçu)' })
  @ApiHeader({ name: 'X-Idempotency-Key', required: false, description: 'Clé anti-doublon' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: any,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.create(body, idempotencyKey, user.school_id, user.id);
  }

  @Post(':id/cancel')
  @RequirePermissions('payment.cancel')
  @ApiOperation({ summary: 'Annuler un paiement (motif obligatoire + audit)' })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentsService.cancel(id, reason, user.school_id, user.id);
  }
}

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
