import { ProductTypeService } from './services/product_type.service';
import { MatHang } from './entities/product.entity';
import { LoatMatHang } from './entities/product_type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductTypeController } from './controllers/product_type.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoatMatHang, MatHang])],
  controllers: [ProductController, ProductTypeController],
  providers: [ProductService, ProductTypeService],
})
export class ProductModule {}
