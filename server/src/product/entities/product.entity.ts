import { NhaCungCap } from './../../supplier/entities/supplier.entity';
import { NhaSanXuat } from './../../producer/entities/producer.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CT_PhieuNhapKho } from '../../import-product-receipt/entities/detail-import-receipt.entity';
import { CT_PhieuXuatKho } from 'src/export-product-receipt/entities/detail-export-receipt.entity';

@Entity()
export class MatHang {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  tenMH: string;

  @ApiProperty()
  @Column()
  donVi: string;

  @ApiProperty()
  @Column()
  giaNhap: number;

  @ApiProperty()
  @Column()
  giaBan: number;

  @ApiProperty()
  @Column({ nullable: true })
  kichThuoc?: string;

  @ApiProperty()
  @Column({ nullable: true })
  mauSac?: string;

  @ApiProperty()
  @Column({ nullable: true })
  hinhAnh?: string;

  @OneToOne(() => NhaSanXuat)
  @JoinColumn()
  nhaSX: NhaSanXuat;

  @OneToOne(() => NhaCungCap)
  @JoinColumn()
  nhaCC: NhaCungCap;

  @OneToMany(() => CT_PhieuNhapKho, (ctPhieuNhapKho) => ctPhieuNhapKho.matHang)
  dsCTPhieuNhapKho?: CT_PhieuNhapKho[];

  @OneToMany(() => CT_PhieuXuatKho, (ctPhieuXuatKho) => ctPhieuXuatKho.matHang)
  dsCTPhieuXuatKho?: CT_PhieuXuatKho[];
}
