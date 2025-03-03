import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  experience: number;

  @ManyToOne(() => Degree, (degree) => degree.doctors)
  degree: Degree;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
  specialty: Specialty;

  @OneToOne(() => User, (user) => user.doctor, { cascade: true }) // One-to-One
  @JoinColumn()
  user: User;

  @Column()
  fee: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
