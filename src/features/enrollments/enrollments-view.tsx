import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function EnrollmentsView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['رقم التسجيل', 'الطالب', 'السنة الدراسية', 'الفصل', 'تاريخ التسجيل', 'الحالة', 'إعادة السنة', 'الإجراءات']
      : ['N° Inscription', 'Élève', 'Année scolaire', 'Classe', 'Date', 'Statut', 'Redoublant', 'Actions'];

  const filterOptions =
    locale === 'ar'
      ? ['الكل', 'نشط', 'معلق', 'ملغى', 'مكتمل']
      : ['Toutes', 'Actives', 'Suspendues', 'Annulées', 'Terminées'];

  return (
    <FeatureScaffold
      title={t.nav.enrollments}
      description={
        locale === 'ar'
          ? 'ربط الطلاب بالفصول مع الاحتفاظ بالتاريخ الدراسي وتوليد الرسوم التلقائية.'
          : 'Rattachement des élèves aux classes, historisation annuelle et initialisation automatique des frais.'
      }
      moduleCode="enrollments"
      databaseTable="enrollments"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'تسجيل طالب' : 'Nouvelle inscription'}
      filterOptions={filterOptions}
    />
  );
}
