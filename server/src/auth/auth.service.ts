import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user[0].matKhau);
    if (isMatch) {
      const { matKhau, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const payload = { username: user.tenTaiKhoan };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
