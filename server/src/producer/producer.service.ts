import { NhaSanXuat } from './entities/producer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(NhaSanXuat)
    private readonly producerRepository: Repository<NhaSanXuat>,
  ) {}

  create(data: NhaSanXuat) {
    return this.producerRepository.save(data);
  }

  findAll() {
    return this.producerRepository.find();
  }

  findOne(id: string) {
    return this.producerRepository.findOne(id);
  }

  async update(id: string, data: NhaSanXuat) {
    const response = await this.producerRepository
      .createQueryBuilder('producer')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'tenNSX', 'diaChi', 'sdt'])
      .updateEntity(true)
      .execute();

    const updatedProducer = response.raw[0] as NhaSanXuat;
    return updatedProducer;
  }

  delete(id: string) {
    return this.producerRepository.delete(id);
  }
}
