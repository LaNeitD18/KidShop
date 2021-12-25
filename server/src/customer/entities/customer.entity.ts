import { HoaDon } from 'src/bill/entities/bill.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CT_KhachHang } from './customer-detail.entity';

@Entity()
export class KhachHang {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  hoTen: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  diaChi?: string;

  @ApiProperty()
  @Column()
  sdt: string;

  @ApiProperty()
  @Column()
  gioiTinh?: string;

  @ApiProperty()
  @Column()
  ngaySinh: Date;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @OneToMany(() => HoaDon, (hoaDon) => hoaDon.khachHang)
  dsHoaDon?: HoaDon[];

  @OneToMany(() => CT_KhachHang, (ctKhachHang) => ctKhachHang.khachHang)
  dsCTKhachHang?: CT_KhachHang[]
}
