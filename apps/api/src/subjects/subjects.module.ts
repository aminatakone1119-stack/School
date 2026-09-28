import { Controller, Get, Post, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class SubjectsService {
  async findAll(schoolId: string) {
    return [];
  }

  async create(data: any, schoolId: string) {
    return { id: 'new-subject-id', school_id: schoolId, ...data };
  }
}

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les matières d’enseignement' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.subjectsService.findAll(user.school_id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une matière' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.subjectsService.create(body, user.school_id);
  }
}

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
