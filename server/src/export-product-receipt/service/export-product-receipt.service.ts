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

  findAll() {
    return this.exportReceiptRepo.find({ relations: ['kho', 'nguoiLap'] });
  }

  findOne(id: number) {
    return this.exportReceiptRepo.findOne(id, {
      relations: ['kho', 'nguoiLap', 'dsCTPhieuXuat'],
    });
  }

  async update(id: number, data: UpdateExportProductReceiptDto) {
    const response = await this.exportReceiptRepo
      .createQueryBuilder('imReceipt')
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
