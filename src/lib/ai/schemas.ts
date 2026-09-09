import { z } from "zod";
export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(["single_choice","multiple_choice","text","boolean"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional(),
});
export const ClarifyRequestSchema = z.object({
  idea: z.string().min(10),
  projectName: z.string().optional(),
  tech: z.string().optional(),
});
export const ClarifyResponseSchema = z.object({
  questions: z.array(QuestionSchema).min(3).max(10),
  summary: z.string().optional(),
});
export const AnswerSchema = z.object({ id: z.string(), answer: z.union([z.string(), z.array(z.string())]) });
export const PlanRequestSchema = z.object({
  idea: z.string().min(10),
  projectName: z.string().optional(),
  tech: z.string().optional(),
  answers: z.array(AnswerSchema).optional(),
});
export type Question = z.infer<typeof QuestionSchema>;
export type PlanRequest = z.infer<typeof PlanRequestSchema>;
