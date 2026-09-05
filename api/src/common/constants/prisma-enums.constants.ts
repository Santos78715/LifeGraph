export const LIFE_ENTITY_TYPE = {
  PERSON: 'PERSON',
  PLACE: 'PLACE',
  PROJECT: 'PROJECT',
  GOAL: 'GOAL',
  HABIT: 'HABIT',
  EVENT: 'EVENT',
  ORGANIZATION: 'ORGANIZATION',
  SKILL: 'SKILL',
  TOPIC: 'TOPIC',
  OBJECT: 'OBJECT',
} as const;

export const LIFE_ENTITY_TYPE_VALUES = Object.values(LIFE_ENTITY_TYPE);
export type LifeEntityTypeValue =
  (typeof LIFE_ENTITY_TYPE)[keyof typeof LIFE_ENTITY_TYPE];

export const MEMORY_TYPE = {
  FACT: 'FACT',
  PREFERENCE: 'PREFERENCE',
  EXPERIENCE: 'EXPERIENCE',
  DECISION: 'DECISION',
  INSIGHT: 'INSIGHT',
  GOAL: 'GOAL',
  BELIEF: 'BELIEF',
} as const;

export const MEMORY_TYPE_VALUES = Object.values(MEMORY_TYPE);
export type MemoryTypeValue = (typeof MEMORY_TYPE)[keyof typeof MEMORY_TYPE];

export const MEMORY_SOURCE_TYPE = {
  JOURNAL_ENTRY: 'JOURNAL_ENTRY',
  CONVERSATION: 'CONVERSATION',
  LIFE_ENTITY: 'LIFE_ENTITY',
  EVENT: 'EVENT',
  MANUAL: 'MANUAL',
  GOAL: 'GOAL',
  DOCUMENT: 'DOCUMENT',
  ENTITY: 'ENTITY',
} as const;

export const MEMORY_SOURCE_TYPE_VALUES = Object.values(MEMORY_SOURCE_TYPE);
export type MemorySourceTypeValue =
  (typeof MEMORY_SOURCE_TYPE)[keyof typeof MEMORY_SOURCE_TYPE];

export const RELATIONSHIP_TYPE = {
  WORKED_ON: 'WORKED_ON',
  KNOWS: 'KNOWS',
  LIVES_IN: 'LIVES_IN',
  VISITED: 'VISITED',
  RELATED_TO: 'RELATED_TO',
  PART_OF: 'PART_OF',
  CAUSED_BY: 'CAUSED_BY',
  LEADS_TO: 'LEADS_TO',
  CONFLICTS_WITH: 'CONFLICTS_WITH',
  SUPPORTS: 'SUPPORTS',
  DEPENDS_ON: 'DEPENDS_ON',
  ACHIEVED: 'ACHIEVED',
  FAILED: 'FAILED',
  INSPIRED_BY: 'INSPIRED_BY',
} as const;

export const RELATIONSHIP_TYPE_VALUES = Object.values(RELATIONSHIP_TYPE);
export type RelationshipTypeValue =
  (typeof RELATIONSHIP_TYPE)[keyof typeof RELATIONSHIP_TYPE];

export const GOAL_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
  ABANDONED: 'ABANDONED',
} as const;

export const GOAL_STATUS_VALUES = Object.values(GOAL_STATUS);
export type GoalStatusValue = (typeof GOAL_STATUS)[keyof typeof GOAL_STATUS];

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);
export type TaskStatusValue = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const HABIT_STATUS = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const HABIT_STATUS_VALUES = Object.values(HABIT_STATUS);
export type HabitStatusValue = (typeof HABIT_STATUS)[keyof typeof HABIT_STATUS];

export const LIFE_EVENT_TYPE = {
  JOB: 'JOB',
  TRAVEL: 'TRAVEL',
  RELATIONSHIP: 'RELATIONSHIP',
  EDUCATION: 'EDUCATION',
  ACHIEVEMENT: 'ACHIEVEMENT',
  FAILURE: 'FAILURE',
  MILESTONE: 'MILESTONE',
  HEALTH: 'HEALTH',
  PERSONAL: 'PERSONAL',
} as const;

export const LIFE_EVENT_TYPE_VALUES = Object.values(LIFE_EVENT_TYPE);
export type LifeEventTypeValue =
  (typeof LIFE_EVENT_TYPE)[keyof typeof LIFE_EVENT_TYPE];

export const DOCUMENT_STATUS = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
} as const;

export const DOCUMENT_STATUS_VALUES = Object.values(DOCUMENT_STATUS);
export type DocumentStatusValue =
  (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

export const RETRIEVAL_STRATEGIES = {
  STRUCTURED: 'STRUCTURED',
  SEMANTIC: 'SEMANTIC',
  HYBRID: 'HYBRID',
} as const;

export const RETRIEVAL_STRATEGIES_VALUES = Object.values(RETRIEVAL_STRATEGIES);
export type RetrievalStrategiesValue =
  (typeof RETRIEVAL_STRATEGIES)[keyof typeof RETRIEVAL_STRATEGIES];
