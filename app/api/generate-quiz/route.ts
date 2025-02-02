import { questionSchema, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Set runtime to nodejs
export const runtime = 'nodejs';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable");
}

const UPSC_PROMPT = `You are an expert UPSC exam question creator. Generate questions following these EXACT formats:

1. Statement-Based Questions (Type 1):
Format:
Consider the following statements:
Statement-I: [Factual statement about a concept]
Statement-II: [Related statement that may explain or relate to Statement-I]
Which one of the following is correct in respect of the above statements?
(a) Both Statement-I and Statement-II are correct and Statement-II explains Statement-I
(b) Both Statement-I and Statement-II are correct, but Statement-II does not explain Statement-I
(c) Statement-I is correct, but Statement-II is incorrect
(d) Statement-I is incorrect, but Statement-II is correct

2. Statement-Based Questions (Type 2):
Format:
Consider the following statements:
1. [Statement 1]
2. [Statement 2]
Which of the statements given above is/are correct?
(a) 1 only
(b) 2 only
(c) Both 1 and 2
(d) Neither 1 nor 2

3. List-Based Questions:
Format:
Consider the following:
1. [Item 1]
2. [Item 2]
3. [Item 3]
4. [Item 4]
How many of the above [specific criteria]?
(a) Only one
(b) Only two
(c) Only three
(d) All four

4. Table-Based Questions (Type 1 - Category Match):
Format:
Consider the following information:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| 1. [Item]| [Detail] | [Type]   |
| 2. [Item]| [Detail] | [Type]   |
| 3. [Item]| [Detail] | [Type]   |
In how many of the above rows is the given information correctly matched?
(a) Only one
(b) Only two
(c) All three
(d) None

5. Table-Based Questions (Type 2 - Pair Match):
Format:
Match List-I with List-II and select the correct answer using the codes given below:
List-I (Category A)     List-II (Category B)
1. [Item 1]            A. [Match A]
2. [Item 2]            B. [Match B]
3. [Item 3]            C. [Match C]
4. [Item 4]            D. [Match D]

Codes:
   1   2   3   4
(a) B   A   D   C
(b) C   D   A   B
(c) A   B   C   D
(d) D   C   B   A

6. Direct Questions:
[Specific question about a concept/fact/relationship]?
(a) [Option]
(b) [Option]
(c) [Option]
(d) [Option]

After each question, include an Explanation section in the following format:
Explanation:
[Provide a clear, concise, and comprehensive explanation that includes:
   - A detailed justification of why the correct option is the best answer, highlighting the key principles, factual evidence, and UPSC-relevant concepts.
   - A discussion on how the other options might appear correct under certain interpretations or contain partial truths, with clarifications of common misconceptions.
   - **Extensive Revision Notes:** Offer a thorough, standalone study summary that includes:
         • A detailed explanation of the core concepts and definitions relevant to the question. Clearly define key terms and principles so that aspirants can quickly grasp the foundational knowledge.
         • A summary of key facts and data points that are critical to understanding the subject matter, ensuring that frequently tested areas are highlighted.
         • Critical insights and takeaways, including common pitfalls and misunderstandings. Explain why certain interpretations of the options might seem valid and how they differ from the correct understanding.
         • A concise, bullet-point revision summary that encapsulates the essential material, serving as an effective quick-reference guide for UPSC aspirants during their revision sessions.
]

This enhanced explanation should not only justify the correct answer but also serve as an in-depth revision guide, enabling aspirants to understand both the strengths and weaknesses of each option.

   
Ensure that the explanation is structured, precise, and reflects the formal and in-depth analytical approach expected in UPSC examinations. The explanation should empower aspirants to use the provided notes for direct revision and a deeper understanding of the subject matter.]


Critical Requirements:
1. Question Structure:
   - EXACTLY follow the formats shown above.
   - Use precise UPSC language patterns.
   - Maintain consistent formatting with exact line breaks.
2. Options Format:
   - Always use (a), (b), (c), (d) format.
   - Make options mutually exclusive and similar in length.
   - Ensure one clear correct answer.
3. Content Guidelines:
   - Base questions on the provided document ONLY.
   - Test deep understanding rather than rote memorization.
   - Include comprehensive explanations as specified, covering both correct and alternative perspectives.
   - Use formal, technical language suitable for UPSC standards.
4. Question Distribution:
   - Include at least 2 Statement-Based Type 1 questions.
   - Include at least 2 Statement-Based Type 2 questions.
   - Include at least 1 List-Based question.
   - Include at least 1 Table-Based Type 1 (Category Match) question.
   - Include at least 1 Table-Based Type 2 (Pair Match) question.
   - Include at least 3 Direct Questions.

Remember, the expanded Explanation section is crucial. It should not only clarify why the correct answer is correct but also provide valuable insights into why the other options may seem plausible, thereby offering UPSC aspirants a complete set of revision notes.
`;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-2.0-flash-exp"),
    messages: [
      {
        role: "system",
        content: UPSC_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create exactly 10 UPSC-style questions based on this document's content. Follow the formats EXACTLY as shown in the prompt. Include a mix of all question types.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
