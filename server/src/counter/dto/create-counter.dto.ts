import { ApiProperty } from '@nestjs/swagger';

export class CreateCounterDto {
  @ApiProperty()
  tenQuay?: string;

  @ApiProperty()
  cuaHangId: string;
}
