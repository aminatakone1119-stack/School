import { Controller, Get, Post, Body, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class ClassesService {
  async findAll(schoolId: string, schoolYearId?: string) {
    return [];
  }

  async create(data: any, schoolId: string) {
    return { id: 'new-class-id', school_id: schoolId, ...data };
  }
}

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les classes de l’année scolaire' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query('schoolYearId') schoolYearId?: string) {
    return this.classesService.findAll(user.school_id, schoolYearId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une classe' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.classesService.create(body, user.school_id);
  }
}

@Module({
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
