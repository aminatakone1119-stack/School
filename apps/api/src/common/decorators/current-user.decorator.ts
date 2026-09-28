import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string; // UUID from Supabase auth.users
  email: string;
  school_id: string; // Active school context
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string | null;
  preferred_language: 'fr' | 'ar';
  roles: string[];
  permissions: string[];
}

/**
 * Decorator to extract the authenticated user (or a specific property)
 * injected by AuthGuard after verifying the Supabase JWT.
 *
 * Examples:
 *   @Get('me')
 *   getProfile(@CurrentUser() user: AuthenticatedUser)
 *
 *   @Get('school-data')
 *   getSchoolData(@CurrentUser('school_id') schoolId: string)
 *
 *   @Get('my-roles')
 *   getMyRoles(@CurrentUser('roles') roles: string[])
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    if (!user) {
      return null;
    }
    return data ? user[data] : user;
  },
);
