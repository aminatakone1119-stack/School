/**
 * School Management SaaS - Root Application
 * Conforms to Technical & Functional Specifications V1
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './lib/theme-context';
import { I18nProvider } from './i18n/i18n-context';
import { AuthProvider } from './features/auth/auth-context';
import { AppLayout } from './components/layout/app-layout';
import { FeatureKey } from './components/layout/sidebar';

// Features
import { DashboardView } from './features/dashboard/dashboard-view';
import { StudentsView } from './features/students/students-view';
import { EnrollmentsView } from './features/enrollments/enrollments-view';
import { ClassesView } from './features/classes/classes-view';
import { LevelsView } from './features/levels/levels-view';
import { TeachersView } from './features/teachers/teachers-view';
import { SubjectsView } from './features/subjects/subjects-view';
import { PaymentsView } from './features/payments/payments-view';
import { CashRegistersView } from './features/cash-registers/cash-registers-view';
import { ReportsView } from './features/reports/reports-view';
import { SchoolYearsView } from './features/school-years/school-years-view';
import { UsersView } from './features/users/users-view';
import { RolesView } from './features/roles/roles-view';
import { AuditView } from './features/audit/audit-view';
import { SettingsView } from './features/settings/settings-view';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

function AppShell() {
  const [currentFeature, setCurrentFeature] = useState<FeatureKey>('dashboard');

  const renderFeature = () => {
    switch (currentFeature) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'enrollments':
        return <EnrollmentsView />;
      case 'classes':
        return <ClassesView />;
      case 'levels':
        return <LevelsView />;
      case 'teachers':
        return <TeachersView />;
      case 'subjects':
        return <SubjectsView />;
      case 'payments':
        return <PaymentsView />;
      case 'cash-registers':
        return <CashRegistersView />;
      case 'reports':
        return <ReportsView />;
      case 'school-years':
        return <SchoolYearsView />;
      case 'users':
        return <UsersView />;
      case 'roles':
        return <RolesView />;
      case 'audit':
        return <AuditView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppLayout currentFeature={currentFeature} onSelectFeature={setCurrentFeature}>
      {renderFeature()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <AppShell />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
