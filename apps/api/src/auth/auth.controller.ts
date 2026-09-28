import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur avec Supabase Auth (Email & Mot de passe)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@ecole-excellence.ci' },
        password: { type: 'string', example: 'MotDePasse123!' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Connexion réussie avec jeton JWT' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides ou compte désactivé' })
  async login(@Body() body: { email?: string; password?: string }) {
    return this.authService.login(body.email || '', body.password || '');
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtenir les détails complets de l’utilisateur authentifié via le décorateur @CurrentUser',
  })
  @ApiResponse({ status: 200, description: 'Informations de l’utilisateur connecté' })
  @ApiResponse({ status: 401, description: 'Requête non authentifiée rejetée par AuthGuard' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      authenticated: true,
      user,
    };
  }

  @Get('check-session')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Exemple d’injection de propriétés spécifiques avec @CurrentUser(\'id\') et @CurrentUser(\'school_id\')',
  })
  @ApiResponse({ status: 200, description: 'Propriétés extraites' })
  async checkSession(
    @CurrentUser('id') userId: string,
    @CurrentUser('school_id') schoolId: string,
    @CurrentUser('roles') roles: string[],
  ) {
    return {
      userId,
      schoolId,
      roles,
      verifiedAt: new Date().toISOString(),
    };
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion et clôture de session' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
