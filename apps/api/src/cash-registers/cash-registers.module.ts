import { Controller, Get, Post, Param, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class CashRegistersService {
  async getActiveRegister(schoolId: string) {
    return {
      id: 'active-cashbox-id',
      school_id: schoolId,
      status: 'OPEN',
      opening_amount: 50000,
      opened_at: new Date().toISOString(),
    };
  }

  async open(openingAmount: number, schoolId: string, userId: string) {
    return { id: 'new-cashbox-id', opening_amount: openingAmount, status: 'OPEN' };
  }

  async close(id: string, declaredAmount: number, notes: string, schoolId: string, userId: string) {
    return { id, status: 'CLOSED', declared_amount: declaredAmount, notes };
  }

  async reopen(id: string, schoolId: string, userId: string) {
    return { id, status: 'REOPENED' };
  }
}

@ApiTags('cash-registers')
@ApiBearerAuth()
@Controller('cash-registers')
export class CashRegistersController {
  constructor(private readonly cashRegistersService: CashRegistersService) {}

  @Get('active')
  @RequirePermissions('cashbox.read')
  @ApiOperation({ summary: 'Obtenir la session de caisse active' })
  async getActiveRegister(@CurrentUser() user: AuthenticatedUser) {
    return this.cashRegistersService.getActiveRegister(user.school_id);
  }

  @Post('open')
  @RequirePermissions('cashbox.read')
  @ApiOperation({ summary: 'Ouvrir une nouvelle caisse journalière' })
  async open(@CurrentUser() user: AuthenticatedUser, @Body('openingAmount') openingAmount: number) {
    return this.cashRegistersService.open(openingAmount, user.school_id, user.id);
  }

  @Post(':id/close')
  @RequirePermissions('cashbox.close')
  @ApiOperation({ summary: 'Clôturer la caisse (déclaration du solde + calcul d’écart)' })
  async close(
    @Param('id') id: string,
    @Body('declaredAmount') declaredAmount: number,
    @Body('notes') notes: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.cashRegistersService.close(id, declaredAmount, notes, user.school_id, user.id);
  }

  @Post(':id/reopen')
  @RequirePermissions('cashbox.reopen')
  @ApiOperation({ summary: 'Rouvrir une caisse clôturée (administrateur uniquement)' })
  async reopen(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.cashRegistersService.reopen(id, user.school_id, user.id);
  }
}

@Module({
  controllers: [CashRegistersController],
  providers: [CashRegistersService],
  exports: [CashRegistersService],
})
export class CashRegistersModule {}
