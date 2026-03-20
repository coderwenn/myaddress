import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  account!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ type: 'boolean', default: false })
  is_admin!: boolean;

  @Column({ type: 'boolean', default: false })
  has_backoffice!: boolean;
}
