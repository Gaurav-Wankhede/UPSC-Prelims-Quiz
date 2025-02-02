// lib/question-types.ts
import { z } from 'zod';

export const questionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('statement_pairs'),
    questionSubType: z.enum([
      'correct_pairs',
      'incorrect_pairs',
      'count_correct',
      'count_incorrect',
      'multiple_correct',
      'multiple_incorrect'
    ]),
    statements: z.array(z.string().min(20)).max(5),
    pairs: z.array(z.string().regex(/[A-D]\) .+ and .+/)).length(4),
    correctAnswer: z.string().regex(/^[A-D]$/),
    correctCount: z.number().min(0).max(5).optional()
  }),
  z.object({
    type: z.literal('count'),
    questionSubType: z.enum(['correct', 'incorrect']),
    statements: z.array(z.string().min(20)).max(5),
    options: z.array(z.enum([
      'A) Only one',
      'B) Only two',
      'C) Only three',
      'D) All of the above'
    ])),
    correctCount: z.number().min(0).max(5)
  }),
  z.object({
    type: z.literal('current_affairs'),
    question: z.string().min(50),
    options: z.array(z.string().min(20)).length(4),
    reference: z.string().url(),
    correctAnswer: z.enum(['A', 'B', 'C', 'D'])
  }),
  z.object({
    type: z.literal('constitutional'),
    article: z.string().regex(/Article \d+/),
    explanation: z.string().min(100),
    options: z.array(z.string().min(20)).length(4),
    correctAnswer: z.enum(['A', 'B', 'C', 'D'])
  })
]);

export type Question = z.infer<typeof questionSchema>;