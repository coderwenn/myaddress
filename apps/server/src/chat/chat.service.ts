import { Injectable } from '@nestjs/common';

type Conversation = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

type ConversationMessage = {
  id: string;
  content?: string;
  ai_response?: string;
  created_at: string;
};

type ImageTask = {
  id: string;
  status: 'PENDING' | 'SUCCEEDED';
  url?: string;
  created_at: number;
};

@Injectable()
export class ChatService {
  private conversations: Conversation[] = [];
  private messages: Record<number, ConversationMessage[]> = {};
  private imageTasks: Record<string, ImageTask> = {};
  private nextConversationId = 1;

  listConversations() {
    return {
      list: this.conversations,
      total: this.conversations.length,
    };
  }

  createConversation(payload: { title: string; content?: string; ai_response?: string }) {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: this.nextConversationId++,
      user_id: 1,
      title: payload.title || 'New Conversation',
      created_at: now,
      updated_at: now,
    };
    this.conversations.unshift(conversation);
    if (!this.messages[conversation.id]) {
      this.messages[conversation.id] = [];
    }
    if (payload.content || payload.ai_response) {
      this.messages[conversation.id].push({
        id: crypto.randomUUID(),
        content: payload.content,
        ai_response: payload.ai_response,
        created_at: now,
      });
    }
    return { id: conversation.id };
  }

  getConversationDetail(conversationId: number) {
    return {
      list: this.messages[conversationId] ?? [],
    };
  }

  appendConversationMessage(conversationId: number, content: string, aiResponse: string) {
    const now = new Date().toISOString();
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push({
      id: crypto.randomUUID(),
      content,
      ai_response: aiResponse,
      created_at: now,
    });
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
