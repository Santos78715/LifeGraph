import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import {
  LifeGraphSchema,
  lifeGraphSchema,
  lifeGraphJsonSchema,
} from './constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: this.config.get('API_KEY'),
    });
  }

  async createEmbeddings(input: any) {
    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: input,
      config: {
        outputDimensionality: 768,
      },
    });
    return response;
  }

  async aiInteraction(inputs: any) {
    const interaction = await this.ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: inputs,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: lifeGraphJsonSchema,
      },
    });

    const parsedResponse = lifeGraphSchema.parse(
      JSON.parse(interaction.output_text),
    );

    // Create a Conversation row first so the FK on AIInteraction is satisfied
    const inputText =
      typeof inputs === 'string' ? inputs : JSON.stringify(inputs);
    const conversation = await this.prisma.conversation.create({
      data: {
        userId: inputs.userId,
        title: inputText.slice(0, 100),
      },
    });

    await this.prisma.aIInteraction.create({
      data: {
        userId: inputs.userId,
        conversationId: conversation.id,
        model: interaction.model,
        provider: 'GOOGLE',
        inputTokens: interaction.usage.total_input_tokens,
        outputTokens: interaction.usage.total_output_tokens,
        status: interaction.status,
      },
    });

    return parsedResponse;
  }

  findOne(id: number) {
    return `This action returns a #${id} ai`;
  }

  update(id: number) {
    return `This action updates a #${id} ai`;
  }

  remove(id: number) {
    return `This action removes a #${id} ai`;
  }
}
