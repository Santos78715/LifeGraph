import * as z from 'zod';

export const journalJSONSchema: z.core.JSONSchema.JSONSchema = {
  type: 'object',

  properties: {
    entities: {
      type: 'array',
      description:
        'People, places, projects, organizations, or other meaningful entities mentioned in the journal.',

      items: {
        type: 'object',

        properties: {
          name: {
            type: 'string',
            description: 'The name of the entity.',
          },

          description: {
            type: 'string',
            description:
              'A short description of what this entity represents in the journal.',
          },
          type: {
            type: 'string',
            enum: [
              'PERSON', 'PLACE', 'PROJECT', 'GOAL', 'HABIT', 'EVENT',
              'ORGANIZATION', 'SKILL', 'TOPIC', 'OBJECT',
            ],
            description: 'The entity category.',
          },
        },

        required: ['name', 'description', 'type'],
      },
    },

    memories: {
      type: 'array',
      description:
        'Meaningful facts, experiences, events, or personal information extracted from the journal.',

      items: {
        type: 'object',

        properties: {
          content: {
            type: 'string',
            description: 'A concise statement describing the memory.',
          },

          type: {
            type: 'string',
            enum: ['FACT', 'PREFERENCE', 'EXPERIENCE', 'DECISION', 'INSIGHT', 'GOAL', 'BELIEF'],
            description:
              'The category of the memory, such as EVENT, EXPERIENCE, ACHIEVEMENT, or FACT.',
          },
        },

        required: ['content', 'type'],
      },
    },

    relationships: {
      type: 'array',
      description:
        'Relationships between the entities mentioned in the journal.',

      items: {
        type: 'object',

        properties: {
          sourceEntity: {
            type: 'string',
            description: 'The name of the source entity.',
          },

          targetEntity: {
            type: 'string',
            description: 'The name of the target entity.',
          },

          type: {
            type: 'string',
            enum: ['WORKED_ON', 'KNOWS', 'LIVES_IN', 'VISITED', 'RELATED_TO', 'PART_OF', 'CAUSED_BY', 'LEADS_TO', 'CONFLICTS_WITH', 'SUPPORTS', 'DEPENDS_ON', 'ACHIEVED', 'FAILED', 'INSPIRED_BY'],
            description: 'The type of relationship between the two entities.',
          },

          description: {
            type: 'string',
            description:
              'A short explanation of how the two entities are related.',
          },
        },

        required: ['sourceEntity', 'targetEntity', 'type', 'description'],
      },
    },
  },

  required: ['entities', 'memories', 'relationships'],
};

export const journalSchema = z.fromJSONSchema(journalJSONSchema);
