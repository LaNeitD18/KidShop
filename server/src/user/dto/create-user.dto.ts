import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id: number;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  quyen?: string;
}
