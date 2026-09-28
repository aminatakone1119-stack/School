import React, { useState } from 'react';
import { FeatureScaffold } from '../../components/common/feature-scaffold';
import { useI18n } from '../../i18n/i18n-context';

export function StudentsView() {
  const { t, locale } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const columns =
    locale === 'ar'
      ? ['رقم التسجيل', 'الاسم الكامل', 'تاريخ الميلاد', 'الجنس', 'الهاتف', 'الحالة', 'الإجراءات']
      : ['Matricule', 'Nom & Prénom', 'Date naissance', 'Sexe', 'Téléphone', 'Statut', 'Actions'];

  const filterOptions =
    locale === 'ar'
      ? ['الكل', 'نشط', 'معلق', 'منقول', 'مغادر', 'مؤرشف']
      : ['Tous', 'Actif', 'Suspendu', 'Transféré', 'Sorti', 'Archivé'];

  return (
    <FeatureScaffold
      title={t.nav.students}
      description={
        locale === 'ar'
          ? 'إدارة ملفات الطلاب، الأرقام المدرسية الفريدة، والأرشفة دون حذف نهائي.'
          : 'Gestion du registre des élèves, matricules uniques et archivage sans suppression définitive.'
      }
      moduleCode="students"
      databaseTable="students"
      columns={columns}
      primaryActionLabel={locale === 'ar' ? 'إضافة طالب' : 'Nouvel élève'}
      filterOptions={filterOptions}
      onPrimaryAction={() => setModalOpen(true)}
      emptyMessage={
        locale === 'ar'
          ? 'لا يوجد طلاب مسجلون حالياً'
          : 'Aucun élève enregistré dans cette session'
      }
    />
  );
}
