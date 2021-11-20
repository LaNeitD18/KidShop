import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user[0]?.matKhau) return null;
    const isMatch = await bcrypt.compare(pass, user[0]?.matKhau);
    if (isMatch) {
      const { matKhau, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const payload = { username: user.tenTaiKhoan };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verify(token: string) {
    return {
      accessToken: this.jwtService.verify(token),
    };
  }
}
