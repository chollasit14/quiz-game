import { useState, useEffect } from "react";
import questions1 from "../data/questions1.json";
import questions2 from "../data/questions2.json";
// import questions3 from "../data/questions3.json";
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

const QUESTIONS_MAP: Record<string, Question[]> = {
  "1": questions1 as Question[],
  "2": questions2 as Question[],
  // "3": questions3 as Question[],
};

export default function Quiz() {
  const navigate = useNavigate();

  // 🔒 ป้องกันปุ่ม Back
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  const currentMission = localStorage.getItem("currentMission") || "1";

  // โหลดสถานะเก่า (ครั้งเดียวตอน mount)
  const initialState = (() => {
    try {
      return JSON.parse(localStorage.getItem("quizState") || "null");
    } catch {
      return null;
    }
  })();

  const totalQuestions = QUESTIONS_MAP[currentMission].length;

  // --------------------------
  // 🎯 คำถาม → derive ด้วย lazy initializer (วิธีที่ถูกต้องตาม React)
  // --------------------------
  const [questions] = useState<Question[]>(() => {
    if (initialState?.questions) return initialState.questions;
    return shuffle(QUESTIONS_MAP[currentMission]); // สุ่มแค่รอบเดียว
  });

  const [index, setIndex] = useState<number>(initialState?.index || 0);
  const [correctCount, setCorrectCount] = useState<number>(
    initialState?.score || 0
  );

  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState("");

  const q = questions[index];
  const progress = ((index + 1) / totalQuestions) * 100;

  // --------------------------
  // 🎯 ฟังก์ชันตอบคำถาม
  // --------------------------
  const choose = (choice: string) => {
    if (answered) return;

    setSelected(choice);
    setAnswered(true);

    const isCorrect = choice === q.answer;

    // update คะแนนใน state
    if (isCorrect) setCorrectCount((c) => c + 1);

    // บันทึกลง localStorage
    const saved = JSON.parse(localStorage.getItem("quizState") || "{}");
    saved.answers = saved.answers || {};
    saved.answers[q.id] = choice;
    saved.score = isCorrect ? correctCount + 1 : correctCount;

    localStorage.setItem("quizState", JSON.stringify(saved));
  };

  // --------------------------
  // 🎯 ข้อถัดไป
  // --------------------------
  const next = () => {
    if (index === totalQuestions - 1) {
      // จบเกม
      localStorage.setItem("score", correctCount.toString());
      localStorage.setItem("quizCompleted", "true");

      localStorage.removeItem("quizState");
      navigate("/summary", { replace: true });
      return;
    }

    const newIndex = index + 1;
    setIndex(newIndex);
    setSelected("");
    setAnswered(false);

    // update index
    const saved = JSON.parse(localStorage.getItem("quizState") || "{}");
    saved.index = newIndex;
    saved.mission = currentMission;
    saved.questions = questions;
    localStorage.setItem("quizState", JSON.stringify(saved));
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
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
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
              <div className={className} key={c} onClick={() => choose(c)}>
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
