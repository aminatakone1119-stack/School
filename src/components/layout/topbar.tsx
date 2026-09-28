import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  User,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18n-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../features/auth/auth-context';
import { UserRole } from '@school-management/types';
import { FeatureKey } from './sidebar';

interface TopbarProps {
  currentFeature: FeatureKey;
  onOpenMobile: () => void;
}

export function Topbar({ currentFeature, onOpenMobile }: TopbarProps) {
  const { t, locale, setLocale, isRtl } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, activeRole, setActiveRole } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Breadcrumb mapping
  const featureTitles: Record<FeatureKey, { category?: string; title: string }> = {
    dashboard: { title: t.nav.dashboard },
    students: { category: t.nav.schoolManagement, title: t.nav.students },
    enrollments: { category: t.nav.schoolManagement, title: t.nav.enrollments },
    classes: { category: t.nav.schoolManagement, title: t.nav.classes },
    levels: { category: t.nav.schoolManagement, title: t.nav.levels },
    teachers: { category: t.nav.schoolManagement, title: t.nav.teachers },
    subjects: { category: t.nav.schoolManagement, title: t.nav.subjects },
    payments: { category: t.nav.finance, title: t.nav.payments },
    'cash-registers': { category: t.nav.finance, title: t.nav.cashRegister },
    reports: { category: t.nav.finance, title: t.nav.reports },
    'school-years': { category: t.nav.administration, title: t.nav.schoolYears },
    users: { category: t.nav.administration, title: t.nav.users },
    roles: { category: t.nav.administration, title: t.nav.roles },
    audit: { category: t.nav.administration, title: t.nav.audit },
    settings: { category: t.nav.administration, title: t.nav.settings },
  };

  const breadcrumb = featureTitles[currentFeature] || { title: t.nav.dashboard };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur-xs transition-colors sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline hover:text-slate-700 dark:hover:text-slate-200">
            {t.app.name}
          </span>
          {breadcrumb.category && (
            <>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="hidden md:inline">{breadcrumb.category}</span>
            </>
          )}
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {breadcrumb.title}
          </span>
        </nav>
      </div>

      {/* Middle: Quick Search (Desktop) */}
      <div className="hidden lg:flex items-center w-72">
        <div className="relative w-full">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.topbar.searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Controls: Language, Theme, Notifications, User Menu */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLocale(locale === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            title="Changer de langue / تغيير اللغة"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-semibold uppercase">{locale}</span>
            <span className="text-[11px] text-slate-400">
              {locale === 'fr' ? 'العربية' : 'Français'}
            </span>
          </button>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          title={theme === 'light' ? t.topbar.darkMode : t.topbar.lightMode}
          aria-label="Basculer le thème"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="relative rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title={t.topbar.notifications}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notificationsOpen && (
            <div
              className={`absolute top-full mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-lg ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {t.topbar.notifications}
                </span>
                <span className="text-[11px] text-slate-400">1 nouvelle</span>
              </div>
              <div className="py-3 space-y-2.5">
                <div className="flex items-start gap-2.5 rounded-lg p-2 bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <Info className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      Caisse journalière ouverte
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Fond de caisse initialisé à 50 000 FCFA pour l’année active 2026-2027.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 pl-2 rtl:pl-1.5 rtl:pr-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="hidden text-left rtl:text-right sm:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {activeRole === UserRole.ADMIN && t.topbar.roleAdmin}
                {activeRole === UserRole.DIRECTOR && t.topbar.roleDirector}
                {activeRole === UserRole.ACCOUNTANT && t.topbar.roleAccountant}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div
              className={`absolute top-full mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-lg ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>

              {/* Role switcher for evaluation/demonstration of RBAC */}
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {t.topbar.switchRole}
              </div>

              {[
                { role: UserRole.ADMIN, label: t.topbar.roleAdmin },
                { role: UserRole.DIRECTOR, label: t.topbar.roleDirector },
                { role: UserRole.ACCOUNTANT, label: t.topbar.roleAccountant },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setActiveRole(r.role);
                    setUserMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>{r.label}</span>
                  {activeRole === r.role && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
