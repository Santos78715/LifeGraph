import * as z from 'zod';
import { RelationshipType } from 'generated/prisma/enums';
import { RETRIEVAL_STRATEGIES } from 'src/common/constants/prisma-enums.constants';

export const lifeGraphSchema = z.object({
  relationshipTypes: z
    .array(z.enum(RelationshipType))
    .optional()
    .describe('The types of relationships relevant to the user query.'),

  entities: z
    .array(z.string())
    .optional()
    .describe('The entities involved in or relevant to the query.'),

  semanticQuery: z
    .string()
    .min(1)
    .describe('A semantic representation of what the user is looking for.'),

  timeframe: z
    .string()
    .optional()
    .describe('The timeframe relevant to the query, if applicable.'),

  retrievalStrategy: z
    .enum(RETRIEVAL_STRATEGIES)
    .describe(
      'The strategy to use for retrieving information from the database.',
    ),
});

export const lifeGraphJsonSchema = z.toJSONSchema(lifeGraphSchema);

export type LifeGraphSchema = z.infer<typeof lifeGraphSchema>;
