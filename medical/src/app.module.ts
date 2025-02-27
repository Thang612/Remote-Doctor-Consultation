import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { DegreeModule } from './degree/degree.module';
import { SpecialtyModule } from './specialty/specialty.module';
import { Degree } from './degree/entities/degree.entity';
import { Specialty } from './specialty/entities/specialty.entity';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33061,
      username: 'root',
      password: 'root',
      database: 'medical1',
      entities: [User, Degree, Specialty],
      synchronize: true,
    }),
    UserModule,
    DegreeModule,
    SpecialtyModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
