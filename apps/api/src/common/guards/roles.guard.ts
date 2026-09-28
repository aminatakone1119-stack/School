import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user || !user.roles) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    // ADMIN has full access
    if (user.roles.includes('ADMIN')) {
      return true;
    }

    const hasRole = requiredRoles.some((role: string) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(`Accès refusé : rôle requis (${requiredRoles.join(', ')})`);
    }

    return true;
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Accès refusé : permission manquante');
    }

    // ADMIN or wildcard has access
    if (user.roles?.includes('ADMIN') || user.permissions.includes('*')) {
      return true;
    }

    const hasAll = requiredPermissions.every((perm: string) => user.permissions.includes(perm));
    if (!hasAll) {
      throw new ForbiddenException(`Accès refusé : permissions requises (${requiredPermissions.join(', ')})`);
    }

    return true;
  }
}
