import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NguoiDung } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(NguoiDung)
    private readonly userRepository: Repository<NguoiDung>,
  ) {}

  async create(data: NguoiDung) {
    return await this.userRepository.save(data);
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'tenTaiKhoan', 'hoTen', 'diaChi', 'sdt', 'gioiTinh'],
    });
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne(id, {
        select: ['id', 'tenTaiKhoan', 'hoTen', 'diaChi', 'sdt', 'gioiTinh'],
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id: string, data: NguoiDung): Promise<NguoiDung> {
    const response = await this.userRepository
      .createQueryBuilder('user')
      .update(data)
      .where('id = :id', { id: id })
      .returning(['id', 'tenTaiKhoan', 'hoTen', 'diaChi', 'sdt', 'gioiTinh'])
      .updateEntity(true)
      .execute();

    const updatedUser = response.raw[0] as NguoiDung;
    return updatedUser;
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
