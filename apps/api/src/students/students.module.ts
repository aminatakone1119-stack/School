import { Controller, Get, Post, Patch, Param, Body, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class StudentsService {
  async findAll(schoolId: string, query: any) {
    return {
      data: [],
      meta: {
        total: 0,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 20,
      },
    };
  }

  async findOne(id: string, schoolId: string) {
    return { id, schoolId };
  }

  async create(data: any, schoolId: string, userId: string) {
    return { id: 'new-student-id', school_id: schoolId, ...data };
  }

  async update(id: string, data: any, schoolId: string, userId: string) {
    return { id, school_id: schoolId, ...data };
  }

  async archive(id: string, schoolId: string, userId: string) {
    return { id, status: 'ARCHIVED', archived_at: new Date().toISOString() };
  }
}

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Lister les élèves avec recherche et pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'classId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.studentsService.findAll(user.school_id, query);
  }

  @Get(':id')
  @RequirePermissions('student.read')
  @ApiOperation({ summary: 'Obtenir la fiche détaillée d’un élève' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.findOne(id, user.school_id);
  }

  @Post()
  @RequirePermissions('student.create')
  @ApiOperation({ summary: 'Créer un élève' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.studentsService.create(body, user.school_id, user.id);
  }

  @Patch(':id')
  @RequirePermissions('student.update')
  @ApiOperation({ summary: 'Modifier les informations d’un élève' })
  async update(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.studentsService.update(id, body, user.school_id, user.id);
  }

  @Patch(':id/archive')
  @RequirePermissions('student.archive')
  @ApiOperation({ summary: 'Archiver un élève' })
  async archive(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.archive(id, user.school_id, user.id);
  }
}

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
