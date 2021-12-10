import { ApiTags } from '@nestjs/swagger';
import { LoatMatHang } from './../entities/product_type.entity';
import { ProductTypeService } from './../services/product_type.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@ApiTags('product-type')
@Controller('product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  async addProductType(@Body() data: LoatMatHang, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New product type information is required' });
    }

    try {
      const newType = await this.productTypeService.create(data);
      return res.status(HttpStatus.CREATED).json(newType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllProductTypes(@Res() res: Response) {
    try {
      const types = await this.productTypeService.findAll();
      return res.status(HttpStatus.OK).json(types);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchAProductType(@Param('id') id: string, @Res() res: Response) {
    try {
      const type = await this.productTypeService.findOne(id);
      if (!type) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a product type with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(type);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateProductType(
    @Param('id') id: string,
    @Body() data: LoatMatHang,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New product type information is required' });
    }

    try {
      const type = await this.productTypeService.findOne(id);
      if (!type) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a product type with id ${id}`,
        });
      }

      const updatedType = await this.productTypeService.update(id, data);
      return res.status(HttpStatus.OK).json(updatedType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteProductType(@Param('id') id: string, @Res() res: Response) {
    try {
      const type = await this.productTypeService.findOne(id);
      if (!type) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a product type with id ${id} to delete`);
      }

      // check xem con mat hang nao thuoc loai mat hang nay ko, neu ko con moi xoa

      await this.productTypeService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete product type successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
