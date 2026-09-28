import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function SchoolYearsView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['السنة الدراسية', 'تاريخ البدء', 'تاريخ الانتهاء', 'الحالة', 'النشاط', 'تاريخ الإغلاق', 'الإجراءات']
      : ['Année scolaire', 'Date début', 'Date fin', 'Statut', 'Active', 'Clôture', 'Actions'];

  return (
    <FeatureScaffold
      title={t.nav.schoolYears}
      description={
        locale === 'ar'
          ? 'إدارة السنوات الدراسية (سنة واحدة نشطة فقط في نفس الوقت)، والإغلاق وإعادة الفتح الخاضع للتدقيق.'
          : 'Gestion des années scolaires (une seule active à la fois), clôtures et réouvertures contrôlées avec audit.'
      }
      moduleCode="school-years"
      databaseTable="school_years"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'سنة دراسية جديدة' : 'Nouvelle année scolaire'}
      filterOptions={locale === 'ar' ? ['الكل', 'نشطة', 'في التحضير', 'مغلقة'] : ['Toutes', 'Actives', 'En préparation', 'Clôturées']}
    />
  );
}
