import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => Prescriptions, (prescriptions) => appointment.prescriptions)
  prescriptions: Prescriptions;
}
