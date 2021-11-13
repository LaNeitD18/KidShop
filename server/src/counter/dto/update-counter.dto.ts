import { ApiProperty } from '@nestjs/swagger';

export class UpdateCounterDto {
  @ApiProperty()
  tenQuay?: string;

  @ApiProperty()
  idNhanVienTruc?: string;

  @ApiProperty()
  idCuaHang: string;
}
