import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Layers,
  GraduationCap,
  BookOpen,
  CreditCard,
  Wallet,
  BarChart3,
  Calendar,
  Shield,
  History,
  Settings,
  ChevronRight,
  School,
  X,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n-context';
import { useAuth } from '../../features/auth/auth-context';
import { cn } from '../../lib/utils';

export type FeatureKey =
  | 'dashboard'
  | 'students'
  | 'enrollments'
  | 'classes'
  | 'levels'
  | 'teachers'
  | 'subjects'
  | 'payments'
  | 'cash-registers'
  | 'reports'
  | 'school-years'
  | 'users'
  | 'roles'
  | 'audit'
  | 'settings';

interface SidebarProps {
  currentFeature: FeatureKey;
  onSelectFeature: (feature: FeatureKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ currentFeature, onSelectFeature, mobileOpen, onCloseMobile }: SidebarProps) {
  const { t, isRtl } = useI18n();
  const { user } = useAuth();

  const navSections = [
    {
      label: null,
      items: [
        {
          key: 'dashboard' as FeatureKey,
          label: t.nav.dashboard,
          icon: LayoutDashboard,
          permission: null,
        },
      ],
    },
    {
      label: t.nav.schoolManagement,
      items: [
        { key: 'students' as FeatureKey, label: t.nav.students, icon: Users, permission: 'student.read' },
        { key: 'enrollments' as FeatureKey, label: t.nav.enrollments, icon: UserCheck, permission: 'enrollment.read' },
        { key: 'classes' as FeatureKey, label: t.nav.classes, icon: Building2, permission: null },
        { key: 'levels' as FeatureKey, label: t.nav.levels, icon: Layers, permission: null },
        { key: 'teachers' as FeatureKey, label: t.nav.teachers, icon: GraduationCap, permission: null },
        { key: 'subjects' as FeatureKey, label: t.nav.subjects, icon: BookOpen, permission: null },
      ],
    },
    {
      label: t.nav.finance,
      items: [
        { key: 'payments' as FeatureKey, label: t.nav.payments, icon: CreditCard, permission: 'payment.read' },
        { key: 'cash-registers' as FeatureKey, label: t.nav.cashRegister, icon: Wallet, permission: 'cashbox.read' },
        { key: 'reports' as FeatureKey, label: t.nav.reports, icon: BarChart3, permission: 'report.financial.read' },
      ],
    },
    {
      label: t.nav.administration,
      items: [
        { key: 'school-years' as FeatureKey, label: t.nav.schoolYears, icon: Calendar, permission: 'school_year.create' },
        { key: 'users' as FeatureKey, label: t.nav.users, icon: Users, permission: 'user.read' },
        { key: 'roles' as FeatureKey, label: t.nav.roles, icon: Shield, permission: 'role.manage' },
        { key: 'audit' as FeatureKey, label: t.nav.audit, icon: History, permission: 'audit.read' },
        { key: 'settings' as FeatureKey, label: t.nav.settings, icon: Settings, permission: 'role.manage' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 transition-transform duration-200 lg:static lg:translate-x-0',
          isRtl ? 'right-0 border-l border-r-0' : 'left-0 border-r',
          mobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 font-semibold shadow-xs">
              <School className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                {t.app.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                {user?.schoolName || 'Excellence'}
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.label && (
                <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentFeature === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectFeature(item.key);
                      onCloseMobile();
                    }}
                    className={cn(
                      'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-white dark:text-slate-900'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight
                        className={cn('h-3.5 w-3.5 opacity-70 transition-transform', isRtl && 'rotate-180')}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom School Year info */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 border border-slate-200/60 dark:border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span>{t.app.schoolYear}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                {t.app.activeYear}
              </span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              2026-2027
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
