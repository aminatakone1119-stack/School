import { Controller, Get, Post, Patch, Param, Body, Query, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class UsersService {
  async findAll(schoolId: string, query: any) {
    return { data: [], total: 0, page: 1, limit: 20 };
  }

  async findOne(id: string, schoolId: string) {
    return { id, schoolId };
  }

  async create(data: any, schoolId: string, adminId: string) {
    return { id: 'new-user-id', ...data };
  }

  async disable(id: string, schoolId: string) {
    return { id, is_active: false };
  }
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('user.read')
  @ApiOperation({ summary: 'Lister les utilisateurs de l’établissement' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: any) {
    return this.usersService.findAll(user.school_id, query);
  }

  @Post()
  @RequirePermissions('user.create')
  @ApiOperation({ summary: 'Créer un utilisateur avec profil et rôle' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: any) {
    return this.usersService.create(body, user.school_id, user.id);
  }

  @Patch(':id/disable')
  @RequirePermissions('user.disable')
  @ApiOperation({ summary: 'Désactiver un utilisateur' })
  async disable(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.usersService.disable(id, user.school_id);
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
