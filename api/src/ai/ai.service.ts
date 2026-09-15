import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;
  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('API_KEY');
    if (!apiKey) {
      throw new Error('API_KEY is not configured');
    }
    this.ai = new GoogleGenAI({
      apiKey,
    });
  }

  async createEmbeddings(input: string[]) {
    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: input,
      config: {
        outputDimensionality: 768,
      },
    });
    return response;
  }

  async answerWithContext(question: string, context: string) {
    return this.generateText(
      `Question: ${question}\n\nRetrieved knowledge:\n${context}`,
      'Answer only from the retrieved knowledge. If the knowledge does not answer the question, say that you do not have enough information. Cite supporting sources with their bracketed source number, for example [1]. Do not invent facts.',
    );
  }

  async generateText(prompt: string, systemInstruction: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    if (!response.text?.trim()) {
      throw new Error('The AI provider returned an empty answer');
    }
    return response.text.trim();
  }

  async aiInteraction(
    inputs: { content: string },
    schema: unknown,
    validationSchema: { parse(input: unknown): unknown },
  ) {
    const interaction = await this.ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: inputs.content,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: schema,
      },
    });
    const parsedResponse = validationSchema.parse(
      JSON.parse(interaction.output_text),
    );
    return parsedResponse;
  }
}
