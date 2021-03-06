import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { SupplierModule } from './supplier/supplier.module';
import { CounterModule } from './counter/counter.module';
import { ProductModule } from './product/product.module';
import { ProducerModule } from './producer/producer.module';
import { AuthModule } from './auth/auth.module';
import { ImportProductReceiptModule } from './import-product-receipt/import-product-receipt.module';
import { ExportProductReceiptModule } from './export-product-receipt/export-product-receipt.module';

@Module({
  imports: [
    // make variables in .env global and accessible to use
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,

    StoreModule,

    WarehouseModule,

    SupplierModule,

    CounterModule,

    ProductModule,

    ProducerModule,

    AuthModule,

    ImportProductReceiptModule,

    ExportProductReceiptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
