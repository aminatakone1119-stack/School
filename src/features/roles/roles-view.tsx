import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useI18n } from '../../i18n/i18n-context';
import { Shield, Check, Lock } from 'lucide-react';
import { DEFAULT_PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from '@school-management/shared';

export function RolesView() {
  const { t, locale } = useI18n();

  const roles = [
    { code: 'ADMIN', name: 'Administrateur', desc: 'Accès complet au système, configuration et journal d’audit' },
    { code: 'DIRECTOR', name: 'Directeur', desc: 'Gestion scolaire, vision globale financière et statistiques' },
    { code: 'ACCOUNTANT', name: 'Comptable / Caissier', desc: 'Recherche élèves, encaissement, caisse et reçus' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t.nav.roles}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {locale === 'ar'
            ? 'مصفوفة الصلاحيات الدقيقة والأدوار القابلة للتخصيص (ربط جدول role_permissions).'
            : 'Matrice de contrôle d’accès basée sur les rôles (RBAC dynamique via la table role_permissions).'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <Card key={r.code} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{r.name}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{r.desc}</p>
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Code: {r.code}
            </div>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-200/80 dark:border-slate-800">
          <CardTitle className="text-sm font-semibold">
            {locale === 'ar' ? 'مصفوفة الصلاحيات التفصيلية' : 'Matrice des permissions par rôle'}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="h-9 px-4 text-left rtl:text-right font-semibold">Permission</th>
                <th className="h-9 px-4 text-center font-semibold">Admin</th>
                <th className="h-9 px-4 text-center font-semibold">Directeur</th>
                <th className="h-9 px-4 text-center font-semibold">Comptable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {DEFAULT_PERMISSIONS.map((perm) => (
                <tr key={perm} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300">{perm}</td>
                  <td className="px-4 py-2 text-center">
                    <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                  </td>
                  <td className="px-4 py-2 text-center">
                    {ROLE_DEFAULT_PERMISSIONS.DIRECTOR.includes(perm) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {ROLE_DEFAULT_PERMISSIONS.ACCOUNTANT.includes(perm) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
