import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { Kho } from './entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kho])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
