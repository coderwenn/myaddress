import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserStatus } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async listUsers() {
    const data = await this.usersService.listUsers();
    return { code: '200', data, msg: 'ok' };
  }

  @Post()
  async createUser(
    @Body()
    body: {
      account: string;
      password: string;
      status?: UserStatus;
      is_admin?: boolean;
      has_backoffice?: boolean;
    },
  ) {
    const user = await this.usersService.createUser(body);
    return { code: '200', data: user, msg: 'ok' };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      password?: string;
      status?: UserStatus;
      is_admin?: boolean;
      has_backoffice?: boolean;
      account?: string;
    },
  ) {
    const user = await this.usersService.updateUser(Number(id), body);
    return { code: '200', data: user, msg: 'ok' };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(Number(id));
    return { code: '200', data: true, msg: 'ok' };
  }
}
