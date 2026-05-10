"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { QuizDifficulty, QuizQuestion } from "../types";

type QuizClientProperties = {
  questions: QuizQuestion[];
};

const quizSources = [
  {
    label: "Arc.dev - TypeScript Interview Questions",
    url: "https://arc.dev/talent-blog/typescript-interview-questions/",
  },
  {
    label: "Mimo - Top TypeScript Interview Questions",
    url: "https://mimo.org/blog/typescript-interview-questions",
  },
];

const shuffleOptionEntries = (options: string[], correctIndex: number) => {
  const entries = options.map((option, index) => ({
    option,
    isCorrect: index === correctIndex,
  }));

  for (let index = entries.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [entries[index], entries[randomIndex]] = [entries[randomIndex], entries[index]];
  }

  const shuffledOptions = entries.map((entry) => entry.option);
  const shuffledCorrectIndex = entries.findIndex((entry) => entry.isCorrect);

  return { shuffledOptions, shuffledCorrectIndex };
};

const randomizeQuestionOptions = (question: QuizQuestion): QuizQuestion => {
  const { shuffledOptions, shuffledCorrectIndex } = shuffleOptionEntries(
    question.options,
    question.correctOptionIndex
  );

  return {
    ...question,
    options: shuffledOptions,
    correctOptionIndex: shuffledCorrectIndex,
  };
};

const buildQuizQuestions = (questions: QuizQuestion[]) =>
  questions.map(randomizeQuestionOptions);

const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  const copy = [...questions];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

