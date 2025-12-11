// Mission.tsx - Single API + Cache Version
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Mission.css";
import RewardPopup from "../components/RewardPopup";

const MISSIONS = [
  {
    id: 1,
    name: "ภารกิจที่ 1: จับจุดเสี่ยงพื้นฐาน (Basic Scan)",
    startDate: new Date("2025-12-10T00:00:00"),
    endDate: new Date("2025-12-19T23:59:59"),
    icon: "🔍",
    color: "mission-1"
  },
  {
    id: 2,
    name: "ภารกิจที่ 2: ตรวจจับความเสี่ยงขั้นสูง (Advanced Detection)",
    // startDate: new Date("2026-01-12T00:00:00"),
    startDate: new Date("2025-12-10T00:00:00"),
    endDate: new Date("2026-01-16T23:59:59"),
    icon: "🎯",
    color: "mission-2"
  },
  {
    id: 3,
    name: "ภารกิจที่ 3: ทำลายความเสี่ยงสุดขีด (Ultimate Challenge)",
    // startDate: new Date("2026-02-09T00:00:00"),
    startDate: new Date("2025-12-10T00:00:00"),
    endDate: new Date("2026-02-13T23:59:59"),
    icon: "🏆",
    color: "mission-3"
  }
];

// ⚙️ ตั้งค่า Cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 นาที

export default function Mission() {
  const navigate = useNavigate();
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [missionScores, setMissionScores] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [isRewardOpen, setRewardOpen] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const employeeId = localStorage.getItem("employeeId");
  const employeeName = localStorage.getItem("employeeName") || "สายลับ";

  useEffect(() => {
    if (!employeeId) {
      navigate("/", { replace: true });
      return;
    }

    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    const checkCompletedMissions = async () => {
      const now = new Date();
      const cacheKey = `mission_cache_${employeeId}`;

      // ✅ 1. ตรวจสอบ Cache ก่อน
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          if (age < CACHE_DURATION) {
            console.log("✅ Using cached data (age:", Math.floor(age / 1000), "seconds)");
            setCompletedMissions(data.completed);
            setMissionScores(data.scores);
            setTotalScore(data.total);
            setLoading(false);
            return; // ใช้ cache ไม่ต้อง fetch
          } else {
            console.log("⏰ Cache expired, fetching new data");
          }
        } catch (e) {
          console.warn("⚠️ Cache parse error:", e);
        }
      }

      // ✅ 2. ถ้าไม่มี cache หรือหมดอายุ → Fetch ใหม่
      setLoading(true);

      try {
        // ⚡ Single API Call
        const url = `${import.meta.env.VITE_QUIZ_HISTORY_URL}?employeeId=${employeeId}&missions=1,2,3`;
        
        console.time("⏱️ API Call");
        const res = await fetch(url);
        const data = await res.json();
        console.timeEnd("⏱️ API Call");

        // ✅ ประมวลผล
        const completed: number[] = [];
        const scores: Record<number, number> = {};

        MISSIONS.forEach((mission) => {
          const missionData = data[mission.id];
          
          if (missionData && missionData.exists) {
            completed.push(mission.id);
            scores[mission.id] = missionData.score || 0;
          } else if (now > mission.endDate) {
            scores[mission.id] = 0;
          }
        });

        const total = Object.values(scores).reduce((a, b) => a + b, 0);

        // ✅ 3. บันทึก Cache
        localStorage.setItem(cacheKey, JSON.stringify({
          data: { completed, scores, total },
          timestamp: Date.now()
        }));

        setCompletedMissions(completed);
        setMissionScores(scores);
        setTotalScore(total);

        console.log("✅ Data fetched and cached");
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }

      setLoading(false);
    };

    checkCompletedMissions();

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [employeeId, navigate]);

  const isMissionActive = (mission: typeof MISSIONS[0]) => {
    const now = new Date();
    return now >= mission.startDate && now <= mission.endDate;
  };

  const isMissionUpcoming = (mission: typeof MISSIONS[0]) => {
    const now = new Date();
    return now < mission.startDate;
  };

  const handleMissionClick = (mission: typeof MISSIONS[0]) => {
    if (completedMissions.includes(mission.id)) {
      alert("คุณทำภารกิจนี้เสร็จแล้ว!");
      return;
    }

    if (!isMissionActive(mission)) {
      if (isMissionUpcoming(mission)) {
        alert("ภารกิจนี้ยังไม่เปิดให้เล่น!");
      } else {
        alert("ภารกิจนี้หมดเวลาแล้ว!");
      }
      return;
    }

    localStorage.setItem("currentMission", mission.id.toString());
    
    // ✅ ภารกิจที่ 3 ไปหน้า Quiz3 แทน
    if (mission.id === 3) {
      navigate("/quiz3", {
        state: {
          employeeName,
          missionId: mission.id,
          missionName: mission.name
        }
      });
    } else {
      navigate("/rules", {
        state: {
          employeeName,
          missionId: mission.id,
          missionName: mission.name
        }
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="mission-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-container">
      <div className="mission-content">
        <div className="mission-header">
          <h1>ยินดีต้อนรับสายลับ {employeeName}</h1>
          <p>เลือกภารกิจที่ต้องการเข้าร่วม</p>
        </div>

        <div className="reward-summary-wrapper">
          <button className="reward-summary-btn" onClick={() => setRewardOpen(true)}>
            ⭐เกณฑ์รางวัล
          </button>
        </div>

        <div className="missions-list">
          {MISSIONS.map((mission) => {
            const isCompleted = completedMissions.includes(mission.id);
            const isActive = isMissionActive(mission);
            const isUpcoming = isMissionUpcoming(mission);

            let cardClass = "mission-card";
            if (isCompleted) cardClass += " completed";
            else if (isActive) cardClass += " active";
            else cardClass += " locked";

            return (
              <div key={mission.id} className={cardClass} onClick={() => handleMissionClick(mission)}>
                <div className="mission-icon">
                  {isCompleted ? "✅" : mission.icon}
                </div>

                <div className="mission-info">
                  <h2>{mission.name}</h2>
                  <p className="mission-date">
                    {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                  </p>

                  <div className="mission-status">
                    {isCompleted && (
                      <>
                        <span className="badge badge-completed">✓ เสร็จสิ้น</span>
                        <span className="badge badge-score">
                          🏆 {missionScores[mission.id] ?? 0} คะแนน
                        </span>
                      </>
                    )}
                    {!isCompleted && isActive && (
                      <span className="badge badge-active">🔥 พร้อมเล่น</span>
                    )}
                    {!isCompleted && isUpcoming && (
                      <span className="badge badge-upcoming">⏰ เร็วๆ นี้</span>
                    )}
                    {!isCompleted && !isActive && !isUpcoming && (
                      <span className="badge badge-expired">⏱️ หมดเวลา</span>
                    )}
                  </div>
                </div>

                {isActive && !isCompleted && (
                  <div className="mission-arrow">→</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mission-footer">
          <button className="btn-logout" onClick={() => {
            localStorage.clear();
            navigate("/", { replace: true });
          }}>
            ออกจากระบบ
          </button>
        </div>

        <RewardPopup
          isOpen={isRewardOpen}
          onClose={() => setRewardOpen(false)}
          totalScore={totalScore}
          showScoreResult={completedMissions.length === 3}
          // showScoreResult={true}
        />
      </div>
    </div>
  );
}