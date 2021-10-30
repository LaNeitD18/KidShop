import { StoreService } from './../store/store.service';
import { NguoiDung } from 'src/user/entities/user.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService,
  ) {}

  @ApiCreatedResponse({ type: NguoiDung })
  @Post()
  async addUser(@Body() data: NguoiDung, @Res() res: Response) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New user information is required' });
    }

    if (data.id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New user must not have id field' });
    }

    try {
      const newUser = await this.userService.create(data);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOkResponse({ isArray: true, type: NguoiDung })
  @Get()
  async fetchAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOkResponse({ type: NguoiDung })
  @ApiNotFoundResponse()
  @Get(':id')
  async fetchAUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a user with id ${id}`,
        });
      }
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: NguoiDung,
    @Res() res: Response,
  ) {
    if (!data) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'New user information is required' });
    }

    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a user with id ${id}`,
        });
      }

      const updatedUser = await this.userService.update(id, data);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: `Can not find a user with id ${id}`,
        });
      }

      const stores = (await this.storeService.findAll()).filter(
        (store) => store.chuCuaHang?.id.toString() === id,
      );
      if (stores.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Can not delete a user with id ${id}. This user is still a store manager`,
        });
      }

      await this.userService.remove(id).then(() =>
        res.status(HttpStatus.OK).json({
          message: `Delete a user with id ${id} successfully`,
        }),
      );
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
