import { QuizClient } from "@/features/quiz/components/quiz-client";
import { loadQuizQuestions } from "@/features/quiz/load-questions";

const QuizPage = async () => {
  const questions = await loadQuizQuestions();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-6">
      <QuizClient questions={questions} />
    </div>
  );
};

export default QuizPage;
