import { Appointment } from 'src/appointments/entities/appointment.entity';
import { PrescriptionDetails } from 'src/prescription-details/entities/prescription-details.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Prescriptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diagnosis: string;

  @Column()
  symptom: string;

  @Column()
  note: string;

  @OneToMany(() => PrescriptionDetails, (detail) => detail.prescription)
  details: PrescriptionDetails[];

  @OneToOne(() => Appointment, (appointment) => appointment.prescriptions)
  appointment: Appointment;
}
