import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function TeachersView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['الاسم واللقب', 'رقم الهاتف', 'التخصص', 'الحالة', 'الإجراءات']
      : ['Nom & Prénom', 'Téléphone', 'Spécialité', 'Statut', 'Actions'];

  return (
    <FeatureScaffold
      title={t.nav.teachers}
      description={
        locale === 'ar'
          ? 'السجلات الداخلية للمعلمين (بدون حسابات مستخدمين في الإصدار الأول).'
          : 'Fiches internes des enseignants (sans compte utilisateur dans la V1).'
      }
      moduleCode="teachers"
      databaseTable="teachers"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة معلم' : 'Nouvel enseignant'}
    />
  );
}
