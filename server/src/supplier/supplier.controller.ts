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
import { SupplierService } from './supplier.service';
import { Response } from 'express';
import { NhaCungCap } from './entities/supplier.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async addSupplier(@Body() data: NhaCungCap, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New supplier information is required' });
    }

    try {
      const newSupplier = await this.supplierService.create(data);
      return res.status(HttpStatus.CREATED).json(newSupplier);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllSuppliers(@Res() res: Response) {
    try {
      const suppliers = await this.supplierService.findAll();
      return res.status(HttpStatus.OK).json(suppliers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchASupplier(@Param('id') id: string, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a supplier with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(supplier);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() data: NhaCungCap,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New supplier information is required' });
    }

    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a supplier with id ${id}`,
        });
      }

      const updatedSupplier = await this.supplierService.update(id, data);
      return res.status(HttpStatus.OK).json(updatedSupplier);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteSupplier(@Param('id') id: string, @Res() res: Response) {
    try {
      const supplier = await this.supplierService.findOne(id);
      if (!supplier) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a supplier with id ${id} to delete`);
      }

      await this.supplierService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete supplier successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
