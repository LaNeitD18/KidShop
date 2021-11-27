import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UserService } from './../user/user.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CuaHang } from './entities/store.entity';
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
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { Response } from 'express';

@ApiTags('store')
@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}

  @ApiCreatedResponse({ type: CuaHang })
  @Post()
  async createStore(@Body() data: CreateStoreDto, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New store information is required' });
    }

    try {
      const { idChuCuaHang, ...restData } = data;

      const storeManager = await this.userService.findOne(idChuCuaHang);
      if (!storeManager) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find user with id ${idChuCuaHang} to set store manager`,
          );
      }

      const storeData: CuaHang = {
        ...restData,
        chuCuaHang: storeManager,
      };

      const newStore = await this.storeService.create(storeData);
      return res.status(HttpStatus.CREATED).json(newStore);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllStores(@Res() res: Response) {
    try {
      const stores = await this.storeService.findAll();
      return res.status(HttpStatus.OK).json(stores);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchAStore(@Param('id') id: string, @Res() res: Response) {
    try {
      const store = await this.storeService.findOne(id);
      if (!store) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a store with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(store);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateStore(
    @Param('id') id: string,
    @Body() data: CreateStoreDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New store information is required' });
    }

    try {
      const store = await this.storeService.findOne(id);
      if (!store) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a store with id ${id}`,
        });
      }

      const { idChuCuaHang, ...restData } = data;

      const storeManager = await this.userService.findOne(idChuCuaHang);
      if (!storeManager) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find user with id ${idChuCuaHang} to set store manager`,
          );
      }

      const storeData: CuaHang = {
        ...restData,
        chuCuaHang: storeManager,
      };

      const updatedStore = await this.storeService.update(id, storeData);
      return res.status(HttpStatus.OK).json(updatedStore);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteStore(@Param('id') id: string, @Res() res: Response) {
    try {
      const store = await this.storeService.findOne(id);
      if (!store) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a store with id ${id} to delete`);
      }

      await this.storeService
        .remove(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete store successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
