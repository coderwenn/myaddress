import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'qianxi11',
  database: process.env.DB_NAME ?? 'wennapp',
  synchronize: true,
  autoLoadEntities: true,
  logging: process.env.DB_LOGGING === 'true',
};
