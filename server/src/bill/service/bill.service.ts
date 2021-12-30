import { HoaDon } from 'src/bill/entities/bill.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillDto } from '../dto/create-bill.dto';
import { UpdateBillDto } from '../dto/update-bill.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(HoaDon)
    private readonly billRepo: Repository<HoaDon>,
  ) {}

  create(newBill: HoaDon) {
    return this.billRepo.save(newBill);
  }

  findAll(storeId: number) {
    return this.billRepo.find({
      relations: ['quay', 'nguoiLap', 'khachHang', 'dsCTHoaDon', 'dsCTHoaDon.matHang'],
      where: {
        quay: {
          cuaHang: {
            id: storeId,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.billRepo.findOne(id, {
      relations: [
        'quay',
        'nguoiLap',
        'khachHang',
        'dsCTHoaDon',
        'dsCTHoaDon.matHang',
      ],
    });
  }

  async update(id: number, data) {
    const response = await this.billRepo
      .createQueryBuilder('bill')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedBill = response.raw[0] as HoaDon;
    return updatedBill;
  }

  delete(id: number) {
    return this.billRepo.delete(id);
  }
}
