import { PartialType } from '@nestjs/swagger';
import { CreateExportProductReceiptDto } from './create-export-product-receipt.dto';

export class UpdateExportProductReceiptDto extends PartialType(CreateExportProductReceiptDto) {}
