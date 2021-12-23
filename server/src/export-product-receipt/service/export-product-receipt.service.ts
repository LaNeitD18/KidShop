import { PhieuXuatKho } from './../entities/export-product-receipt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateExportProductReceiptDto } from '../dto/create-export-product-receipt.dto';
import { UpdateExportProductReceiptDto } from '../dto/update-export-product-receipt.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ExportProductReceiptService {
  constructor(
    @InjectRepository(PhieuXuatKho)
    private readonly exportReceiptRepo: Repository<PhieuXuatKho>,
  ) {}

  create(newExportReceipt: PhieuXuatKho) {
    return this.exportReceiptRepo.save(newExportReceipt);
  }

  findAll(placeId: number, place: string) {
    if (place == 'warehouse') {
      return this.exportReceiptRepo.find({
        relations: ['cuaHang', 'nguoiLap'],
        where: {
          kho: {
            id: placeId,
          },
        },
      });
    }
    return this.exportReceiptRepo.find({
      relations: ['kho', 'nguoiLap'],
      where: {
        cuaHang: {
          id: placeId,
        },
      },
    });
  }

  findOne(id: number) {
    return this.exportReceiptRepo.findOne(id, {
      relations: [
        'kho',
        'cuaHang',
        'nguoiLap',
        'dsCTPhieuXuat',
        'dsCTPhieuXuat.matHang',
      ],
    });
  }

  async update(id: number, data: UpdateExportProductReceiptDto) {
    const response = await this.exportReceiptRepo
      .createQueryBuilder('exReceipt')
      .update(data)
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();

    const updatedReceipt = response.raw[0] as PhieuXuatKho;
    return updatedReceipt;
  }

  remove(id: number) {
    return this.exportReceiptRepo.delete(id);
  }
}
