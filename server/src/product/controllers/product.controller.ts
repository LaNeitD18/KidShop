import { MatHang } from './../entities/product.entity';
import { ProducerService } from './../../producer/producer.service';
import { SupplierService } from './../../supplier/supplier.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../services/product.service';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly producerService: ProducerService,
    private readonly supplierService: SupplierService,
  ) {}

  @Post()
  async create(@Body() data: UpdateProductDto, @Res() res: Response) {
    try {
      const { idNCC, idNSX, ...restData } = data;

      const producer = await this.producerService.findOne(idNSX);
      if (!producer) {
        return res.status(HttpStatus.NOT_FOUND).send(`Producer doesn't exist.`);
      }

      const supplier = await this.supplierService.findOne(idNCC);
      if (!supplier) {
        return res.status(HttpStatus.NOT_FOUND).send(`Supplier doesn't exist.`);
      }

      const productData: MatHang = {
        ...restData,
        nhaSX: producer,
        nhaCC: supplier,
      };

      const newProduct = await this.productService.create(productData);

      return res.status(HttpStatus.CREATED).json(newProduct);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  getAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const product = await this.productService.findOne(id);
      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Product doesn't exist`,
        });
      }
      return res.status(HttpStatus.OK).json(product);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const { idNCC, idNSX, ...restData } = data;

      const producer = await this.producerService.findOne(idNSX);
      if (!producer) {
        return res.status(HttpStatus.NOT_FOUND).send(`Producer doesn't exist.`);
      }

      const supplier = await this.supplierService.findOne(idNCC);
      if (!supplier) {
        return res.status(HttpStatus.NOT_FOUND).send(`Supplier doesn't exist.`);
      }

      const productData: MatHang = {
        ...restData,
        nhaSX: producer,
        nhaCC: supplier,
      };

      const updatedProduct = await this.productService.update(id, productData);
      return res.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteStore(@Param('id') id: number, @Res() res: Response) {
    try {
      const product = await this.productService.findOne(id);
      if (!product) {
        return res.status(HttpStatus.NOT_FOUND).send(`Product doesn't exist`);
      }

      await this.productService
        .remove(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete product successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
