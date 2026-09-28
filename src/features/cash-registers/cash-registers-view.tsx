import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useI18n } from '../../i18n/i18n-context';
import { formatFCFA } from '@school-management/shared';
import { Wallet, Lock, History, AlertCircle } from 'lucide-react';

export function CashRegistersView() {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.nav.cashRegister}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'ar'
              ? 'إدارة جلسات الصندوق اليومية، تسوية المقبوضات النقدية، وإجراءات الإغلاق وإعادة الفتح.'
              : 'Gestion des sessions de caisse journalières, pointage des espèces et clôtures avec justification d’écart.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>{locale === 'ar' ? 'سجل الإغلاقات' : 'Historique des clôtures'}</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" />
            <span>{locale === 'ar' ? 'إغلاق جلسة الصندوق' : 'Clôturer la caisse'}</span>
          </Button>
        </div>
      </div>

      {/* Active Cash Register Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'حالة الصندوق الحالي' : 'Statut de la session active'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {locale === 'ar' ? 'مفتوح (نشط)' : 'Ouverte (Session en cours)'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Ouv. 08:00 · Caissier: Aminata Koné
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'رصيد الافتتاح' : 'Fond de caisse initial'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatFCFA(50000, locale)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Table: cash_registers.opening_amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'إجمالي المقبوض اليوم' : 'Total encaissé aujourd’hui'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatFCFA(475000, locale)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              6 {locale === 'ar' ? 'عمليات نقدية' : 'opérations espèces enregistrées'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cashbox details card */}
      <Card className="p-6 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Wallet className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {locale === 'ar' ? 'جلسة الصندوق جاهزة للإغلاق والتحقق' : 'Session de caisse prête pour le pointage'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {locale === 'ar'
              ? 'تتطلب عملية الإغلاق إدخال المبلغ الفعلي المعدود في الصندوق، وحساب الفارق تلقائياً وتوثيقه في جدول cash_register_closures.'
              : 'La procédure de clôture exige la saisie du montant compté physiquement, avec calcul automatique des écarts et consignation dans cash_register_closures.'}
          </p>
        </div>
      </Card>
    </div>
  );
}
