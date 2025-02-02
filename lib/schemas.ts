import { z } from "zod";

// Common types
const optionLabel = z.enum(["a", "b", "c", "d"]) as z.ZodEnum<["a", "b", "c", "d"]>;

const option = z.object({
  label: optionLabel,
  text: z.string(),
});

// Table schemas
const tableRow = z.object({
  category1: z.string(),
  category2: z.string(),
  category3: z.string().optional(),
});

const tableData = z.object({
  headers: z.array(z.string()).min(2).max(3),
  rows: z.array(tableRow).min(1),
});

// Pair match schemas
const listItem = z.object({
  id: z.string(),
  text: z.string().min(1),
});

const code = z.object({
  label: optionLabel,
  matches: z.array(z.string()).length(4), // Must have exactly 4 matches for A, B, C, D
});

const pairMatchData = z.object({
  listI: z.array(listItem).length(4),    // Must have exactly 4 items
  listII: z.array(listItem).length(4),   // Must have exactly 4 items
  codes: z.array(code).length(4),        // Must have exactly 4 codes (a, b, c, d)
});

// Question types
const questionType = z.enum([
  "statement-1",  // Statement-I and II with explanation
  "statement-2",  // Multiple statements correctness
  "list",         // List-based questions
  "table-match",  // Table matching questions
  "pair-match",   // List-I and List-II matching
  "direct",       // Direct questions
]);

const statementRelation = z.enum([
  "explains",      // Statement-II explains Statement-I
  "not-explains",  // Statement-II does not explain Statement-I
]);

// Main question schema
export const questionSchema = z.object({
  type: questionType,
  question: z.string().min(1),
  options: z.array(option).length(4),
  answer: optionLabel,
  correctAnswer: optionLabel.optional(), // Add correctAnswer field
  explanation: z.string().min(1),
  // Optional fields based on question type
  statements: z.array(z.string()).optional(),
  statementRelation: statementRelation.optional(),
  tableData: tableData.optional(),
  pairMatchData: pairMatchData.optional(),
});

// Questions array schema
export const questionsSchema = z.array(questionSchema).min(1);

// Export types for use in components
export type QuestionType = z.infer<typeof questionType>;
export type TableRow = z.infer<typeof tableRow>;
export type TableData = z.infer<typeof tableData>;
export type ListItem = z.infer<typeof listItem>;
export type Code = z.infer<typeof code>;
export type PairMatchData = z.infer<typeof pairMatchData>;
export type Question = {
  type: 'statement-1' | 'statement-2' | 'list' | 'table-match' | 'pair-match' | 'direct';
  question: string;
  options: { label: 'a' | 'b' | 'c' | 'd'; text: string; }[];
  answer: 'a' | 'b' | 'c' | 'd';
  correctAnswer?: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  statements?: string[];
  tableData?: TableData;
  pairMatchData?: PairMatchData;
};
export type OptionLabel = z.infer<typeof optionLabel>;

// Helper type for pair-match options
export type PairMatchOption = {
  label: OptionLabel;
  matches: [string, string, string, string]; // Exactly 4 matches in order
};
