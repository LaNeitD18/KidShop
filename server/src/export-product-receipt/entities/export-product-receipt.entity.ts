import { CuaHang } from './../../store/entities/store.entity';
import { CT_PhieuXuatKho } from 'src/export-product-receipt/entities/detail-export-receipt.entity';
import { NguoiDung } from './../../user/entities/user.entity';
import { Kho } from './../../warehouse/entities/warehouse.entity';
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

@Entity()
export class PhieuXuatKho {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  ghiChu?: string;

  @CreateDateColumn()
  taoLuc?: Date;

  @UpdateDateColumn()
  suaLuc?: Date;

  @ApiProperty()
  @ManyToOne(() => Kho, (kho) => kho.dsPhieuXuatKho)
  kho: Kho;

  @ApiProperty()
  @ManyToOne(() => CuaHang, (cuaHang) => cuaHang.dsPhieuXuatKho)
  cuaHang: CuaHang;

  @ApiProperty()
  @ManyToOne(() => NguoiDung, (nguoiDung) => nguoiDung.dsPhieuXuatKho)
  nguoiLap: NguoiDung;

  @OneToMany(() => CT_PhieuXuatKho, (ctPhieuXuat) => ctPhieuXuat.phieuXuatKho)
  dsCTPhieuXuat?: CT_PhieuXuatKho[];
}
