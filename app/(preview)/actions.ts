"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
}

export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: google("gemini-2.0-flash-exp"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " + file,
  });
  return result.object.title;
};

const currentAffairsSchema = z.object({
  type: z.literal('current_affairs'),
  question: z.string().min(50),
  options: z.array(z.string().min(20)).length(4),
  reference: z.string().url(),
  correctAnswer: z.enum(['A', 'B', 'C', 'D'])
});

const constitutionalSchema = z.object({
  type: z.literal('constitutional'),
  article: z.string().regex(/Article \d+/),
  explanation: z.string().min(100),
  options: z.array(z.string().min(20)).length(4),
  correctAnswer: z.enum(['A', 'B', 'C', 'D'])
});

const statementPairSchema = z.object({
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
});

const countSchema = z.object({
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
});

export const generateUPSCQuestions = async (pdfText: string) => {
  return generateObject({
    model: google('gemini-2.0-flash-exp'),
    schema: z.object({
      questions: z.array(z.discriminatedUnion('type', [
        statementPairSchema,
        countSchema,
        currentAffairsSchema,
        constitutionalSchema
      ]))
    }),
    prompt: `Generate UPSC Prelims questions from this text following official patterns:
    ${pdfText}
    Include:
    - Current affairs with source references
    - Constitutional articles with explanations
    - Previous year question patterns
    - 2/3 negative marking consideration`
  });
};
