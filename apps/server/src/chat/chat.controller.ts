import { Body, Controller, Get, Post, Query, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { ApiProvider } from '../api-keys/entities/api-key.entity';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversation/list')
  async getConversationList(@Body() body: { conversation_id?: number; user_id?: number }) {
    if (body?.conversation_id) {
      return {
        code: '200',
        data: await this.chatService.getConversationDetail(body.conversation_id, body.user_id),
        msg: 'ok',
      };
    }
    return {
      code: '200',
      data: await this.chatService.listConversations(body?.user_id),
      msg: 'ok',
    };
  }

  @Post('conversation/create')
  async createConversation(@Body() body: { title: string; content?: string; ai_response?: string; user_id: number }) {
    if (!body?.user_id) {
      throw new BadRequestException('user_id is required');
    }
    const result = await this.chatService.createConversation(body);
    return {
      code: '200',
      data: result,
      msg: 'ok',
    };
  }

  @Get('ai/aiChat')
  async aiChat(
    @Query('message') message: string,
    @Query('conversation_id') conversationId: string,
    @Query('user_id') userId: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const safeMessage = message || '';
    const numericUserId = Number(userId);
    if (!userId || Number.isNaN(numericUserId)) {
      res.write(`data: ${JSON.stringify({ error: 'user_id required' })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      return;
    }
    let reply = '';
    let modelProvider: ApiProvider | null = null;
    let modelName = '';
    try {
      const response = await this.chatService.generateChatResponse(safeMessage, numericUserId);
      reply = response.content || '';
      modelProvider = response.provider ?? null;
      modelName = response.model ?? '';
      if (!reply) {
        res.write(`data: ${JSON.stringify({ error: 'no available model' })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
        return;
      }
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'provider error' })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      return;
    }
    let index = 0;
    const conversationIdNumber = Number(conversationId);

    let isSaving = false;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const timer = setInterval(async () => {
      if (index >= reply.length) {
        clearInterval(timer);
        res.write(`data: [DONE]\n\n`);
        res.end();
        if (!Number.isNaN(conversationIdNumber)) {
          try {
            if (isSaving) return;
            isSaving = true;
            await this.chatService.appendConversationMessage(
              conversationIdNumber,
              numericUserId,
              safeMessage,
              reply,
              modelProvider ?? undefined,
              modelName ?? undefined,
            );
          } catch (error) {
            // No-op for streaming teardown failures.
          } finally {
            isSaving = false;
          }
        }
        return;
      }
      const chunk = reply[index];
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      index += 1;
    }, 30);

    res.on('close', () => {
      clearInterval(timer);
      res.end();
    });
  }

  @Post('ai/aiPicture')
  aiPicture(@Body() body: { message: string }) {
    const task = this.chatService.createImageTask(body?.message || '');
    return {
      code: '200',
      data: {
        output: {
          task_status: task.status,
          task_id: task.id,
        },
        request_id: task.id,
      },
      msg: 'ok',
    };
  }

  @Get('ai/aiGetUrl')
  aiGetUrl(@Query('taskid') taskId: string) {
    const task = this.chatService.getImageTask(taskId);
    if (!task) {
      return {
        code: '404',
        data: {
          usage: { image_count: 0 },
        },
        msg: 'task not found',
      };
    }
    if (task.status !== 'SUCCEEDED') {
      return {
        code: '200',
        data: {
          output: {
            task_id: task.id,
            task_status: task.status,
            results: [],
          },
          usage: { image_count: 0 },
        },
        msg: 'pending',
      };
    }
    return {
      code: '200',
      data: {
        output: {
          task_id: task.id,
          task_status: task.status,
          submit_time: new Date(task.created_at).toISOString(),
          scheduled_time: new Date(task.created_at).toISOString(),
          end_time: new Date().toISOString(),
          results: [
            {
              orig_prompt: '',
              actual_prompt: '',
              url: task.url,
            },
          ],
          task_metrics: {
            TOTAL: 1,
            SUCCEEDED: 1,
            FAILED: 0,
          },
        },
        usage: { image_count: 1 },
      },
      msg: 'ok',
    };
  }
}
