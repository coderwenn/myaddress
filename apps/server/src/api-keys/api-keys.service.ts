import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey, ApiProvider } from './entities/api-key.entity';
import crypto from 'crypto';

type CreatePayload = {
  user_id: number;
  provider: ApiProvider;
  api_key: string;
  allowed_users?: number[];
  is_active?: boolean;
  remark?: string;
};

type UpdatePayload = {
  user_id?: number;
  provider?: ApiProvider;
  api_key?: string;
  allowed_users?: number[];
  is_active?: boolean;
  remark?: string;
};

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  private getSecret() {
    return process.env.APIKEY_SECRET ?? process.env.JWT_SECRET ?? 'dev-secret';
  }

  private encryptApiKey(plain: string) {
    const key = crypto.createHash('sha256').update(this.getSecret()).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return `${iv.toString('base64')}:${encrypted.toString('base64')}`;
  }

  private maskApiKey(plain: string) {
    const last4 = plain.slice(-4);
    return last4 ? `****${last4}` : '****';
  }

  async list() {
    return this.apiKeyRepo.find({ order: { id: 'DESC' } });
  }

  async create(payload: CreatePayload) {
    const apiKey = this.apiKeyRepo.create({
      user_id: payload.user_id,
      provider: payload.provider,
      api_key_encrypted: this.encryptApiKey(payload.api_key),
      api_key_preview: this.maskApiKey(payload.api_key),
      allowed_users: payload.allowed_users ?? [],
      is_active: payload.is_active ?? true,
      remark: payload.remark,
    });
    return this.apiKeyRepo.save(apiKey);
  }

  async update(id: number, payload: UpdatePayload) {
    const apiKey = await this.apiKeyRepo.findOne({ where: { id } });
    if (!apiKey) throw new NotFoundException('ApiKey not found');

    if (payload.user_id !== undefined) apiKey.user_id = payload.user_id;
    if (payload.provider !== undefined) apiKey.provider = payload.provider;
    if (payload.allowed_users !== undefined) apiKey.allowed_users = payload.allowed_users;
    if (payload.is_active !== undefined) apiKey.is_active = payload.is_active;
    if (payload.remark !== undefined) apiKey.remark = payload.remark;
    if (payload.api_key) {
      apiKey.api_key_encrypted = this.encryptApiKey(payload.api_key);
      apiKey.api_key_preview = this.maskApiKey(payload.api_key);
    }
    return this.apiKeyRepo.save(apiKey);
  }

  async remove(id: number) {
    const apiKey = await this.apiKeyRepo.findOne({ where: { id } });
    if (!apiKey) throw new NotFoundException('ApiKey not found');
    await this.apiKeyRepo.remove(apiKey);
  }
}
