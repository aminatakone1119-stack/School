import { Controller, Get, Post, Body, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class RolesService {
  async findAll(schoolId: string) {
    return [
      { id: '1', name: 'Administrateur', code: 'ADMIN', is_system: true },
      { id: '2', name: 'Directeur', code: 'DIRECTOR', is_system: true },
      { id: '3', name: 'Comptable / Caissier', code: 'ACCOUNTANT', is_system: true },
    ];
  }

  async updateRolePermissions(roleId: string, permissionIds: string[], schoolId: string) {
    return { roleId, permissionIds, success: true };
  }
}

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions('role.manage')
  @ApiOperation({ summary: 'Lister les rôles de l’établissement' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.rolesService.findAll(user.school_id);
  }

  @Post(':id/permissions')
  @RequirePermissions('role.manage')
  @ApiOperation({ summary: 'Mettre à jour les permissions d’un rôle' })
  async updatePermissions(@Body() body: { permissionIds: string[] }, @CurrentUser() user: AuthenticatedUser) {
    return this.rolesService.updateRolePermissions('role-id', body.permissionIds, user.school_id);
  }
}

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
