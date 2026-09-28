import { Controller, Get, Post, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class TeachersService {
  async findAll(schoolId: string) {
    return [];
  }

  async create(data: any, schoolId: string) {
    return { id: 'new-teacher-id', school_id: schoolId, ...data };
  }
}

@ApiTags('teachers')
@ApiBearerAuth()
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les fiches internes enseignants' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.teachersService.findAll(user.school_id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une fiche enseignant' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.teachersService.create(body, user.school_id);
  }
}

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
