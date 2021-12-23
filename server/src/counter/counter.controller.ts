import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { StoreService } from './../store/store.service';
import { UserService } from './../user/user.service';
import { Quay } from './entities/counter.entity';
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
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('counter')
@Controller('counter')
// @UseGuards(JwtAuthGuard)
export class CounterController {
  constructor(
    private readonly counterService: CounterService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
  ) {}

  @Post()
  async addCounter(@Body() data: CreateCounterDto, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New counter information is required' });
    }

    try {
      const store = await this.storeService.findOne(data.idCuaHang);
      if (!store) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find  a store with id ${data.idCuaHang} to add a new counter`,
          );
      }

      const counterData: Quay = {
        tenQuay: data.tenQuay,
        cuaHang: store,
      };

      const newCounter = await this.counterService.create(counterData);
      return res.status(HttpStatus.CREATED).json(newCounter);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllCounters(@Res() res: Response) {
    try {
      const counters = await this.counterService.findAll();
      return res.status(HttpStatus.OK).json(counters);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchACounter(@Param('id') id: string, @Res() res: Response) {
    try {
      const counter = await this.counterService.findOne(id);
      if (!counter) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a counter with id ${id}`);
      }
      return res.status(HttpStatus.OK).json(counter);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateCounter(
    @Param('id') id: string,
    @Body() data: UpdateCounterDto,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New counter information is required' });
    }

    try {
      const counter = await this.counterService.findOne(id);
      if (!counter) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a store with id ${id}`,
        });
      }

      const { idNhanVienTruc, idCuaHang, ...rest } = data;

      const store = await this.storeService.findOne(idCuaHang);
      if (!store) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(
            `Can not find  a store with id ${idCuaHang} to add a new counter`,
          );
      }

      let onDutyEmployee = null;
      if (idNhanVienTruc) {
        onDutyEmployee = await this.userService.findOne(idNhanVienTruc);
        if (!onDutyEmployee) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .send(`Can not find a user with id ${idNhanVienTruc} to assign`);
        }
      }

      if (
        idNhanVienTruc !== null &&
        !(await this.counterService.isAvailable(idNhanVienTruc))
      ) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Người dùng đang trực ở quầy khác' });
      }

      const newData: Quay = {
        ...rest,
        nhanVienTruc: onDutyEmployee,
        cuaHang: store,
      };

      const updatedCounter = await this.counterService.update(id, newData);
      return res.status(HttpStatus.OK).json(updatedCounter);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteCounter(@Param('id') id: string, @Res() res: Response) {
    try {
      const counter = await this.counterService.findOne(id);
      if (!counter) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a counter with id ${id} to delete`);
      }

      await this.counterService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete counter successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
