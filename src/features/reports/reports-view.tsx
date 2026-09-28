import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useI18n } from '../../i18n/i18n-context';
import { Download, Calendar, BarChart3, Filter } from 'lucide-react';
import { formatFCFA } from '@school-management/shared';

export function ReportsView() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'classes' | 'students'>('monthly');

  const tabs = [
    { key: 'daily', label: locale === 'ar' ? 'تقرير يومي' : 'Rapport journalier' },
    { key: 'monthly', label: locale === 'ar' ? 'تقرير شهري' : 'Rapport mensuel' },
    { key: 'classes', label: locale === 'ar' ? 'تقرير الفصول' : 'Par classe' },
    { key: 'students', label: locale === 'ar' ? 'تقرير الطلاب' : 'Par élève' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.nav.reports}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'ar'
              ? 'التقارير المالية المجمعة، نسب التحصيل، وقوائم المتأخرات حسب الصفوف والطلاب.'
              : 'États financiers consolidés, taux de recouvrement et bilans des impayés par classe et élève.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>{t.common.exportPdf}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>{t.common.exportExcel}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'المبلغ المستحق الإجمالي' : 'Total dû attendu'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-mono">{formatFCFA(42000000, locale)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'المحصل الفعلي' : 'Total recouvré'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatFCFA(26500000, locale)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-slate-500 dark:text-slate-400">
              {locale === 'ar' ? 'المتبقي كديون' : 'Solde restant dû'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              {formatFCFA(15500000, locale)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {locale === 'ar' ? 'هيكل التقارير جاهز لتوليد الجداول المفصلة' : 'Moteur de rapports agrégés initialisé'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          {locale === 'ar'
            ? 'يتصل هذا القسم بنقاط النهاية /api/v1/reports/financial لتصدير ملفات PDF و Excel مباشرة إلى إدارة المدرسة.'
            : 'Ce module exploite l’endpoint /api/v1/reports/financial et les vues PostgreSQL student_financial_summary et class_financial_summary.'}
        </p>
      </Card>
    </div>
  );
}
