import { Controller, Get, Module, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../common/decorators/roles.decorator';
import { DEFAULT_PERMISSIONS } from '@school-management/shared';

@Injectable()
export class PermissionsService {
  async findAll() {
    return DEFAULT_PERMISSIONS.map((code) => {
      const [module] = code.split('.');
      return { code, module, name: code };
    });
  }
}

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('role.manage')
  @ApiOperation({ summary: 'Lister toutes les permissions disponibles du système' })
  async findAll() {
    return this.permissionsService.findAll();
  }
}

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
