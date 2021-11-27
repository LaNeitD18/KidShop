import { ApiTags } from '@nestjs/swagger';
import { NhaSanXuat } from './entities/producer.entity';
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
import { Response } from 'express';
import { NhaCungCap } from 'src/supplier/entities/supplier.entity';
import { ProducerService } from './producer.service';

@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async addProducer(@Body() data: NhaSanXuat, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New producer information is required' });
    }

    try {
      const newProducer = await this.producerService.create(data);
      return res.status(HttpStatus.CREATED).json(newProducer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get()
  async fetchAllProducers(@Res() res: Response) {
    try {
      const producers = await this.producerService.findAll();
      return res.status(HttpStatus.OK).json(producers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async fetchAProducer(@Param('id') id: number, @Res() res: Response) {
    try {
      const producer = await this.producerService.findOne(id);
      if (!producer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a producer with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(producer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateProducer(
    @Param('id') id: number,
    @Body() data: NhaSanXuat,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New producer information is required' });
    }

    try {
      const producer = await this.producerService.findOne(id);
      if (!producer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a producer with id ${id}`,
        });
      }

      const updatedProducer = await this.producerService.update(id, data);
      return res.status(HttpStatus.OK).json(updatedProducer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteProducer(@Param('id') id: number, @Res() res: Response) {
    try {
      const producer = await this.producerService.findOne(id);
      if (!producer) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(`Can not find a producer with id ${id} to delete`);
      }

      await this.producerService
        .delete(id)
        .then(() =>
          res.status(HttpStatus.OK).send('Delete producer successfully'),
        );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
