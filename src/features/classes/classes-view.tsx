import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function ClassesView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['الفصل', 'المستوى', 'السعة القصوى', 'المعلم الرئيسي', 'القاعة', 'الحالة']
      : ['Classe', 'Niveau', 'Capacité max', 'Enseignant principal', 'Salle', 'Statut'];

  return (
    <FeatureScaffold
      title={t.nav.classes}
      description={
        locale === 'ar'
          ? 'إدارة الفصول، تنبيهات السعة الاستيعابية، والمعلمين المشرفين.'
          : 'Organisation des classes, alertes de dépassement de capacité et affectation des enseignants.'
      }
      moduleCode="classes"
      databaseTable="classes"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة فصل' : 'Créer une classe'}
    />
  );
}
