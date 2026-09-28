export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://example.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});
