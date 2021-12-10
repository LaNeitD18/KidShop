import { SupplierModule } from './../supplier/supplier.module';
import { ProducerModule } from './../producer/producer.module';
import { MatHang } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatHang]),
    forwardRef(() => ProducerModule),
    forwardRef(() => SupplierModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
