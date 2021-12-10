import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
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
  idChuCuaHang: string;
}
