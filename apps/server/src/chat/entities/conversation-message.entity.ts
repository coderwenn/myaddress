import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity({ name: 'conversation_messages' })
export class ConversationMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'text', nullable: true })
  ai_response?: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: 'user' | 'assistant' | 'system';

  @Column({ type: 'varchar', length: 10, default: 'text' })
  content_type!: 'text' | 'img';

  @Column({ type: 'varchar', length: 40, nullable: true })
  provider?: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  model?: string;

  @Column({ type: 'int', nullable: true })
  user_id?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column()
  conversation_id!: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;
}
