import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  pitch: z.string().trim().min(40).max(12_000),
  targetMarket: z.string().trim().min(2).max(120),
  webSearch: z.object({
    mode: z.enum(["cached", "live"]),
    agentIds: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(8)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "Web Search agent IDs must be unique",
      }),
  }),
});

export const projectIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const nodeIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const projectNodeSchema = z.object({
  projectId: projectIdSchema,
  nodeId: nodeIdSchema,
});

export const artifactReadSchema = z.object({
  projectId: projectIdSchema,
  path: z.string().min(1).max(240),
});

export const humanSubmitSchema = z.object({
  projectId: projectIdSchema,
  nodeId: nodeIdSchema,
  answers: z.record(z.string(), z.string().trim().max(8_000)).optional(),
  text: z.string().trim().max(12_000).optional(),
  skipped: z.boolean().optional(),
});

export const approvalRespondSchema = z.object({
  approvalId: z.string().min(1),
  decision: z.enum(["accept", "acceptForSession", "decline", "cancel"]),
});

const questionBaseSchema = z.object({
  id: z.string().regex(/^q[1-3]$/),
  question: z.string().min(8).max(500),
  reason: z.string().min(8).max(500),
});

const questionSuggestionsSchema = z.object({
  confident: z.string().min(20).max(1_500),
  cautious: z.string().min(20).max(1_500),
});

const withUniqueQuestionIds = <T extends { id: string }>(questions: T[]) =>
  new Set(questions.map((question) => question.id)).size === 3;

export const committeeQuestionsSchema = z.object({
  questions: z
    .array(questionBaseSchema.extend({ suggestions: questionSuggestionsSchema.optional() }))
    .length(3)
    .refine(withUniqueQuestionIds, {
      message: "Committee question IDs must be q1, q2, and q3",
    }),
});

export const generatedCommitteeQuestionsSchema = z.object({
  questions: z
    .array(questionBaseSchema.extend({ suggestions: questionSuggestionsSchema }))
    .length(3)
    .refine(withUniqueQuestionIds, {
      message: "Committee question IDs must be q1, q2, and q3",
    }),
});
