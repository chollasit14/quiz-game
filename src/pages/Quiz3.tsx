// Quiz3.tsx - ภารกิจที่ 3
import { useState, useEffect, useCallback } from "react"; // ✅ เพิ่ม useCallback
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

  const [showRules, setShowRules] = useState(!savedState); // ✅ ถ้ามี savedState ไม่แสดงกติกา
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(
    savedState?.selectedNumbers || []
  );
  const [isConfirmed, setIsConfirmed] = useState<boolean>(
    savedState?.isConfirmed || false
  );
  const [score, setScore] = useState<number>(savedState?.score || 0);
  const [countdown, setCountdown] = useState<number>(10);

  // ป้องกันปุ่ม Back
  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  // ✅ ใช้ useCallback เพื่อป้องกัน dependency warning
  const goToSummary = useCallback(() => {
    localStorage.setItem("score", score.toString());
    localStorage.setItem("quizCompleted", "true");
    localStorage.removeItem("quizState3");
    navigate("/summary", { replace: true });
  }, [score, navigate]);

  // นับถอยหลังหลังยืนยันคำตอบ
  useEffect(() => {
    if (isConfirmed && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isConfirmed && countdown === 0) {
      goToSummary();
    }
  }, [isConfirmed, countdown, goToSummary]); // ✅ เพิ่ม goToSummary

  // เลือกตัวเลข
  const toggleNumber = (num: number) => {
    if (isConfirmed) return; // ล็อกหลังยืนยัน

    if (selectedNumbers.includes(num)) {
      // ยกเลิกการเลือก
      const newSelected = selectedNumbers.filter((n) => n !== num);
      setSelectedNumbers(newSelected);
      saveState(newSelected, false, 0);
    } else {
      // เลือกใหม่ (ไม่เกิน 10)
      if (selectedNumbers.length < data.maxSelections) {
        const newSelected = [...selectedNumbers, num];
        setSelectedNumbers(newSelected);
        saveState(newSelected, false, 0);
      }
    }
  };

  // บันทึก state
  const saveState = (selected: number[], confirmed: boolean, calcScore: number) => {
    localStorage.setItem(
      "quizState3",
      JSON.stringify({
        selectedNumbers: selected,
        isConfirmed: confirmed,
        score: calcScore,
      })
    );
  };

  // ยืนยันคำตอบ
  const confirmAnswer = () => {
    if (selectedNumbers.length !== data.maxSelections) {
      alert(`กรุณาเลือกให้ครบ ${data.maxSelections} ตัว`);
      return;
    }

    // คำนวณคะแนน
    const correctCount = selectedNumbers.filter((num) =>
      data.correctAnswers.includes(num)
    ).length;

    setIsConfirmed(true);
    setScore(correctCount);
    saveState(selectedNumbers, true, correctCount);
  };

  // สถานะตัวเลข
  const getNumberStatus = (num: number) => {
    if (!isConfirmed) {
      return selectedNumbers.includes(num) ? "selected" : "";
    }

    // หลังยืนยัน
    if (!selectedNumbers.includes(num)) return ""; // ไม่ได้เลือก → สีขาว

    const isCorrect = data.correctAnswers.includes(num);
    return isCorrect ? "correct" : "wrong";
  };

  // ✅ แสดงหน้ากติกาก่อน
  if (showRules) {
    return (
      <div className="quiz3-container">
        <div className="quiz3-content">
          <div className="quiz3-rules">
            <h1>🎯 ภารกิจที่ 3: ท้าทายสุดขีด</h1>
            <div className="rules-box">
              <div className="rule-item">
                <div className="rule-icon">1</div>
                <div className="rule-text">จะมีรูปภาพ 1 รูป พร้อมตัวเลข 15 ตัว</div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">2</div>
                <div className="rule-text">เลือกตัวเลขที่คิดว่าถูกต้อง ให้ครบ 10 ตัว</div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">3</div>
                <div className="rule-text">กดยืนยันคำตอบ จะเฉลยทันที</div>
              </div>
              <div className="rule-item">
                <div className="rule-icon">4</div>
                <div className="rule-text">คะแนนจะนับตามจำนวนที่ตอบถูก</div>
              </div>
            </div>
            <button className="btn-start-quiz3" onClick={() => setShowRules(false)}>
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
          {!isConfirmed ? (
            <p>
              เลือกแล้ว: <strong>{selectedNumbers.length}</strong> / {data.maxSelections}
            </p>
          ) : (
            <p className="quiz3-result">
              คะแนนที่ได้: <strong>{score}</strong> / {data.maxSelections}
            </p>
          )}
        </div>

        <div className="quiz3-numbers">
          {Array.from({ length: data.totalChoices }, (_, i) => i + 1).map((num) => {
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
          })}
        </div>

        {/* ปุ่ม */}
        <div className="quiz3-actions">
          {!isConfirmed ? (
            <button
              className="btn-confirm"
              onClick={confirmAnswer}
              disabled={selectedNumbers.length !== data.maxSelections}
            >
              ยืนยันคำตอบ ({selectedNumbers.length}/{data.maxSelections})
            </button>
          ) : (
            <>
              <p className="quiz3-countdown">
                ไปหน้าสรุปอัตโนมัติใน {countdown} วินาที...
              </p>
              <button className="btn-summary" onClick={goToSummary}>
                ไปหน้าสรุปคะแนน
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}