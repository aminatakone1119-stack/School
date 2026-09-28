import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator';
import { SupabaseService } from '../../database/supabase.service';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route or controller is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 2. Extract Authorization Bearer header
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Accès non autorisé : jeton d’authentification manquant dans l’en-tête (Format: Bearer <token>)',
      );
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      throw new UnauthorizedException('Accès non autorisé : jeton JWT vide');
    }

    // 3. Obtain Supabase Admin / Service Role client
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      this.logger.error('Supabase client unavailable - cannot verify token');
      throw new UnauthorizedException(
        'Service d’authentification non configuré ou indisponible',
      );
    }

    // 4. Validate JWT with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      this.logger.warn(`Échec de validation JWT Supabase: ${authError?.message || 'Utilisateur non trouvé'}`);
      throw new UnauthorizedException(
        `Session Supabase invalide ou expirée (${authError?.message || 'Token invalide'})`,
      );
    }

    const supabaseUser = authData.user;

    // 5. Query user profile from database to get school isolation context and status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('school_id, first_name, last_name, phone, is_active, preferred_language')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError || !profile) {
      this.logger.warn(`Profil introuvable pour l'utilisateur Supabase ${supabaseUser.id}`);
      throw new UnauthorizedException('Profil utilisateur introuvable pour cette session');
    }

    if (!profile.is_active) {
      this.logger.warn(`Tentative de connexion d'un compte désactivé: ${supabaseUser.id}`);
      throw new UnauthorizedException('Ce compte utilisateur a été désactivé par l’administration');
    }

    // 6. Query assigned roles and permissions
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(code, role_permissions(permissions(code)))')
      .eq('user_id', supabaseUser.id);

    const roles: string[] = [];
    const permissions: string[] = [];

    userRoles?.forEach((item: any) => {
      if (item.roles?.code) {
        roles.push(item.roles.code);
        item.roles.role_permissions?.forEach((rp: any) => {
          const permCode = rp.permissions?.code;
          if (permCode && !permissions.includes(permCode)) {
            permissions.push(permCode);
          }
        });
      }
    });

    // 7. Inject authenticated user into Request object
    const authenticatedUser: AuthenticatedUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      school_id: profile.school_id,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      phone: profile.phone || null,
      preferred_language: profile.preferred_language || 'fr',
      roles,
      permissions,
    };

    request.user = authenticatedUser;
    return true;
  }
}
