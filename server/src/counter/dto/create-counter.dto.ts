import { ApiProperty } from '@nestjs/swagger';

export class CreateCounterDto {
  @ApiProperty()
  tenQuay?: string;

  @ApiProperty()
  dangSuDung: boolean;

  @ApiProperty()
  nhanVienTrucId?: string;

  @ApiProperty()
  cuaHangId: string;
}
