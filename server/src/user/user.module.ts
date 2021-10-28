import { StoreModule } from './../store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NguoiDung } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NguoiDung]),
    forwardRef(() => StoreModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
