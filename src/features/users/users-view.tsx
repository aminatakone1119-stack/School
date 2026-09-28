import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function UsersView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['المستخدم', 'البريد الإلكتروني', 'الدور', 'اللغة المفضلة', 'الحالة', 'الإجراءات']
      : ['Nom & Prénom', 'Email', 'Rôle', 'Langue', 'Statut', 'Actions'];

  return (
    <FeatureScaffold
      title={t.nav.users}
      description={
        locale === 'ar'
          ? 'إدارة حسابات مستخدمي النظام (Supabase Auth + جدول profiles)، والتعطيل الإداري.'
          : 'Gestion des comptes applicatifs (Supabase Auth + table profiles) et désactivation sans suppression physique.'
      }
      moduleCode="users"
      databaseTable="profiles"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة مستخدم' : 'Nouvel utilisateur'}
    />
  );
}
