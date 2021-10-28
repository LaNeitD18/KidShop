import { UserService } from './../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { CuaHang } from './entities/store.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createStore(@Body() newStore: CuaHang, @Body() storeManagerId: string) {
    const storeManager = await this.userService.findOne(storeManagerId);
    if (storeManager) {
      newStore.chuCuaHang = storeManager;
    }
    return this.storeService.create(newStore);
  }

  @Get()
  fetchAllStores() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedStore: CuaHang) {
    return this.storeService.update(id, updatedStore);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
