import { KhachHang } from './../../customer/entities/customer.entity';
import { Quay } from './../../counter/entities/counter.entity';
import { NguoiDung } from './../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CT_HOADON } from './bill-detail.entity';

@Entity()
export class HoaDon {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  tongHoaDon: number;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @ManyToOne(() => Quay, (quay) => quay.dsHoaDon)
  quay: Quay;

  @ManyToOne(() => NguoiDung, (nguoiDung) => nguoiDung.dsHoaDon)
  nguoiLap: NguoiDung;

  @ManyToOne(() => KhachHang, (khachHang) => khachHang.dsHoaDon)
  khachHang: KhachHang;

  @OneToMany(() => CT_HOADON, (ctHoaDon) => ctHoaDon.hoaDon)
  dsCTHoaDon?: CT_HOADON[];
}
