import { PhieuXuatKho } from './export-product-receipt.entity';
import { MatHang } from '../../product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CT_PhieuXuatKho {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @ApiProperty()
  @Column()
  soLuong: number;

  @ManyToOne(() => MatHang, (mh) => mh.dsCTPhieuXuatKho)
  matHang: MatHang;

  @ManyToOne(() => PhieuXuatKho, (phieuXuat) => phieuXuat.dsCTPhieuXuat)
  phieuXuatKho: PhieuXuatKho;
}
