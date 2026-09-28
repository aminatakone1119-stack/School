import React from 'react';
import { Search, Filter, Download, Plus, Layers, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useI18n } from '../../i18n/i18n-context';

interface FeatureScaffoldProps {
  title: string;
  description: string;
  moduleCode: string;
  databaseTable: string;
  columns: string[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  filterOptions?: string[];
  emptyMessage?: string;
}

export function FeatureScaffold({
  title,
  description,
  moduleCode,
  databaseTable,
  columns,
  primaryActionLabel,
  onPrimaryAction,
  filterOptions = ['Tous', 'Actif', 'Inactif'],
  emptyMessage,
}: FeatureScaffoldProps) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-5">
      {/* Header with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {databaseTable}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>{t.common.exportExcel}</span>
          </Button>

          {primaryActionLabel && (
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={onPrimaryAction}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{primaryActionLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`${t.common.search}...`}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-2 rtl:ml-2 rtl:mr-0">
              <Filter className="h-3 w-3" />
              <span>{t.common.filter}:</span>
            </span>
            {filterOptions.map((opt, i) => (
              <button
                key={i}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  i === 0
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Structure Table Preview & Empty State */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="h-10 px-4 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Informative empty state following anti-slop rules */}
              <tr>
                <td colSpan={columns.length} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                      <Database className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {emptyMessage || t.common.emptyStateTitle}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {locale === 'ar'
                          ? `هيكل الوحدة ${moduleCode} جاهز في apps/web و apps/api، في انتظار بيانات جدول ${databaseTable}.`
                          : `La structure du module ${moduleCode} est prête dans apps/web et apps/api, connectée à la table ${databaseTable}.`}
                      </p>
                    </div>
                    {primaryActionLabel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrimaryAction}
                        className="mt-2 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        {primaryActionLabel}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
