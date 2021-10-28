import { CuaHang } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Repository, UpdateResult } from 'typeorm';
import { NguoiDung } from 'src/user/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(CuaHang)
    private readonly storeRepository: Repository<CuaHang>,
  ) {}

  create(newStore: CuaHang) {
    return this.storeRepository.save(newStore);
  }

  findAll() {
    return this.storeRepository.find({ relations: ['chuCuaHang'] });
  }

  findOne(id: string) {
    return this.storeRepository.findOne(id);
  }

  update(id: string, updatedStore: CuaHang) {
    return this.storeRepository.update(id, updatedStore);
  }

  remove(id: string) {
    return this.storeRepository.delete(id);
  }
}
