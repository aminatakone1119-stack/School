import React, { useState } from 'react';
import { Sidebar, FeatureKey } from './sidebar';
import { Topbar } from './topbar';

interface AppLayoutProps {
  currentFeature: FeatureKey;
  onSelectFeature: (feature: FeatureKey) => void;
  children: React.ReactNode;
}

export function AppLayout({ currentFeature, onSelectFeature, children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Sidebar */}
      <Sidebar
        currentFeature={currentFeature}
        onSelectFeature={onSelectFeature}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar
          currentFeature={currentFeature}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
