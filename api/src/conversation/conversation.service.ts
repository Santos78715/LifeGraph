import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
  }

  async findOne(userId: string, id: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    return conversation;
  }

  async update(userId: string, id: string, dto: UpdateConversationDto) {
    await this.findOne(userId, id);
    return this.prisma.conversation.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.conversation.delete({ where: { id } });
    return { message: `Conversation ${id} has been deleted` };
  }

  async addMessage(userId: string, conversationId: string, dto: CreateMessageDto) {
    await this.findOne(userId, conversationId);
    return this.prisma.message.create({
      data: {
        conversationId,
        role: dto.role,
        content: dto.content,
      },
    });
  }
}
