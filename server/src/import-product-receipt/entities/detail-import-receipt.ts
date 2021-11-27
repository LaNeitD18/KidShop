import { PhieuNhapKho } from './import-product-receipt.entity';
import { MatHang } from './../../product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CT_PhieuNhapKho {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  soLuong: number;

  @ManyToOne(() => MatHang, (mh) => mh.dsCTPhieuNhapKho)
  matHang: MatHang;

  @ManyToOne(() => PhieuNhapKho, (phieuNhap) => phieuNhap.dsCTPhieuNhap)
  phieuNhapKho: PhieuNhapKho;
}
