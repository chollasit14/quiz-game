import { useState, useEffect } from "react";
import questions1 from "../data/questions1.json";
import questions2 from "../data/questions2.json";
import { useNavigate } from "react-router-dom";
import { shuffle } from "../utils/shuffle";
import "../styles/Quiz.css";

interface Question {
  id: number;
  question: string;
  image: string;
  choices: string[];
  answer: string;
}

interface SavedAnswer {
  choice: string;
  correct: boolean;
  answered: boolean;
}

interface QuizState {
  mission: string;
  index: number;
  score: number;
  questions: Question[];
  answers: Record<number, SavedAnswer>;
}

const QUESTIONS_MAP: Record<string, Question[]> = {
  "1": questions1 as Question[],
  "2": questions2 as Question[],
};

export default function Quiz() {
  const navigate = useNavigate();

  // ป้องกันปุ่ม Back
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  const currentMission = localStorage.getItem("currentMission") || "1";
  const totalQuestions = QUESTIONS_MAP[currentMission].length;

  // โหลดสถานะเก่า
  const savedRaw = localStorage.getItem("quizState");
  const savedState: QuizState | null = savedRaw ? JSON.parse(savedRaw) : null;

  // Questions (สุ่มครั้งเดียว, หรือโหลดจาก localStorage)
  const [questions] = useState<Question[]>(() => {
    if (savedState?.questions) return savedState.questions;
    return shuffle(QUESTIONS_MAP[currentMission]);
  });

  // Index
  const [index, setIndex] = useState<number>(savedState?.index ?? 0);

  // Score
  const [correctCount, setCorrectCount] = useState<number>(
    savedState?.score ?? 0
  );

  // โหลดสถานะของข้อปัจจุบัน
  const savedAnswer = savedState?.answers?.[questions[index].id] ?? null;

  const [answered, setAnswered] = useState<boolean>(savedAnswer?.answered ?? false);
  const [selected, setSelected] = useState<string>(savedAnswer?.choice ?? "");

  const q = questions[index];
  const progress = ((index + 1) / totalQuestions) * 100;

  // -----------------------------
  // 🎯 เลือกคำตอบ (เฉลยทันที + บันทึก localStorage ทันที)
  // -----------------------------
  const choose = (choice: string) => {
    if (answered) return;

    const isCorrect = choice === q.answer;

    setSelected(choice);
    setAnswered(true);

    // อัปเดตคะแนน
    const newScore = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newScore);

    // บันทึกสถานะใหม่
    const updatedState: QuizState = {
      mission: currentMission,
      index,
      score: newScore,
      questions,
      answers: {
        ...(savedState?.answers || {}),
        [q.id]: {
          choice,
          correct: isCorrect,
          answered: true,
        },
      },
    };

    localStorage.setItem("quizState", JSON.stringify(updatedState));
  };

  // -----------------------------
  // 🎯 ข้อถัดไป
  // -----------------------------
  const next = () => {
    if (index === totalQuestions - 1) {
      localStorage.setItem("score", correctCount.toString());
      localStorage.setItem("quizCompleted", "true");
      localStorage.removeItem("quizState");
      navigate("/summary", { replace: true });
      return;
    }

    const newIndex = index + 1;

    const nextSaved = savedState?.answers?.[questions[newIndex].id];

    setIndex(newIndex);
    setSelected(nextSaved?.choice ?? "");
    setAnswered(nextSaved?.answered ?? false);

    // อัปเดตสถานะ index ใน localStorage
    const updatedState: QuizState = {
      mission: currentMission,
      index: newIndex,
      score: correctCount,
      questions,
      answers: savedState?.answers ?? {},
    };

    localStorage.setItem("quizState", JSON.stringify(updatedState));
  };

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-text">
              ด่านที่ {index + 1} / {totalQuestions}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="quiz-score">
            <div className="score-badge">คะแนน: {correctCount}</div>
          </div>
        </div>

        <div className="question-box">
          <div className="question">{q.question}</div>
          <img src={q.image} className="quiz-img" alt="question" />
        </div>

        <div className="choices">
          {q.choices.map((c) => {
            let className = "choice";

            if (answered) {
              if (c === q.answer) className += " correct";
              else if (c === selected) className += " wrong";
              className += " disabled";
            }

            return (
              <div
                key={c}
                className={className}
                onClick={() => choose(c)}
              >
                {c}
              </div>
            );
          })}
        </div>

        {answered && (
          <div className="quiz-actions">
            <button className="btn-next" onClick={next}>
              {index === totalQuestions - 1 ? "ดูผลคะแนน" : "ข้อถัดไป"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
