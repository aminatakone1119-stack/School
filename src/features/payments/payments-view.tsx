import React from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function PaymentsView() {
  const { t, locale } = useI18n();

  const columns =
    locale === 'ar'
      ? ['رقم الإيصال', 'الطالب', 'المبلغ (FCFA)', 'طريقة الدفع', 'التاريخ', 'أمين الصندوق', 'الحالة', 'الإجراءات']
      : ['N° Reçu', 'Élève', 'Montant (FCFA)', 'Mode', 'Date', 'Caissier', 'Statut', 'Actions'];

  const filterOptions =
    locale === 'ar'
      ? ['الكل', 'معتمد', 'ملغى']
      : ['Tous', 'Validés', 'Annulés'];

  return (
    <FeatureScaffold
      title={t.nav.payments}
      description={
        locale === 'ar'
          ? 'تسجيل المدفوعات النقدية، توليد الإيصالات الرسمية الفورية، وإلغاء المعاملات الخاطئة بأثر تدقيقي.'
          : 'Enregistrement des paiements en espèces, génération immédiate du reçu unique et annulation tracée.'
      }
      moduleCode="payments"
      databaseTable="payments"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'تسجيل دفعة نقدية' : 'Encaisser un paiement'}
      filterOptions={filterOptions}
    />
  );
}
