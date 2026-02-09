// Quiz3.tsx - ภารกิจที่ 3
import { useState, useEffect } from "react"; //useCallback
import { useNavigate } from "react-router-dom";
import question3Data from "../data/questions3.json";
import "../styles/Quiz3.css";

interface Quiz3Data {
  question: string;
  image: string;
  totalChoices: number;
  correctAnswers: number[];
  maxSelections: number;
}

const data: Quiz3Data = question3Data as Quiz3Data;

export default function Quiz3() {
  const navigate = useNavigate();

  // โหลด state เก่า (ถ้ามี)
  const savedState = (() => {
    try {
      return JSON.parse(localStorage.getItem("quizState3") || "null");
    } catch {
      return null;
    }
  })();

  const [showRules, setShowRules] = useState(!savedState);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(
    savedState?.selectedNumbers || []
  );
  const [isConfirmed, setIsConfirmed] = useState<boolean>(
    savedState?.isConfirmed || false
  );
  const [score, setScore] = useState<number>(savedState?.score || 0);

  // ป้องกันปุ่ม Back
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  // const goToSummary = useCallback(() => {
  //   localStorage.setItem("score", score.toString());
  //   localStorage.setItem("quizCompleted", "true");
  //   localStorage.removeItem("quizState3");
  //   navigate("/summary", { replace: true });
  // }, [score, navigate]);

  // เลือกตัวเลข
  const toggleNumber = (num: number) => {
    if (isConfirmed) return;

    if (selectedNumbers.includes(num)) {
      const newSelected = selectedNumbers.filter((n) => n !== num);
      setSelectedNumbers(newSelected);
      saveState(newSelected, false, 0);
    } else {
      if (selectedNumbers.length < data.maxSelections) {
        const newSelected = [...selectedNumbers, num];
        setSelectedNumbers(newSelected);
        saveState(newSelected, false, 0);
      }
    }
  };

  // บันทึก state
  const saveState = (
    selected: number[],
    confirmed: boolean,
    calcScore: number
  ) => {
    localStorage.setItem(
      "quizState3",
      JSON.stringify({
        selectedNumbers: selected,
        isConfirmed: confirmed,
        score: calcScore,
      })
    );
  };

  // ยืนยันคำตอบ → คำนวณคะแนนแล้วไป summary ทันที
  const confirmAnswer = () => {
    if (selectedNumbers.length !== data.maxSelections) {
      alert(`กรุณาเลือกให้ครบ ${data.maxSelections} ตัว`);
      return;
    }

    const correctCount = selectedNumbers.filter((num) =>
      data.correctAnswers.includes(num)
    ).length;

    setIsConfirmed(true);
    setScore(correctCount);
    saveState(selectedNumbers, true, correctCount);

    // ไปหน้า summary ทันที (ไม่เฉลย ไม่ countdown)
    localStorage.setItem("score", correctCount.toString());
    localStorage.setItem("quizCompleted", "true");
    localStorage.removeItem("quizState3");
    navigate("/summary", { replace: true });
  };

  // สถานะตัวเลข (ไม่ต้องมี correct/wrong แล้ว)
  const getNumberStatus = (num: number) => {
    return selectedNumbers.includes(num) ? "selected" : "";
  };

  // แสดงหน้ากติกาก่อน
  if (showRules) {
    return (
      <div className="quiz3-container">
        <div className="quiz3-content">
          <div className="quiz3-rules">
            <h1>กติกาการเข้าร่วมภารกิจลับ 💡</h1>
            <h2>ภารกิจที่ 3: ทำลายความเสี่ยงสุดขีด (Ultimate Challenge)</h2>
            <div className="rules-box">
              <div className="rule-item">
                <div className="rule-icon">1</div>
                <div className="rule-text">
                  ในภาพจะมี 15 หมายเลขซ่อนจุดเสี่ยงไว้ มี 10 จุดเสี่ยงที่เป็นจุดเสี่ยงที่ถูกต้อง
                </div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">2</div>
                <div className="rule-text">
                  เลือกให้ครบ 10 จุดเสี่ยง ที่คุณคิดว่า "ใช่ที่สุด"
                </div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">3</div>
                <div className="rule-text">
                  เมื่อกดยืนยันคำตอบ ระบบจะสรุปคะแนนทันที
                </div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">4</div>
                <div className="rule-text">
                  คะแนนของคุณจะขึ้นอยู่กับจำนวนจุดเสี่ยงที่คุณเลือกได้ถูกต้อง
                </div>
              </div>
              <div className="rule-item">
                <div className="rule-icon-ex heavy">*</div>
                <div className="rule-text heavy">
                  สายลับต้องทำครบทั้ง 3 ภารกิจเท่านั้นจึงจะมีสิทธิ์รับรางวัลใหญ่
                </div>
              </div>
            </div>
            <button
              className="btn-start-quiz3"
              onClick={() => setShowRules(false)}
            >
              เริ่มเกม
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz3-container">
      <div className="quiz3-content">
        {/* Header */}
        <div className="quiz3-header">
          <h2>ภารกิจที่ 3: ท้าทายสุดขีด</h2>
          <div className="quiz3-score-badge">คะแนน: {score}</div>
        </div>

        {/* คำถาม */}
        <div className="quiz3-question-box">
          <p className="quiz3-question">{data.question}</p>
          <img src={data.image} alt="quiz" className="quiz3-img" />
        </div>

        {/* ตัวเลือก */}
        <div className="quiz3-info">
          <p>
            เลือกแล้ว: <strong>{selectedNumbers.length}</strong> /{" "}
            {data.maxSelections}
          </p>
        </div>

        <div className="quiz3-numbers">
          {Array.from({ length: data.totalChoices }, (_, i) => i + 1).map(
            (num) => {
              const status = getNumberStatus(num);
              return (
                <div
                  key={num}
                  className={`quiz3-number ${status}`}
                  onClick={() => toggleNumber(num)}
                >
                  {num}
                </div>
              );
            }
          )}
        </div>

        {/* ปุ่ม */}
        <div className="quiz3-actions">
          <button
            className="btn-confirm"
            onClick={confirmAnswer}
            disabled={selectedNumbers.length !== data.maxSelections}
          >
            ยืนยันคำตอบ ({selectedNumbers.length}/{data.maxSelections})
          </button>
        </div>
      </div>
    </div>
  );
}
