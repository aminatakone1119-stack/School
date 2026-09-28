import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import configuration from './config/configuration';
import { SupabaseService } from './database/supabase.service';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// 20 Domain Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SchoolsModule } from './schools/schools.module';
import { SchoolYearsModule } from './school-years/school-years.module';
import { LevelsModule } from './levels/levels.module';
import { ClassesModule } from './classes/classes.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { FeesModule } from './fees/fees.module';
import { PaymentsModule } from './payments/payments.module';
import { CashRegistersModule } from './cash-registers/cash-registers.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    SchoolsModule,
    SchoolYearsModule,
    LevelsModule,
    ClassesModule,
    TeachersModule,
    SubjectsModule,
    StudentsModule,
    EnrollmentsModule,
    FeesModule,
    PaymentsModule,
    CashRegistersModule,
    ReceiptsModule,
    ReportsModule,
    NotificationsModule,
    AuditModule,
    UploadsModule,
  ],
  providers: [
    SupabaseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [SupabaseService],
})
export class AppModule {}
