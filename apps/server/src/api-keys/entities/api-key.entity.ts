import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ApiProvider {
  QWEN = 'QWEN',
  DEEPSEEK = 'DEEPSEEK',
}

@Entity({ name: 'api_keys' })
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  user_id!: number;

  @Column({ type: 'enum', enum: ApiProvider })
  provider!: ApiProvider;

  @Column({ type: 'text' })
  api_key_encrypted!: string;

  @Column({ type: 'varchar', length: 16 })
  api_key_preview!: string;

  @Column({ type: 'simple-json', nullable: true })
  allowed_users?: number[];

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark?: string;

  @Column({ type: 'timestamp', nullable: true })
  last_used_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
