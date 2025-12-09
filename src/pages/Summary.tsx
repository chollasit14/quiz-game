// Summary.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Summary.css";
import t01 from "/images/sum1.webp";

export default function Summary() {
  const navigate = useNavigate();

  const [employeeId] = useState(() => localStorage.getItem("employeeId"));
  const [employeeName] = useState(() => localStorage.getItem("employeeName") || "คุณ");
  const [score] = useState(() => localStorage.getItem("score") || "0");
  const [mission] = useState(() => localStorage.getItem("currentMission") || "1");

  // ✅ เพิ่ม flag บอกว่ามาจากหน้า Quiz หรือไม่
  const [quizCompleted] = useState(() => localStorage.getItem("quizCompleted") === "true");

  const [countdown, setCountdown] = useState(4);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  // 🔽 เพิ่มใน useEffect ใหม่
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setButtonEnabled(true); // เปิดให้กดได้
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ ป้องกันการเข้าถึงหน้านี้โดยตรง
  useEffect(() => {
    // เช็คว่ามี employeeId หรือไม่ (ต้องล็อกอินก่อน)
    if (!employeeId) {
      console.warn("⚠️ No employeeId - redirecting to login");
      navigate("/", { replace: true });
      return;
    }

    // เช็คว่าเล่นเกมจบหรือยัง (ต้องมี flag quizCompleted)
    if (!quizCompleted) {
      console.warn("⚠️ Quiz not completed - redirecting to mission");
      navigate("/mission", { replace: true });
      return;
    }

    // ✅ ถ้าผ่านทุกเงื่อนไข ให้ลบ flag ทิ้ง (ใช้ได้ครั้งเดียว)
    localStorage.removeItem("quizCompleted");
  }, [employeeId, quizCompleted, navigate]);

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  // ✅ คะแนนเต็มของแต่ละภารกิจ
  const getTotalScore = (missionId: string): number => {
    const totals: Record<string, number> = {
      "1": 5,   // ภารกิจที่ 1: 5 คะแนน
      "2": 7,   // ภารกิจที่ 2: 7 คะแนน
      "3": 10,  // ภารกิจที่ 3: 10 คะแนน
    };
    return totals[missionId] || 5; // default = 5
  };

  // คำนวณเปอร์เซ็นต์คะแนน
  const totalQuestions = getTotalScore(mission); // ✅ ดึงคะแนนเต็มตามภารกิจ
  const scoreNum = parseInt(score);
  const percentage = (scoreNum / totalQuestions) * 100;

  // badge
  let badgeClass = "badge-poor";
  let badgeText = "ลองใหม่นะ!";
  let icon = "🔍";

  if (percentage === 100) {
    badgeClass = "badge-excellent";
    badgeText = "สายลับในตำนาน";
    icon = "🕵️";
  } else if (percentage >= 80) {
    badgeClass = "badge-excellent";
    badgeText = "สายลับมืออาชีพ";
    icon = "🌟";
  } else if (percentage >= 60) {
    badgeClass = "badge-good";
    badgeText = "สายลับมากประสบการณ์";
    icon = "👍";
  } else if (percentage >= 40) {
    badgeClass = "badge-fair";
    badgeText = "สายลับฝึกหัด";
    icon = "👶";
  }

  // ✅ บันทึกคะแนน - เช็คว่ามี employeeId ก่อน
  useEffect(() => {
    const submitToSheet = async () => {
      // ป้องกันการบันทึกถ้าไม่มี employeeId
      if (!employeeId) {
        console.error("❌ Cannot submit score: No employeeId");
        return;
      }

      // ป้องกันการบันทึกถ้าไม่ได้เล่นจริง
      if (!quizCompleted) {
        console.error("❌ Cannot submit score: Quiz not completed");
        return;
      }

      try {
        console.log("📤 Submitting score:", {
          employeeId,
          score,
          mission,
        });

        const response = await fetch(import.meta.env.VITE_QUIZ_HISTORY_URL, {
          method: "POST",
          body: JSON.stringify({
            employeeId,
            score,
            mission,
          }),
        });

        const result = await response.json();
        console.log("✅ Score submitted:", result);
        
        // ✅ ลบ cache หลังบันทึกสำเร็จ เพื่อให้หน้า Mission โหลดข้อมูลใหม่
        const cacheKey = `mission_cache_${employeeId}`;
        localStorage.removeItem(cacheKey);
        console.log("🗑️ Cache cleared for fresh data on Mission page");
        
      } catch (error) {
        console.error("❌ Error submitting score:", error);
      }
    };

    submitToSheet();
  }, [employeeId, score, mission, quizCompleted]);

  return (
    <div className="summary-container">
      <div className="summary-content">
        <div className="summary-header">
          <div className="summary-icon">{icon}</div>
          <h1>สรุปภารกิจ</h1>
        </div>

        <div className="score-box">
          <div className="score-label">คะแนนของคุณ</div>
          <div className="score-display">{score}</div>
        </div>

        <img src={t01} alt="summary graphic" className="summary-img" />

        <div className={`performance-badge ${badgeClass}`}>{badgeText}</div>

        <p className="summary-message">
          ยอดเยี่ยม สายลับ <strong>{employeeName}</strong>
        </p>
        <p className="summary-message2">ภารกิจลับครั้งนี้สำเร็จแล้ว 🎯</p>

        <div className="summary-actions">
          <button
            className={`btn-primary summary-btn ${buttonEnabled ? "" : "loading"}`}
            onClick={() => navigate("/mission", { replace: true })}
            disabled={!buttonEnabled}
          >
            {!buttonEnabled ? `กรุณารอ ${countdown} วินาที` : "กลับสู่หน้าหลัก"}
          </button>
        </div>

        <div className="summary-footer">
          <p>ขอบคุณที่เข้าร่วมกิจกรรม!</p>
          <p>โปรด Capture หน้าจอเพื่อใช้เป็นหลักฐานในการรับรางวัล</p>
        </div>
      </div>
    </div>
  );
}