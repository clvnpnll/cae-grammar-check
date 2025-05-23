import { useEffect, useMemo, useState } from "react";
import { useActivityStore } from "../../store/useActivityStore";
import { useAnswerSheet } from "../../store/useAnswerSheet";
import { QuizHeader } from "../../components/quizHeader";
import { useNavigate } from "react-router-dom";
import { QuizResultItem } from "../../components/quizResultItem";
import Button from "../../components/button";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { activities = [] } = useActivityStore();
  const { answerSheet, activityIndex, quizDone } = useAnswerSheet();
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const activity = useMemo(
    () => (activityIndex != null ? activities[activityIndex] || {} : {}),
    [activities, activityIndex]
  );

  const checkAnswers = () => {
    let score = 0;
    let totalQuestions = 0;
    const items: any[] = [];

    activity.questions?.forEach((question: any) => {
      if (question.round_title) {
        items.push({
          roundTitle: question.round_title,
        });

        question.questions.forEach((item: any) => {
          const questionKey = `R${question.order}-Q${item.order}`;
          const isCorrect = answerSheet[questionKey].answer == item.is_correct;

          items.push({
            key: `Q${item.order}`,
            isCorrect: isCorrect,
            feedback: answerSheet[questionKey].feedback,
          });

          if (isCorrect) {
            score += 1;
          }
          totalQuestions += 1;
        });
      } else {
        const questionKey = `Q${question.order}`;
        const isCorrect =
          answerSheet[questionKey].answer == question.is_correct;

        items.push({
          key: questionKey,
          isCorrect: isCorrect,
          feedback: answerSheet[questionKey].feedback,
        });

        if (isCorrect) {
          score += 1;
        }
        totalQuestions += 1;
      }

      setResultsList(items);
      setResultsLoaded(true);
      setScore(score);
      setTotalQuestions(totalQuestions);
    });
  };

  useEffect(() => {
    if (activityIndex == null) {
      navigate("/home");
    } else if (!quizDone) {
      navigate("/quiz");
    } else {
      checkAnswers();
    }
  }, [activities]);

  const renderResults = () => {
    return resultsList.map((question: any, idx: number) => {
      if (question.roundTitle) {
        return (
          <div
            className="px-8 md:px-12 py-4 w-full text-lg font-bold"
            key={question.roundTitle}
          >
            {question.roundTitle}
          </div>
        );
      } else {
        return (
          <QuizResultItem
            key={idx}
            title={question.key}
            isCorrect={question.isCorrect}
            content={question.feedback}
          />
        );
      }
    });
  };

  return (
    <div className="w-full">
      <QuizHeader
        section={activity.activity_name}
        title={
          <div className="flex justify-between">
            <p>Results</p>
            <p>
              {score}/{totalQuestions}
            </p>
          </div>
        }
      />
      <div className="flex flex-col w-full divide-y border-y mb-12">
        {renderResults()}
      </div>
      {resultsLoaded && (
        <Button label="Home" align="center" onClick={() => navigate("/home")} />
      )}
    </div>
  );
};

export default ResultsPage;
