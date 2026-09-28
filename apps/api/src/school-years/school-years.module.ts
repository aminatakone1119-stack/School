import { Controller, Get, Post, Patch, Param, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class SchoolYearsService {
  async findAll(schoolId: string) {
    return [
      {
        id: '1',
        school_id: schoolId,
        name: '2026-2027',
        start_date: '2026-09-01',
        end_date: '2027-06-30',
        status: 'ACTIVE',
        is_active: true,
      },
    ];
  }

  async create(data: any, schoolId: string) {
    return { id: 'new-year-id', school_id: schoolId, ...data };
  }

  async close(id: string, schoolId: string, userId: string) {
    return { id, status: 'CLOSED', is_active: false, closed_by: userId };
  }

  async reopen(id: string, schoolId: string) {
    return { id, status: 'ACTIVE', is_active: true };
  }
}

@ApiTags('school-years')
@ApiBearerAuth()
@Controller('school-years')
export class SchoolYearsController {
  constructor(private readonly schoolYearsService: SchoolYearsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les années scolaires de l’établissement' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.schoolYearsService.findAll(user.school_id);
  }

  @Post()
  @RequirePermissions('school_year.create')
  @ApiOperation({ summary: 'Créer une nouvelle année scolaire' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.schoolYearsService.create(body, user.school_id);
  }

  @Patch(':id/close')
  @RequirePermissions('school_year.close')
  @ApiOperation({ summary: 'Clôturer une année scolaire' })
  async close(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.schoolYearsService.close(id, user.school_id, user.id);
  }

  @Patch(':id/reopen')
  @RequirePermissions('school_year.reopen')
  @ApiOperation({ summary: 'Rouvrir une année scolaire clôturée' })
  async reopen(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.schoolYearsService.reopen(id, user.school_id);
  }
}

@Module({
  controllers: [SchoolYearsController],
  providers: [SchoolYearsService],
  exports: [SchoolYearsService],
})
export class SchoolYearsModule {}
