import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function SubjectsView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['المادة الدراسية', 'الحالة', 'الإجراءات']
      : ['Nom de la matière', 'Statut', 'Actions'];

  return (
    <FeatureScaffold
      title={t.nav.subjects}
      description={
        locale === 'ar'
          ? 'دليل المواد الدراسية المقررة (الاسم فقط في الإصدار الأول).'
          : 'Référentiel des matières enseignées (nom uniquement dans la V1).'
      }
      moduleCode="subjects"
      databaseTable="subjects"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة مادة' : 'Nouvelle matière'}
    />
  );
}
