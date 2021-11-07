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
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  diaChi: string;

  @ApiProperty()
  @Column()
  kinhDo: number;

  @ApiProperty()
  @Column()
  viDo: number;

  @ApiProperty()
  @Column()
  sdt: string;

  @ApiProperty()
  @Column()
  viTri: string;

  @OneToOne(() => NguoiDung)
  @JoinColumn()
  chuCuaHang: NguoiDung;

  @OneToMany(() => Quay, (quay) => quay.cuaHang)
  dsQuay?: Quay[];
}
