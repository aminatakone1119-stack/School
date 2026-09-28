import { Controller, Get, Post, Body, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class FeesService {
  async findFeeTypes(schoolId: string) {
    return [
      { id: '1', name: 'Frais d’inscription', code: 'REGISTRATION', is_active: true },
      { id: '2', name: 'Frais de scolarité', code: 'TUITION', is_active: true },
      { id: '3', name: 'Autres frais', code: 'OTHER', is_active: true },
    ];
  }

  async findFeeStructures(schoolId: string, schoolYearId: string) {
    return [];
  }

  async createFeeStructure(data: any, schoolId: string) {
    return { id: 'new-structure-id', school_id: schoolId, ...data };
  }
}

@ApiTags('fees')
@ApiBearerAuth()
@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get('types')
  @ApiOperation({ summary: 'Lister les types de frais (Inscription, Scolarité, etc.)' })
  async getFeeTypes(@CurrentUser() user: AuthenticatedUser) {
    return this.feesService.findFeeTypes(user.school_id);
  }

  @Get('structures')
  @ApiOperation({ summary: 'Obtenir la grille tarifaire par niveau/classe' })
  async getFeeStructures(@CurrentUser() user: AuthenticatedUser, @Query('schoolYearId') schoolYearId: string) {
    return this.feesService.findFeeStructures(user.school_id, schoolYearId);
  }

  @Post('structures')
  @ApiOperation({ summary: 'Définir un tarif pour une année/niveau/classe' })
  async createFeeStructure(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.feesService.createFeeStructure(body, user.school_id);
  }
}

@Module({
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
