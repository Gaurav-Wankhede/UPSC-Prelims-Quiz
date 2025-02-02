import { z } from 'zod';
import { questionsSchema } from '@/lib/schemas';

describe('UPSC Question Validation', () => {
  test('valid statement pairs question', () => {
    const validQuestion = {
      type: 'statement_pairs',
      question: 'Which among them are correct statements in following pairs?',
      statements: ['Statement 1 content', 'Statement 2 content'],
      options: ['A) Pair 1', 'B) Pair 2', 'C) Pair 3', 'D) Pair 4'],
      correctAnswer: 'B',
      questionType: 'correct_pairs'
    };
    expect(() => questionsSchema.parse([validQuestion])).not.toThrow();
  });

  test('invalid statement pairs question format', () => {
    const invalidQuestion = {
      type: 'statement_pairs',
      question: 'Invalid question format',
      statements: ['Short'],
      options: ['Only three options'],
      correctAnswer: 'E'
    };
    expect(() => questionsSchema.parse([invalidQuestion])).toThrow(z.ZodError);
  });

  test('valid count correct question', () => {
    const validQuestion = {
      type: 'count_correct',
      question: 'How many are correct statements?',
      statements: ['Statement 1', 'Statement 2', 'Statement 3'],
      options: ['A) Only one', 'B) Only two', 'C) None', 'D) All'],
      correctCount: 2
    };
    expect(() => questionsSchema.parse([validQuestion])).not.toThrow();
  });
});
