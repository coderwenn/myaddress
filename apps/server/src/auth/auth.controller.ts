import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { account: string; password: string }) {
    return this.authService.login(body.account, body.password);
  }

  @Post('register')
  register(@Body() body: { account: string; password: string }) {
    return this.authService.register(body.account, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { sub: number; account: string; is_admin: boolean; has_backoffice: boolean } }) {
    return {
      id: req.user.sub,
      account: req.user.account,
      is_admin: req.user.is_admin,
      has_backoffice: req.user.has_backoffice,
    };
  }
}
