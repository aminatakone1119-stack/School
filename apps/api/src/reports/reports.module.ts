import { Controller, Get, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { DashboardSummary } from '@school-management/types';

@Injectable()
export class ReportsService {
  async getDashboardSummary(schoolId: string): Promise<DashboardSummary> {
    return {
      students: 650,
      activeStudents: 642,
      classes: 18,
      teachers: 24,
      paymentsToday: 475000,
      paymentsMonth: 8250000,
      expected: 42000000,
      paid: 26500000,
      remaining: 15500000,
      studentsWithDebt: 184,
    };
  }

  async getFinancialReport(schoolId: string, filter: any) {
    return {
      period: filter.period || 'month',
      totalCollected: 8250000,
      currency: 'FCFA',
      breakdown: [],
    };
  }
}

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Résumé consolidé pour le tableau de bord' })
  async getDashboardSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.reportsService.getDashboardSummary(user.school_id);
  }

  @Get('financial')
  @RequirePermissions('report.financial.read')
  @ApiOperation({ summary: 'Rapport financier périodique (journalier, mensuel, annuel)' })
  async getFinancialReport(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.reportsService.getFinancialReport(user.school_id, query);
  }
}

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
