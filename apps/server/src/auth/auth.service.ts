import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(account: string, password: string) {
    const user = await this.usersService.findByAccount(account);
    if (!user) return null;
    if (user.status !== UserStatus.ACTIVE) return null;
    const isValid = await this.usersService.verifyPassword(user, password);
    if (!isValid) return null;
    return user;
  }

  async login(account: string, password: string) {
    const user = await this.validateUser(account, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      account: user.account,
      is_admin: user.is_admin,
      has_backoffice: user.has_backoffice,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user: payload };
  }

  async register(account: string, password: string) {
    const existing = await this.usersService.findByAccount(account);
    if (existing) {
      throw new UnauthorizedException('Account already exists');
    }
    const user = await this.usersService.createUser({ account, password });
    return { id: user.id, account: user.account };
  }
}
