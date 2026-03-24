import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiProvider } from './entities/api-key.entity';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async list() {
    const data = await this.apiKeysService.list();
    return { code: '200', data, msg: 'ok' };
  }

  @Get('available')
  async available(
    @Query('user_id') userId: string,
    @Query('provider') provider?: ApiProvider,
  ) {
    const numericUserId = Number(userId);
    if (!userId || Number.isNaN(numericUserId)) {
      throw new BadRequestException('user_id is required');
    }
    const available = await this.apiKeysService.hasAvailableKey(
      numericUserId,
      provider,
    );
    return { code: '200', data: { available }, msg: 'ok' };
  }

  @Post()
  async create(
    @Body()
    body: {
      user_id: number;
      provider: ApiProvider;
      api_key: string;
      allowed_users?: number[];
      is_active?: boolean;
      remark?: string;
    },
  ) {
    const data = await this.apiKeysService.create(body);
    return { code: '200', data, msg: 'ok' };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      user_id?: number;
      provider?: ApiProvider;
      api_key?: string;
      allowed_users?: number[];
      is_active?: boolean;
      remark?: string;
    },
  ) {
    const data = await this.apiKeysService.update(Number(id), body);
    return { code: '200', data, msg: 'ok' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.apiKeysService.remove(Number(id));
    return { code: '200', data: true, msg: 'ok' };
  }
}
