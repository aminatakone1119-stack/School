import { Controller, Get, Post, Patch, Param, Body, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class EnrollmentsService {
  async findAll(schoolId: string, query: any) {
    return { data: [], total: 0 };
  }

  async create(data: any, schoolId: string, userId: string) {
    return {
      id: 'new-enrollment-id',
      school_id: schoolId,
      ...data,
      created_by: userId,
    };
  }

  async updateStatus(id: string, status: string, schoolId: string, userId: string) {
    return { id, status };
  }
}

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @RequirePermissions('enrollment.read')
  @ApiOperation({ summary: 'Lister les inscriptions scolaires' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.enrollmentsService.findAll(user.school_id, query);
  }

  @Post()
  @RequirePermissions('enrollment.create')
  @ApiOperation({ summary: 'Inscrire un élève (génère automatiquement les frais scolaires associés)' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.enrollmentsService.create(body, user.school_id, user.id);
  }

  @Patch(':id/status')
  @RequirePermissions('enrollment.update')
  @ApiOperation({ summary: 'Mettre à jour le statut d’une inscription' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.enrollmentsService.updateStatus(id, status, user.school_id, user.id);
  }
}

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
