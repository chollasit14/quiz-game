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
  submitted: boolean;
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

  // โหลด state
  const savedRaw = localStorage.getItem("quizState");
  const savedState: QuizState | null = savedRaw ? JSON.parse(savedRaw) : null;

  // questions (สุ่มครั้งเดียว)
  const [questions] = useState<Question[]>(() => {
    if (savedState?.questions) return savedState.questions;
    return shuffle(QUESTIONS_MAP[currentMission]);
  });

  const [index, setIndex] = useState<number>(savedState?.index ?? 0);
  const [correctCount, setCorrectCount] = useState<number>(
    savedState?.score ?? 0
  );

  const q = questions[index];
  const savedAnswer = savedState?.answers?.[q.id];

  const [selected, setSelected] = useState<string>(
    savedAnswer?.choice ?? ""
  );

  const progress = ((index + 1) / totalQuestions) * 100;

  // -----------------------------
  // 🎯 เลือกคำตอบ (ยังเปลี่ยนได้)
  // -----------------------------
  const choose = (choice: string) => {
    setSelected(choice);

    const updatedState: QuizState = {
      mission: currentMission,
      index,
      score: correctCount,
      questions,
      answers: {
        ...(savedState?.answers || {}),
        [q.id]: {
          choice,
          submitted: false,
        },
      },
    };

    localStorage.setItem("quizState", JSON.stringify(updatedState));
  };

  // -----------------------------
  // 🎯 ข้อถัดไป (ตรวจคำตอบตรงนี้)
  // -----------------------------
  const next = () => {
    if (!selected) return; // กันกดข้ามโดยไม่เลือก

    let newScore = correctCount;

    // ตรวจคำตอบตอน submit เท่านั้น
    if (selected === q.answer) {
      newScore += 1;
      setCorrectCount(newScore);
    }

    const updatedAnswers = {
      ...(savedState?.answers || {}),
      [q.id]: {
        choice: selected,
        submitted: true,
      },
    };

    if (index === totalQuestions - 1) {
      localStorage.setItem("score", newScore.toString());
      localStorage.setItem("quizCompleted", "true");
      localStorage.removeItem("quizState");
      navigate("/summary", { replace: true });
      return;
    }

    const newIndex = index + 1;
    const nextSaved = updatedAnswers[questions[newIndex].id];

    setIndex(newIndex);
    setSelected(nextSaved?.choice ?? "");

    const updatedState: QuizState = {
      mission: currentMission,
      index: newIndex,
      score: newScore,
      questions,
      answers: updatedAnswers,
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
            {/* <div className="score-badge">คะแนน: {correctCount}</div> */}
          </div>
        </div>

        <div className="question-box">
          <div className="question">{q.question}</div>
          <img src={q.image} className="quiz-img" alt="question" />
        </div>

        <div className="choices">
          {q.choices.map((c) => {
            let className = "choice";
            if (c === selected) className += " selected";

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

        <div className="quiz-actions">
          <button
            className="btn-next"
            onClick={next}
            disabled={!selected}
          >
            {index === totalQuestions - 1 ? "ดูผลคะแนน" : "ข้อถัดไป"}
          </button>
        </div>
      </div>
    </div>
  );
}
