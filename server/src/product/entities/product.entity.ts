import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MatHang {
  @PrimaryGeneratedColumn('increment')
  id?: string;

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
}
