import { GoogleGenAI } from '@google/genai';
import { lifeGraphSchema, lifeGraphJsonSchema } from 'src/ai/constants';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

(async () => {
  // Grab a real user from DB
  const user = await prisma.user.findFirst({ select: { id: true, email: true } });
  if (!user) throw new Error('No user found in DB — seed one first');
  console.log('Using user:', user.email, '|', user.id);

  // inputs now includes userId so the service can read it
  const inputs = {
    userId: user.id,
    query: 'What important events happened in my life last month?',
  };

  console.log('\n--- Step 1: Calling ai.interactions.create ---');
  const interaction = await (ai as any).interactions.create({
    model: 'gemini-3.8-flash',
    input: inputs.query,
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: lifeGraphJsonSchema,
    },
  });

  console.log('Interaction ID    :', interaction.id);
  console.log('Model             :', interaction.model);
  console.log('Status            :', interaction.status);
  console.log('Input tokens      :', interaction.usage?.total_input_tokens);
  console.log('Output tokens     :', interaction.usage?.total_output_tokens);
  console.log('Raw output_text   :', interaction.output_text);

  console.log('\n--- Step 2: Parsing + validating with Zod ---');
  const parsedResponse = lifeGraphSchema.parse(JSON.parse(interaction.output_text));
  console.log('✅ Parsed response:', JSON.stringify(parsedResponse, null, 2));

  console.log('\n--- Step 3: Creating Conversation row ---');
  const inputText = typeof inputs === 'string' ? inputs : JSON.stringify(inputs);
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: inputText.slice(0, 100),
    },
  });
  console.log('✅ Conversation created:', conversation.id, '|', conversation.title);

  console.log('\n--- Step 4: Saving AIInteraction with conversationId ---');
  const saved = await prisma.aIInteraction.create({
    data: {
      userId: user.id,
      conversationId: conversation.id,
      model: interaction.model ?? 'gemini-3.8-flash',
      provider: 'GOOGLE',
      inputTokens: interaction.usage?.total_input_tokens ?? null,
      outputTokens: interaction.usage?.total_output_tokens ?? null,
      status: interaction.status ?? 'completed',
    },
  });
  console.log('✅ AIInteraction saved:', JSON.stringify(saved, null, 2));
})()
  .catch(e => { console.error('\n❌ Error:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
