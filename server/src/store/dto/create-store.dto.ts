import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty()
  diaChi: string;

  @ApiProperty({ required: false })
  sdt?: string;

  @ApiProperty({ required: false })
  chuCuaHangId?: string;
}
