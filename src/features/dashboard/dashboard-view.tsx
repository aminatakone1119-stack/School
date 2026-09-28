import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useI18n } from '../../i18n/i18n-context';
import { formatFCFA } from '@school-management/shared';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function DashboardView() {
  const { t, isRtl, locale } = useI18n();

  // Baseline metrics defined in Technical Spec Page 10
  const metrics = {
    students: 650,
    classes: 18,
    teachers: 24,
    paymentsToday: 475000,
    paymentsMonth: 8250000,
    expected: 42000000,
    paid: 26500000,
    remaining: 15500000,
  };

  const monthlyData = [
    { month: locale === 'ar' ? 'سبتمبر' : 'Sept', amount: 9500000 },
    { month: locale === 'ar' ? 'أكتوبر' : 'Oct', amount: 5200000 },
    { month: locale === 'ar' ? 'نوفمبر' : 'Nov', amount: 4100000 },
    { month: locale === 'ar' ? 'ديسمبر' : 'Déc', amount: 3800000 },
    { month: locale === 'ar' ? 'يناير' : 'Janv', amount: 4200000 },
    { month: locale === 'ar' ? 'فبراير' : 'Févr', amount: 8250000 },
  ];

  const pieData = [
    { name: locale === 'ar' ? 'المبلغ المسدد' : 'Montant Recouvré', value: metrics.paid, color: '#0F172A' },
    { name: locale === 'ar' ? 'المتبقي للتحصيل' : 'Reste à recouvrer', value: metrics.remaining, color: '#94A3B8' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t.dashboard.title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.kpi.totalStudents}
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {metrics.students}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {metrics.classes} {t.dashboard.kpi.classes.toLowerCase()} · {metrics.teachers} {t.dashboard.kpi.teachers.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        {/* Payments Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.kpi.paymentsToday}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {formatFCFA(metrics.paymentsToday, locale)}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>{locale === 'ar' ? 'جلسة الصندوق نشطة' : 'Caisse active du jour'}</span>
            </p>
          </CardContent>
        </Card>

        {/* Payments Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.kpi.paymentsMonth}
            </CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {formatFCFA(metrics.paymentsMonth, locale)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {t.dashboard.kpi.expectedAmount}: {formatFCFA(metrics.expected, locale)}
            </p>
          </CardContent>
        </Card>

        {/* Remaining to pay */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.dashboard.kpi.remainingAmount}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {formatFCFA(metrics.remaining, locale)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {Math.round((metrics.paid / metrics.expected) * 100)}% {t.dashboard.kpi.recoveryRate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.charts.monthlyEvolution}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatFCFA(val, locale), locale === 'ar' ? 'المبلغ' : 'Montant']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Ratio Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.charts.paidVsRemaining}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatFCFA(val, locale), '']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture V1 Confirmation Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {locale === 'ar' ? 'الهيكل الأساسي جاهز للاستخدام' : 'Fondations architecturales V1 initialisées'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {locale === 'ar'
                  ? 'تم تجهيز الوحدات العشرين للواجهة الخلفية والخمس عشرة ميزة للواجهة الأمامية وفق المواصفات.'
                  : 'Les 20 modules NestJS backend et les 15 features Next.js frontend sont configurés conformément au cahier des charges.'}
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono text-slate-500 dark:text-slate-400 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded">
            v1.0.0-foundation
          </span>
        </div>
      </div>
    </div>
  );
}