export const QuizClient = ({ questions }: QuizClientProperties) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    QuizDifficulty | "all"
  >("all");
  const [quizQuestions, setQuizQuestions] = useState(() =>
    buildQuizQuestions(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === "all") {
      return quizQuestions;
    }
    return quizQuestions.filter(
      (question) => question.difficulty === selectedDifficulty
    );
  }, [quizQuestions, selectedDifficulty]);

  const currentQuestion = filteredQuestions[currentIndex];
  const categories = useMemo(
    () => [...new Set(quizQuestions.map((question) => question.category))],
    [quizQuestions]
  );
  const availableDifficulties = useMemo(
    () => [...new Set(quizQuestions.map((question) => question.difficulty))],
    [quizQuestions]
  );

  const keyboardNextRef = useRef<(() => boolean) | null>(null);
  const keyboardSubmitRef = useRef<(() => boolean) | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'input, textarea, select, [contenteditable="true"]'
        )
      ) {
        return;
      }

      let handled = false;
      if (event.key === "ArrowRight") {
        handled = keyboardNextRef.current?.() ?? false;
      }
      if (event.key === "Enter") {
        handled = keyboardSubmitRef.current?.() ?? false;
      }

      if (handled) {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (quizQuestions.length === 0) {
    keyboardNextRef.current = null;
    return (
      <Card>
        <CardHeader>
          <CardTitle>TypeScript Quiz</CardTitle>
          <CardDescription>No questions were loaded.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (filteredQuestions.length === 0) {
    keyboardNextRef.current = null;
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>TypeScript Interview Quiz</CardTitle>
            <CardDescription>
              Categories available: {categories.join(", ")}. Currently loading
              all questions from every category.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-sm">
              No questions found for difficulty: {selectedDifficulty}.
            </p>
            <Button
              onClick={() => {
                setSelectedDifficulty("all");
              }}
              size="sm"
              variant="outline"
            >
              Show All
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLastQuestion = currentIndex === filteredQuestions.length - 1;
  const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
  const hasCompletedQuiz = submitted && isLastQuestion;
  const showFinalScore = submitted ? isLastQuestion : false;

  const resetQuizState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setScore(0);
  };

  const handleSubmit = () => {
    if (selectedOption === null || submitted) {
      return;
    }

    if (selectedOption === currentQuestion.correctOptionIndex) {
      setScore((value) => value + 1);
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleReset = () => {
    resetQuizState();
  };

  const handleShuffle = () => {
    setQuizQuestions((current) =>
      shuffleQuestions(buildQuizQuestions(current))
    );
    resetQuizState();
  };

  const handleDifficultyChange = (difficulty: QuizDifficulty | "all") => {
    setSelectedDifficulty(difficulty);
    resetQuizState();
  };

  keyboardNextRef.current = () => {
    if (hasCompletedQuiz) {
      return false;
    }
    if (!submitted || isLastQuestion) {
      return false;
    }
    handleNext();
    return true;
  };

  keyboardSubmitRef.current = () => {
    if (submitted || selectedOption === null) {
      return false;
    }
    handleSubmit();
    return true;
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>TypeScript Interview Quiz</CardTitle>
          <CardDescription>
            Categories available: {categories.join(", ")}. Currently loading all
            questions from every category.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs">Difficulty</span>
                <select
                  className="rounded-md border bg-background px-2 py-1 text-xs"
                  onChange={(event) => {
                    handleDifficultyChange(
                      event.target.value as QuizDifficulty | "all"
                    );
                  }}
                  value={selectedDifficulty}
                >
                  <option value="all">All</option>
                  {availableDifficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <p className="font-medium">
                Score: {score} / {filteredQuestions.length}
              </p>
              <Button onClick={handleShuffle} size="sm" variant="secondary">
                Shuffle
              </Button>
              <Button onClick={handleReset} size="sm" variant="outline">
                Restart Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
          <CardDescription>
            Category: {currentQuestion.category} - Difficulty:{" "}
            {currentQuestion.difficulty}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const showCorrect = submitted
              ? index === currentQuestion.correctOptionIndex
              : false;
            let showWrong = false;
            if (submitted) {
              showWrong = isSelected ? !isCorrect : false;
            }

            return (
              <button
                className={[
                  "w-full rounded-md border p-3 text-left text-sm transition-colors",
                  isSelected ? "border-primary bg-primary/5" : "border-border",
                  showCorrect ? "border-emerald-500 bg-emerald-500/10" : "",
                  showWrong ? "border-destructive bg-destructive/10" : "",
                ].join(" ")}
                disabled={submitted}
                key={`${currentQuestion.id}-${index}`}
                onClick={() => {
                  setSelectedOption(index);
                }}
                type="button"
              >
                {option}
              </button>
            );
          })}

          <div className="flex flex-wrap gap-2 pt-2">
            {hasCompletedQuiz ? (
              <Button onClick={handleReset}>Restart Quiz</Button>
            ) : (
              <>
                <Button
                  disabled={selectedOption === null || submitted}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  disabled={!submitted || isLastQuestion}
                  onClick={handleNext}
                  variant="outline"
                >
                  Next Question
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button disabled={isLastQuestion} onClick={handleSkip} variant="ghost">
                  Skip Question
                </Button>
                <Button onClick={handleReset} variant="ghost">
                  Reset Quiz
                </Button>
              </>
            )}
          </div>

          {submitted ? (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">
                {isCorrect ? "Correct." : "Not quite."}
              </p>
              {currentQuestion.explanation ? (
                <p className="mt-1 text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              ) : null}
              {currentQuestion.codeSample ? (
                <pre className="mt-3 overflow-x-auto rounded-md border bg-background p-3 text-xs">
                  <code>{currentQuestion.codeSample}</code>
                </pre>
              ) : null}
            </div>
          ) : null}

          {showFinalScore ? (
            <div className="rounded-md border p-3 text-sm">
                Final score: {score} / {filteredQuestions.length}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sources</CardTitle>
          <CardDescription>
            Question source references used for this quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-muted-foreground text-xs" htmlFor="quiz-source">
              Source
            </label>
            <select
              className="rounded-md border bg-background px-2 py-1 text-sm"
              id="quiz-source"
              onChange={(event) => {
                const selectedUrl = event.target.value;
                if (selectedUrl) {
                  window.open(selectedUrl, "_blank", "noopener,noreferrer");
                }
              }}
              value=""
            >
              <option value="">Select a source</option>
              {quizSources.map((source) => (
                <option key={source.url} value={source.url}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
