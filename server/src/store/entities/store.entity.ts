import { Quay } from './../../counter/entities/counter.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CuaHang {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  sdt?: string;

  @OneToOne(() => NguoiDung)
  @JoinColumn()
  chuCuaHang?: NguoiDung;

  @OneToMany(() => Quay, (quay) => quay.cuaHang)
  dsQuay?: Quay[];
}
