import { Question } from "@/lib/schemas";
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionTable } from "./question-table";
import React from 'react';
import { extractQuestionPart, extractQuestionAfterTable } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface QuizReviewProps {
  questions: Question[];
  userAnswers: string[];
  timeSpent?: number[];
}

const QuizReview: React.FC<QuizReviewProps> = ({ questions, userAnswers, timeSpent }) => {
  const renderQuestionContent = (question: Question) => {
    if (question.type === 'table-match') {
      const beforeTable = extractQuestionPart(question.question);
      const afterTable = extractQuestionAfterTable(question.question);

      return (
        <>
          {beforeTable && <p className="mb-4">{beforeTable}</p>}
          <QuestionTable 
            type="table-match"
            tableData={question.tableData}
            className="mb-4"
          />
          {afterTable && <p className="mb-4">{afterTable}</p>}
        </>
      );
    }

    if (question.type === 'pair-match' && question.pairMatchData) {
      return (
        <div className="space-y-4">
          <p className="font-medium">Match List-I with List-II and select the correct answer using the codes given below:</p>
          <div className="rounded-lg overflow-x-auto border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border">
                  <TableHead className="text-center py-2 text-sm font-semibold text-foreground whitespace-nowrap">List-I</TableHead>
                  <TableHead className="text-center py-2 text-sm font-semibold text-foreground whitespace-nowrap">List-II</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.pairMatchData.listI.map((item, index) => (
                  <TableRow key={item.id} className="border-b border-border">
                    <TableCell className="py-2 px-4 min-w-[180px] sm:min-w-[200px]">
                      {`${index + 1}. ${item.text}`}
                    </TableCell>
                    <TableCell className="py-2 px-4 min-w-[180px] sm:min-w-[200px]">
                      {question.pairMatchData?.listII[index] && (
                        `${String.fromCharCode(65 + index)}. ${question.pairMatchData.listII[index].text}`
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-2">
            {question.options.map((option) => (
              <div 
                key={option.label} 
                className={cn(
                  "flex items-center rounded",
                )}
              >
                
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className="mb-4">{question.question}</p>;
  };

  return (
    <div className="space-y-12">
      {questions.map((question, index) => (
        <div key={index} className="bg-muted/20 p-8 rounded-lg">
          {/* Question Content */}
          <div className="space-y-6">
            {/* Question Text */}
            <h3 className="text-lg font-semibold leading-relaxed">
              {renderQuestionContent(question)}
            </h3>
            
            {/* Statements */}
            {question.statements && question.statements.length > 0 && (
              <div className="space-y-4">
                {question.statements.map((stmt, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Statement-{i + 1}:</p>
                    <p className="text-sm font-medium bg-muted/10 p-4 rounded-lg">
                      {stmt}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.label}
                  className={`p-4 rounded-lg ${
                    userAnswers[index] === option.label
                      ? option.label === question.answer
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                      : option.label === question.answer
                      ? 'bg-green-500/10'
                      : 'bg-muted/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-medium">({option.label})</span>
                    <span className="flex-1">{option.text}</span>
                    {userAnswers[index] === option.label && (
                      <span>
                        {option.label === question.answer ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="mt-6 p-4 bg-muted/10 rounded-lg space-y-2">
                <p className="font-medium text-primary">Explanation:</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizReview;
