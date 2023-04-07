import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(public usersService: UsersService) {}
  @Post('/auth')
  createUser(@Body() createUserDto: createUserDto) {
    this.usersService.create(createUserDto.email, createUserDto.password);
  }
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const userExists = await this.usersService.findOne(parseInt(id));
    if (!userExists) {
      throw new NotFoundException('user not found');
    }
    return userExists;
  }
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(parseInt(id), UpdateUserDto);
  }
}
