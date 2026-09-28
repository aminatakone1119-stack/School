import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {
    const url =
      this.configService.get<string>('supabase.url') ||
      process.env.SUPABASE_URL ||
      '';
    const serviceKey =
      this.configService.get<string>('supabase.serviceRoleKey') ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      '';

    if (url && serviceKey) {
      this.client = createClient(url, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      this.logger.log(`Supabase client initialisé avec l'URL: ${url}`);
    } else {
      this.logger.warn(
        'Variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY non renseignées. Les requêtes protégées exigeront leur configuration.',
      );
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }
}
