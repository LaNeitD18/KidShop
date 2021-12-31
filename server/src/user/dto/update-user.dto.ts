import { CuaHang } from 'src/store/entities/store.entity';
import { Quay } from 'src/counter/entities/counter.entity';
import { HoaDon } from 'src/bill/entities/bill.entity';
import { PhieuXuatKho } from './../../export-product-receipt/entities/export-product-receipt.entity';
import { PhieuNhapKho } from './../../import-product-receipt/entities/import-product-receipt.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity()
export class UpdateUserDto {
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  tenTaiKhoan: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  matKhauCu: string;

  @ApiProperty()
  hoTen: string;

  @ApiProperty({ required: false })
  diaChi?: string;

  @ApiProperty({ required: false })
  sdt?: string;

  @ApiProperty({ required: false })
  gioiTinh?: string;

  @ApiProperty({ required: false })
  quyen?: string;

  // maNhom: string
  @OneToMany(() => PhieuNhapKho, (phieuNhap) => phieuNhap.nguoiLap)
  dsPhieuNhapKho?: PhieuNhapKho[];

  @OneToMany(() => PhieuXuatKho, (phieuXuat) => phieuXuat.nguoiLap)
  dsPhieuYeuCauNhapHang?: PhieuXuatKho[];

  @OneToMany(() => PhieuXuatKho, (phieuXuat) => phieuXuat.quanLyKho)
  dsPhieuXuatKho?: PhieuXuatKho[];

  @ManyToOne(() => CuaHang, (store) => store.dsNhanVien)
  cuaHang?: CuaHang;

  @OneToOne(() => Quay, (quay) => quay.nhanVienTruc)
  quay?: Quay;

  @OneToMany(() => HoaDon, (hoaDon) => hoaDon.nguoiLap)
  dsHoaDon?: HoaDon[];
}
