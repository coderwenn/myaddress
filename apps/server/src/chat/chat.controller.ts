import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversation/list')
  getConversationList(@Body() body: { conversation_id?: number }) {
    if (body?.conversation_id) {
      return {
        code: '200',
        data: this.chatService.getConversationDetail(body.conversation_id),
        msg: 'ok',
      };
    }
    return {
      code: '200',
      data: this.chatService.listConversations(),
      msg: 'ok',
    };
  }

  @Post('conversation/create')
  createConversation(@Body() body: { title: string; content?: string; ai_response?: string }) {
    const result = this.chatService.createConversation(body);
    return {
      code: '200',
      data: result,
      msg: 'ok',
    };
  }

  @Get('ai/aiChat')
  async aiChat(@Query('message') message: string, @Query('conversation_id') conversationId: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const safeMessage = message || '';
    const reply = `Echo: ${safeMessage}`;
    let index = 0;
    const conversationIdNumber = Number(conversationId);

    const timer = setInterval(() => {
      if (index >= reply.length) {
        clearInterval(timer);
        res.write(`data: [DONE]\n\n`);
        res.end();
        if (!Number.isNaN(conversationIdNumber)) {
          this.chatService.appendConversationMessage(conversationIdNumber, safeMessage, reply);
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
