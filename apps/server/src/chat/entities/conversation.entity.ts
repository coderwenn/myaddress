import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConversationMessage } from './conversation-message.entity';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', default: 1 })
  user_id!: number;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_message_preview?: string;

  @Column({ type: 'timestamp', nullable: true })
  last_message_at?: Date;

  @Column({ type: 'int', default: 0 })
  message_count!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;

  @OneToMany(() => ConversationMessage, (message) => message.conversation)
  messages?: ConversationMessage[];
}
