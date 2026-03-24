import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationMessage } from './entities/conversation-message.entity';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { ApiProvider } from '../api-keys/entities/api-key.entity';

type ImageTask = {
  id: string;
  status: 'PENDING' | 'SUCCEEDED';
  url?: string;
  created_at: number;
};

@Injectable()
export class ChatService {
  private imageTasks: Record<string, ImageTask> = {};

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationMessage)
    private readonly messageRepo: Repository<ConversationMessage>,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async listConversations(userId?: number) {
    const where = userId ? { user_id: userId } : {};
    const [list, total] = await this.conversationRepo.findAndCount({
      where,
      order: { updated_at: 'DESC' },
    });
    return { list, total };
  }

  async createConversation(payload: {
    title: string;
    content?: string;
    ai_response?: string;
    user_id: number;
  }) {
    const conversation = this.conversationRepo.create({
      title: payload.title || 'New Conversation',
      user_id: payload.user_id,
    });
    const saved = await this.conversationRepo.save(conversation);
    if (payload.content || payload.ai_response) {
      const message = this.messageRepo.create({
        content: payload.content,
        ai_response: payload.ai_response,
        conversation_id: saved.id,
        user_id: payload.user_id,
      });
      await this.messageRepo.save(message);
    }
    return { id: saved.id };
  }

  async getConversationDetail(conversationId: number, userId?: number) {
    const where: { conversation_id: number; user_id?: number } = {
      conversation_id: conversationId,
    };
    if (userId) {
      where.user_id = userId;
    }
    const messages = await this.messageRepo.find({
      where,
      order: { created_at: 'ASC' },
    });
    return { list: messages };
  }

  async appendConversationMessage(
    conversationId: number,
    userId: number,
    content: string,
    aiResponse: string,
    provider?: ApiProvider,
    model?: string,
  ) {
    const exists = await this.conversationRepo.findOne({
      where: { id: conversationId, user_id: userId },
    });
    if (!exists) {
      throw new NotFoundException('Conversation not found');
    }
    const userMessage = this.messageRepo.create({
      content,
      role: 'user',
      content_type: 'text',
      conversation_id: conversationId,
      user_id: userId,
    } as Partial<ConversationMessage>);
    const assistantMessage = this.messageRepo.create({
      content: aiResponse,
      role: 'assistant',
      content_type: 'text',
      conversation_id: conversationId,
      user_id: userId,
      provider: provider ?? null,
      model: model ?? null,
    } as Partial<ConversationMessage>);
    await this.messageRepo.save([userMessage, assistantMessage]);
    const preview = aiResponse || content;
    await this.conversationRepo.update(
      { id: conversationId },
      {
        last_message_preview: preview?.slice(0, 200),
        last_message_at: new Date(),
        message_count: (exists.message_count ?? 0) + 2,
      },
    );
  }

  private getProviderBaseUrl(provider: ApiProvider) {
    if (provider === ApiProvider.DEEPSEEK) {
      return process.env.DEEPSEEK_API_BASE ?? 'https://api.deepseek.com/v1';
    }
    return (
      process.env.QWEN_API_BASE ??
      'https://dashscope.aliyuncs.com/compatible-mode/v1'
    );
  }

  private getProviderModel(provider: ApiProvider) {
    if (provider === ApiProvider.DEEPSEEK) {
      return 'deepseek-chat';
    }
    return process.env.QWEN_MODEL ?? 'qwen-plus';
  }

  async generateChatResponse(
    message: string,
    userId: number,
    provider?: ApiProvider,
  ) {
    const keyInfo = await this.apiKeysService.getAvailableKeyForUser(
      userId,
      provider,
    );
    if (!keyInfo?.apiKey) {
      return { content: '', provider: null as ApiProvider | null, model: '' };
    }
    const baseUrl = this.getProviderBaseUrl(keyInfo.provider);
    const model = this.getProviderModel(keyInfo.provider);
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyInfo.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
        stream: false,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Provider error: ${response.status} ${text}`);
    }
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return { content, provider: keyInfo.provider, model };
  }

  createImageTask(prompt: string) {
    const id = crypto.randomUUID();
    const task: ImageTask = {
      id,
      status: 'PENDING',
      created_at: Date.now(),
    };
    this.imageTasks[id] = task;
    setTimeout(() => {
      task.status = 'SUCCEEDED';
      task.url = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/768/512`;
    }, 1500);
    return task;
  }

  getImageTask(taskId: string) {
    return this.imageTasks[taskId];
  }
}
