import { NhaSanXuat } from './entities/producer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NhaSanXuat])],
  controllers: [ProducerController],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
