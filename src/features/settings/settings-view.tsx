import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useI18n } from '../../i18n/i18n-context';
import { useAuth } from '../auth/auth-context';
import { Building, Save, ShieldCheck, Key, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export function SettingsView() {
  const { t, locale } = useI18n();
  const { user, activeRole } = useAuth();
  const [testResult, setTestResult] = useState<{
    status: number;
    scenario: string;
    response: any;
  } | null>(null);

  // Simulation of JWT validation testing for developer verification
  const simulateUnauthenticatedRequest = () => {
    setTestResult({
      status: 401,
      scenario: 'Requête SANS en-tête Authorization (Rejet immédiat)',
      response: {
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Accès non autorisé : jeton d’authentification manquant dans l’en-tête (Format: Bearer <token>)',
      },
    });
  };

  const simulateValidAuthenticatedRequest = () => {
    setTestResult({
      status: 200,
      scenario: 'Requête AVEC Bearer JWT Supabase valide (@CurrentUser injecté)',
      response: {
        authenticated: true,
        user: {
          id: user?.id,
          email: user?.email,
          school_id: user?.schoolId,
          full_name: `${user?.firstName} ${user?.lastName}`,
          roles: [activeRole],
          permissions: user?.permissions,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.nav.settings}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'ar'
              ? 'إعدادات المؤسسة، فحص أمان JWT و Supabase Auth، ورموز الإيصالات.'
              : 'Paramètres de l’établissement, configuration de sécurité Supabase Auth et tokens JWT.'}
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 text-xs">
          <Save className="h-3.5 w-3.5" />
          <span>{t.common.save}</span>
        </Button>
      </div>

      {/* Security & Supabase Auth Card */}
      <Card className="border-l-4 border-l-slate-900 dark:border-l-slate-100">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-600" />
              <span>{locale === 'ar' ? 'أمان الواجهة الخلفية NestJS و Supabase Auth' : 'Sécurité Backend NestJS & Supabase Auth'}</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              AuthGuard + @CurrentUser() Actifs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            {locale === 'ar'
              ? 'يقوم AuthGuard في NestJS بفحص ترويسة Bearer، والتحقق من صحة JWT عبر Supabase Auth، ثم جلب ملف تعريف المستخدم وحقنه بواسطة @CurrentUser.'
              : 'Le garde AuthGuard dans NestJS intercepte chaque requête, valide le jeton Bearer JWT auprès de Supabase Auth, vérifie le statut du compte et injecte l’utilisateur via le décorateur @CurrentUser.'}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={simulateUnauthenticatedRequest}
              className="text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900"
            >
              <ShieldAlert className="h-3.5 w-3.5 mr-1" />
              Tester requête non authentifiée (Rejet 401)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={simulateValidAuthenticatedRequest}
              className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Tester requête authentifiée avec JWT
            </Button>
          </div>

          {testResult && (
            <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{testResult.scenario}</span>
                <span
                  className={
                    testResult.status === 200
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }
                >
                  HTTP {testResult.status}
                </span>
              </div>
              <pre className="p-2 rounded bg-white dark:bg-slate-950 overflow-x-auto text-slate-800 dark:text-slate-200">
                {JSON.stringify(testResult.response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-500" />
              <span>{locale === 'ar' ? 'بيانات المؤسسة' : 'Informations de l’établissement'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'ar' ? 'اسم المؤسسة' : 'Nom de l’établissement'}
              </label>
              <Input defaultValue="Groupe Scolaire Excellence" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {locale === 'ar' ? 'رمز المدرسة (للإيصالات)' : 'Code école (reçus)'}
                </label>
                <Input defaultValue="EXC" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {locale === 'ar' ? 'العملة المعيارية' : 'Devise'}
                </label>
                <Input defaultValue="FCFA" disabled className="bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'ar' ? 'الشعار / الكلمات الترويجية' : 'Slogan'}
              </label>
              <Input defaultValue="L’excellence au service de l’avenir" />
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <span>{locale === 'ar' ? 'العنوان والاتصال' : 'Coordonnées & Facturation'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'ar' ? 'العنوان البريدي' : 'Adresse physique'}
              </label>
              <Input defaultValue="Abidjan, Cocody Riviera" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {locale === 'ar' ? 'الهاتف' : 'Téléphone'}
                </label>
                <Input defaultValue="+225 07 00 00 00 00" />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Email contact'}
                </label>
                <Input defaultValue="contact@excellence-school.ci" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                {locale === 'ar' ? 'صيغة ترقيم الإيصالات' : 'Format des reçus générés'}
              </label>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                EXC-2026-000001 (Format: CODEECOLE-ANNEE-NUMERO)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
