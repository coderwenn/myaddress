import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  listUsers() {
    return this.userRepo.find({ order: { id: 'DESC' } });
  }

  findByAccount(account: string) {
    return this.userRepo.findOne({ where: { account } });
  }

  async createUser(payload: {
    account: string;
    password: string;
    is_admin?: boolean;
    has_backoffice?: boolean;
    status?: UserStatus;
  }) {
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = this.userRepo.create({
      account: payload.account,
      password: passwordHash,
      is_admin: payload.is_admin ?? false,
      has_backoffice: payload.has_backoffice ?? false,
      status: payload.status ?? UserStatus.ACTIVE,
    });
    return this.userRepo.save(user);
  }

  async updateUser(
    id: number,
    payload: {
      account?: string;
      password?: string;
      is_admin?: boolean;
      has_backoffice?: boolean;
      status?: UserStatus;
    },
  ) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (payload.account !== undefined) {
      user.account = payload.account;
    }
    if (payload.password) {
      user.password = await bcrypt.hash(payload.password, 10);
    }
    if (payload.is_admin !== undefined) {
      user.is_admin = payload.is_admin;
    }
    if (payload.has_backoffice !== undefined) {
      user.has_backoffice = payload.has_backoffice;
    }
    if (payload.status !== undefined) {
      user.status = payload.status;
    }
    return this.userRepo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.remove(user);
  }

  async verifyPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
