import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Conversation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all conversations' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.conversationService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation with its messages' })
  findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.conversationService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update conversation title' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.conversationService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation and its messages' })
  remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.conversationService.remove(req.user.id, id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add a message to a conversation' })
  addMessage(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.conversationService.addMessage(req.user.id, id, dto);
  }
}
