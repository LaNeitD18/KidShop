import { PartialType } from '@nestjs/swagger';
import { CreateImportProductReceiptDto } from './create-import-product-receipt.dto';

export class UpdateImportProductReceiptDto extends PartialType(CreateImportProductReceiptDto) {}
