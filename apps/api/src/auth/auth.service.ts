import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email et mot de passe sont obligatoires');
    }

    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      throw new UnauthorizedException(
        'Service Supabase non configuré. Veuillez définir SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.',
      );
    }

    // 1. Authenticate with Supabase Auth GoTrue API
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      this.logger.warn(`Tentative de connexion échouée pour ${email}: ${error?.message}`);
      throw new UnauthorizedException('Identifiants incorrects ou compte inexistant');
    }

    const userId = data.user.id;

    // 2. Fetch profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('school_id, first_name, last_name, phone, preferred_language, is_active')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new UnauthorizedException('Profil utilisateur introuvable pour ce compte');
    }

    if (!profile.is_active) {
      throw new UnauthorizedException('Ce compte utilisateur a été désactivé');
    }

    // 3. Fetch user roles & permissions
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(code, role_permissions(permissions(code)))')
      .eq('user_id', userId);

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

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      tokenType: 'Bearer',
      expiresIn: data.session.expires_in,
      user: {
        id: userId,
        email: data.user.email,
        school_id: profile.school_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name} ${profile.last_name}`.trim(),
        phone: profile.phone,
        preferred_language: profile.preferred_language,
        roles,
        permissions,
      },
    };
  }

  async getCurrentUserProfile(user: AuthenticatedUser) {
    return user;
  }

  async logout(userId: string) {
    const supabase = this.supabaseService.getClient();
    if (supabase) {
      // Invalidate Supabase user sessions if needed
      await supabase.auth.admin.signOut(userId).catch(() => null);
    }
    return {
      success: true,
      message: 'Session déconnectée avec succès',
    };
  }
}
