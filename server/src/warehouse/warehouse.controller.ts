import { CreateWarehouseDto } from './dto/create-warehouse.dto';
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
import { WarehouseService } from './warehouse.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Kho } from './entities/warehouse.entity';
import { UserService } from 'src/user/user.service';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async addWarehouse(@Body() data: CreateWarehouseDto, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New warehouse information is required' });
    }

    try {
      const { idQuanLyKho, ...restData } = data;

      const warehouseManager = await this.userService.findOne(idQuanLyKho);
      if (!warehouseManager) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find user with id ${idQuanLyKho} to set warehouse manager`,
          );
      }

      const warehouseData: Kho = {
        ...restData,
        quanLyKho: warehouseManager,
      };

      const newWarehouse = await this.warehouseService.create(warehouseData);
      return res.status(HttpStatus.CREATED).json(newWarehouse);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllWarehouses(@Res() res: Response) {
    try {
      const warehouses = await this.warehouseService.findAll();
      return res.status(HttpStatus.OK).json(warehouses);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchAWarehouse(@Param('id') id: string, @Res() res: Response) {
    try {
      const warehouse = await this.warehouseService.findOne(id);
      if (!warehouse) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a warehouse with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(warehouse);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() data: CreateWarehouseDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New warehouse information is required' });
    }

    const { idQuanLyKho, ...restData } = data;

    try {
      const warehouse = await this.warehouseService.findOne(id);
      if (!warehouse) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a warehouse with id ${id}`,
        });
      }

      const warehouseManager = await this.userService.findOne(idQuanLyKho);
      if (!warehouseManager) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find user with id ${idQuanLyKho} to set warehouse manager`,
          );
      }

      const updatedWarehouse = await this.warehouseService.update(id, {
        ...restData,
        quanLyKho: warehouseManager,
      });
      return res.status(HttpStatus.OK).json(updatedWarehouse);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteWarehouse(@Param('id') id: string, @Res() res: Response) {
    try {
      const warehouse = await this.warehouseService.findOne(id);
      if (!warehouse) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a warehouse with id ${id} to delete`);
      }

      await this.warehouseService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete warehouse successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
