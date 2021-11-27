import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  tenTaiKhoan: string;

  @ApiProperty()
  matKhau: string;
}
