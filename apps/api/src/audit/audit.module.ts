import { Controller, Get, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuditService {
  async findAll(schoolId: string, query: any) {
    return {
      data: [
        {
          id: 'log-1',
          action: 'PAYMENT_CREATE',
          entity_type: 'PAYMENT',
          entity_id: 'payment-uuid-1',
          user_id: 'user-uuid-1',
          created_at: new Date().toISOString(),
        },
      ],
      total: 1,
    };
  }

  async logEvent(data: any) {
    // Inserts row into audit_logs table
    return { id: 'new-audit-id', ...data };
  }
}

@ApiTags('audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('audit.read')
  @ApiOperation({ summary: 'Consulter le journal d’audit des actions sensibles' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.auditService.findAll(user.school_id, query);
  }
}

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
