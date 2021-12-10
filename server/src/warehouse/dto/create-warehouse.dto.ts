import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty()
  diaChi: string;

  @ApiProperty()
  kinhDo: number;

  @ApiProperty()
  viDo: number;

  @ApiProperty()
  viTri: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  idQuanLyKho: string;
}
