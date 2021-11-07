import { Quay } from './../../counter/entities/counter.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CuaHang {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty()
  kinhDo: number;

  @ApiProperty()
  viDo: number;

  @ApiProperty()
  @Column()
  sdt: string;

  @ApiProperty()
  @Column()
  viTri: string;

  @ManyToOne(() => NguoiDung)
  @JoinColumn()
  chuCuaHang: NguoiDung;

  @OneToMany(() => Quay, (quay) => quay.cuaHang)
  dsQuay?: Quay[];
}
