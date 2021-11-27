import { Quay } from './entities/counter.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Quay)
    private readonly counterRepository: Repository<Quay>,
  ) {}

  create(data: Quay) {
    return this.counterRepository.save(data);
  }

  findAll() {
    return this.counterRepository.find({
      relations: ['nhanVienTruc', 'cuaHang'],
    });
  }

  findOne(id: string) {
    return this.counterRepository.findOne(id, {
      relations: ['nhanVienTruc', 'cuaHang'],
    });
  }

  async update(id: string, data: Quay) {
    const response = await this.counterRepository
      .createQueryBuilder('counter')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'tenQuay', 'nhanVienTruc', 'cuaHang'])
      .updateEntity(true)
      .execute();

    const updatedCounter = response.raw[0] as Quay;
    return updatedCounter;
  }

  delete(id: string) {
    return this.counterRepository.delete(id);
  }
}
