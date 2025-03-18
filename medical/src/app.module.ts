import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { DegreeModule } from './degree/degree.module';
import { Degree } from './degree/entities/degree.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/entities/doctor.entity';
import { SpecialtyModule } from './specialty/specialty.module';
import { Specialty } from './specialty/entities/specialty.entity';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/entities/patient.entity';
import { PaymentsModule } from './payments/payments.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { Payments } from './payments/entities/payments.entity';
import { VideoCallModule } from './video-call/video-call.module';
import { TranslateModule } from './translate/translate.module';
import { PrescriptionDetailsModule } from './prescription-details/prescription-details.module';
import { Prescriptions } from './prescriptions/entities/prescriptions.entity';
import { PrescriptionModule } from './prescriptions/prescriptions.module';
import { PrescriptionDetails } from './prescription-details/entities/prescription-details.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33061,
      username: 'root',
      password: 'root',
      database: 'medical1',
      entities: [
        User,
        Degree,
        Doctor,
        Specialty,
        Patient,
        Appointment,
        Payments,
        Prescriptions,
        PrescriptionDetails,
      ],
      synchronize: true,
    }),
    UserModule,
    DegreeModule,
    DoctorModule,
    SpecialtyModule,
    AuthModule,
    PatientModule,
    PaymentsModule,
    AppointmentsModule,
    VideoCallModule,
    TranslateModule,
    PrescriptionModule,
    PrescriptionDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
