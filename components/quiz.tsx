import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  FileText,
} from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { QuestionTable } from "./question-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question, TableData } from "@/lib/schemas";
import { extractQuestionPart, extractQuestionAfterTable } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showCorrectAnswer: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* Statement Type 1 */}
        {question.type === 'statement-1' && (
          <>
            <h2 className="text-lg font-semibold">Consider the following statements:</h2>
            <div className="space-y-4">
              {question.statements?.map((statement, idx) => (
                <div key={idx} className="p-4 bg-muted rounded-md">
                  <p>{statement}</p>
                </div>
              ))}
              <p className="font-medium">Which one of the following is correct in respect of the above statements?</p>
            </div>
          </>
        )}

        {/* Statement Type 2 */}
        {question.type === 'statement-2' && (
          <>
            <h2 className="text-lg font-semibold">Consider the following statement:</h2>
            <div className="space-y-4">
              {question.statements?.map((statement, idx) => (
                <div key={idx} className="p-4 bg-muted rounded-md">
                  <p>{statement}</p>
                </div>
              ))}
              <p className="font-medium">Which of the statements given above is/are correct?</p>
            </div>
          </>
        )}

        {/* List Questions */}
        {question.type === 'list' && (
          <div className="space-y-4">
            <div className="text-base leading-relaxed bg-muted/10 rounded-lg p-4">
              <div className="mt-4">
                <span>{question.question}</span>
              </div>
            </div>
          </div>
        )}

        {/* Table Questions */}
        {(question.type === 'table-match' || question.type === 'pair-match') && question.tableData && (
          <>
            <h2 className="text-lg font-semibold">Consider the following information:</h2>
            <QuestionTable 
              type={question.type}
              tableData={question.tableData}
              pairMatchData={question.pairMatchData}
            />
            
          </>
        )}

        {/* Direct Questions */}
        {question.type === 'direct' && (
          <h2 className="text-lg font-semibold leading-relaxed">{question.question}</h2>
        )}

        {/* Pair Match Questions */}
        {question.type === 'pair-match' && question.pairMatchData && (
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
          </div>
        )}

        {/* Options Section */}
        <div className="space-y-4 mt-6">
          {question.options.map((option) => (
            <Button
              key={option.label}
              onClick={() => onSelectAnswer(option.label)}
              variant={selectedAnswer === option.label ? "default" : "outline"}
              className="w-full justify-start"
            >
              <span className="inline-block w-8 font-medium">({option.label})</span>
              <span className="flex-1 text-left">{option.text}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface Props {
  questions: Question[];
  title?: string;
}

export default function Quiz({
  questions,
  title = "Quiz",
}: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>(Array(questions.length).fill(0));

  const validateUPSCAnswer = (question: Question, answer: string): boolean => {
    return answer.toLowerCase() === question.answer.toLowerCase();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimePerQuestion(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] += 1;
        return newTimes;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  // Lock/unlock scroll based on quiz state
  React.useEffect(() => {
    if (!isSubmitted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSubmitted]);

  const handleSelectAnswer = (answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);

      // Automatically move to next question after a brief delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleSubmit();
        }
      }, 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const correctAnswers = questions.reduce((acc, question, index) => {
      const answer = answers[index];
      return acc + (answer ? validateUPSCAnswer(question, answer) ? 1 : 0 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setTimePerQuestion(Array(questions.length).fill(0));
  };

  const handleTryAnotherPDF = () => {
    window.location.reload();
  };

  return (
    <BackgroundBeamsWithCollision className={isSubmitted ? "" : "min-h-[100dvh] overflow-hidden"}>
      <div className={`relative z-10 w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-8 ${isSubmitted ? "" : "min-h-full flex items-center justify-center"}`}>
        <div className="flex flex-col items-center py-4 sm:py-8 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-foreground">
            {title}
          </h1>
          <div className="w-full bg-background/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-lg">
            <div className="relative">
              {!isSubmitted && <Progress value={progress} className="h-1 mb-6 sm:mb-8" />}
              <div className="min-h-[400px] overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSubmitted ? "results" : currentQuestionIndex}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="min-w-[300px]"
                  >
                    {!isSubmitted ? (
                      <div className="space-y-6 sm:space-y-8">
                        <QuestionCard
                          question={currentQuestion}
                          selectedAnswer={answers[currentQuestionIndex]}
                          onSelectAnswer={handleSelectAnswer}
                          showCorrectAnswer={false}
                        />
                        <div className="flex justify-between items-center pt-4">
                          <Button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            variant="ghost"
                            className="text-sm sm:text-base"
                          >
                            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" /> Previous
                          </Button>
                          <span className="text-sm font-medium">
                            {currentQuestionIndex + 1} / {questions.length}
                          </span>
                          <Button
                            onClick={handleNextQuestion}
                            disabled={answers[currentQuestionIndex] === null}
                            variant="ghost"
                            className="text-sm sm:text-base"
                          >
                            {currentQuestionIndex === questions.length - 1
                              ? "Submit"
                              : "Next"}{" "}
                            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 sm:space-y-8">
                        <QuizScore
                          correctAnswers={score ?? 0}
                          totalQuestions={questions.length}
                        />
                        <div className="space-y-8 sm:space-y-12">
                          <QuizReview
                            questions={questions}
                            userAnswers={answers.filter((answer): answer is string => answer !== null)}
                            timeSpent={timePerQuestion}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="bg-muted hover:bg-muted/80 w-full text-sm sm:text-base"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                          </Button>
                          <Button
                            onClick={handleTryAnotherPDF}
                            className="bg-primary hover:bg-primary/90 w-full text-sm sm:text-base"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Try Another PDF
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
