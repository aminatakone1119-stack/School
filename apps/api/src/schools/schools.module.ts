import { Controller, Get, Patch, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class SchoolsService {
  async findCurrentSchool(schoolId: string) {
    return {
      id: schoolId,
      name: 'Groupe Scolaire Excellence',
      code: 'EXC',
      slogan: 'L’excellence au service de l’avenir',
      currency: 'FCFA',
    };
  }

  async updateCurrentSchool(schoolId: string, data: any) {
    return { id: schoolId, ...data };
  }
}

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Obtenir les paramètres de l’établissement actif' })
  async getCurrentSchool(@CurrentUser() user: AuthenticatedUser) {
    return this.schoolsService.findCurrentSchool(user.school_id);
  }

  @Patch('current')
  @RequirePermissions('role.manage')
  @ApiOperation({ summary: 'Modifier les paramètres de l’établissement' })
  async updateCurrentSchool(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.schoolsService.updateCurrentSchool(user.school_id, body);
  }
}

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
