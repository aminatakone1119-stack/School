import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function LevelsView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['ترتيب العرض', 'المستوى', 'الرمز', 'الحالة', 'الإجراءات']
      : ['Ordre', 'Nom du niveau', 'Code', 'Statut', 'Actions'];

  return (
    <FeatureScaffold
      title={t.nav.levels}
      description={
        locale === 'ar'
          ? 'المستويات الدراسية للابتدائي والمتوسط (CP1 إلى 3ème).'
          : 'Configuration des niveaux scolaires primaire et collège (CP1 à 3ème).'
      }
      moduleCode="levels"
      databaseTable="levels"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة مستوى' : 'Ajouter un niveau'}
    />
  );
}
