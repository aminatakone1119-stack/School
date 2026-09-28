import { Controller, Get, Param, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class ReceiptsService {
  async findByPayment(paymentId: string, schoolId: string) {
    return {
      id: 'receipt-uuid',
      receipt_number: 'EXC-2026-000001',
      payment_id: paymentId,
      generated_at: new Date().toISOString(),
    };
  }

  async getPdfData(receiptNumber: string, schoolId: string) {
    return {
      receiptNumber,
      school: { name: 'Groupe Scolaire Excellence', code: 'EXC' },
    };
  }
}

@ApiTags('receipts')
@ApiBearerAuth()
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get('by-payment/:paymentId')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Obtenir le reçu officiel associé à un paiement' })
  async findByPayment(@Param('paymentId') paymentId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.receiptsService.findByPayment(paymentId, user.school_id);
  }

  @Get(':receiptNumber/pdf')
  @RequirePermissions('payment.read')
  @ApiOperation({ summary: 'Générer ou télécharger le reçu en PDF' })
  async downloadPdf(@Param('receiptNumber') receiptNumber: string, @CurrentUser() user: AuthenticatedUser) {
    return this.receiptsService.getPdfData(receiptNumber, user.school_id);
  }
}

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
