import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDetailDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  idMatHang: number;

  @ApiProperty()
  soLuong: number;

  @ApiProperty()
  tongTien: number;

  @ApiProperty()
  giamGia?: number;
}
