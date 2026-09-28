import { Controller, Get, Post, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class LevelsService {
  async findAll(schoolId: string) {
    return [
      { id: '1', name: 'CP1', code: 'CP1', display_order: 1, is_active: true },
      { id: '2', name: 'CP2', code: 'CP2', display_order: 2, is_active: true },
      { id: '3', name: 'CE1', code: 'CE1', display_order: 3, is_active: true },
      { id: '4', name: 'CE2', code: 'CE2', display_order: 4, is_active: true },
      { id: '5', name: 'CM1', code: 'CM1', display_order: 5, is_active: true },
      { id: '6', name: 'CM2', code: 'CM2', display_order: 6, is_active: true },
      { id: '7', name: '6ème', code: '6EME', display_order: 7, is_active: true },
      { id: '8', name: '5ème', code: '5EME', display_order: 8, is_active: true },
      { id: '9', name: '4ème', code: '4EME', display_order: 9, is_active: true },
      { id: '10', name: '3ème', code: '3EME', display_order: 10, is_active: true },
    ];
  }

  async create(data: any, schoolId: string) {
    return { id: 'new-level-id', school_id: schoolId, ...data };
  }
}

@ApiTags('levels')
@ApiBearerAuth()
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les niveaux d’enseignement' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.levelsService.findAll(user.school_id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un niveau' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.levelsService.create(body, user.school_id);
  }
}

@Module({
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {}
