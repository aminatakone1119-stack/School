import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function AuditView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['التاريخ والوقت', 'المستخدم', 'نوع الإجراء', 'الكائن المستهدف', 'عنوان IP', 'البيانات المسجلة']
      : ['Horodatage', 'Utilisateur', 'Action sensible', 'Entité concernée', 'Adresse IP', 'Données modifiées'];

  return (
    <FeatureScaffold
      title={t.nav.audit}
      description={
        locale === 'ar'
          ? 'سجل التدقيق الأمني لجميع العمليات الحساسة (إنشاء/إلغاء المدفوعات، إغلاق الصندوق، وتعديل الطلاب).'
          : 'Journal d’audit immuable consignant toutes les actions sensibles (paiements, annulations, clôtures de caisse).'
      }
      moduleCode="audit"
      databaseTable="audit_logs"
      columns={columns}
      filterOptions={locale === 'ar' ? ['الكل', 'المدفوعات', 'الصندوق', 'الطلاب', 'المستخدمون'] : ['Tous', 'Paiements', 'Caisse', 'Élèves', 'Utilisateurs']}
    />
  );
}
