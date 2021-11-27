import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty()
  tenMH: string;

  @ApiProperty()
  donVi: string;

  @ApiProperty()
  giaNhap: number;

  @ApiProperty()
  giaBan: number;

  @ApiProperty()
  kichThuoc?: string;

  @ApiProperty()
  mauSac?: string;

  @ApiProperty()
  hinhAnh?: string;

  idNSX: number;

  idNCC: number;
}
