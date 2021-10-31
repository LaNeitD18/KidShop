import { StoreModule } from './../store/store.module';
import { UserModule } from './../user/user.module';
import { Quay } from './entities/counter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterController } from './counter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quay]),
    forwardRef(() => UserModule),
    forwardRef(() => StoreModule),
  ],
  controllers: [CounterController],
  providers: [CounterService],
})
export class CounterModule {}
