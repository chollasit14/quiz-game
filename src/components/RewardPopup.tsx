// src/components/RewardPopup.tsx
import { useEffect } from "react";
import "../styles/RewardPopup.css";
import { REWARD_CONFIG, getRewardTier } from "../config/rewardConfig";

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  totalScore?: number; // คะแนนรวม (ถ้ามี)
  showScoreResult?: boolean; // แสดงผลคะแนนหรือแค่เกณฑ์
}

export default function RewardPopup({
  isOpen,
  onClose,
  totalScore = 0,
  showScoreResult = false,
}: RewardPopupProps) {
  // ปิด popup เมื่อกด ESC
  const employeeName = localStorage.getItem("employeeName") || "สายลับ";
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // ล็อก scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tier = getRewardTier(totalScore);

  return (
    <div className="reward-overlay" onClick={onClose}>
      <div className="reward-popup" onClick={(e) => e.stopPropagation()}>
        {/* ปุ่มปิด */}
        <button className="reward-close" onClick={onClose}>
          ✕
        </button>

        {/* หัวข้อ */}
        <div className="reward-header">
          <h2>🎁 เกณฑ์การให้รางวัล</h2>
        </div>

        {/* รูปภาพเกณฑ์ (placeholder - เปลี่ยนเป็นรูปจริงได้) */}
        {/* <div className="reward-image">
          <img
            src="https://via.placeholder.com/400x200/667eea/ffffff?text=Reward+Criteria"
            alt="เกณฑ์การให้รางวัล"
          />
          <p className="reward-image-note">
            * เปลี่ยนรูปได้ที่ RewardPopup.tsx
          </p>
        </div> */}

        {/* คะแนนรวมทั้งหมด */}
        <div className="reward-score-section">
          <h3>📊 คะแนนรวมทั้ง {REWARD_CONFIG.TOTAL_MISSIONS} ภารกิจ</h3>
          <div className="reward-max-score">
            คะแนนเต็ม: <strong>{REWARD_CONFIG.MAX_SCORE} คะแนน</strong>
          </div>
        </div>

        <div className="reward-benefit-section">
          <h4 className="benefit-title">🎉 สิทธิพิเศษสำหรับผู้เข้าร่วมกิจกรรม 🎉</h4>

          <div className="benefit-card">
            <div className="benefit-number">ต่อที่ 1</div>
            <div className="benefit-text">
              ของรางวัลสำหรับผู้เข้าร่วมทุกคน เพียงเข้าร่วมกิจกรรมในแต่ละภารกิจ  
              คุณจะได้รับ “ของรางวัลสุดพิเศษทันที” มอบให้ทุกคนแบบไม่ต้องลุ้น!
            </div>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">ต่อที่ 2</div>
            <div className="benefit-text">
              ลุ้นรางวัลใหญ่เมื่อทำภารกิจครบ 3 ภารกิจ  
              เล่นเกมให้ครบทั้ง 3 ภารกิจ สะสมคะแนนลุ้นรับรางวัลใหญ่ไปเลย!
            </div>
          </div>
        </div>

        {/* แสดงผลคะแนนของผู้ใช้ (ถ้ามี) */}
        {showScoreResult && (
          <div className={`reward-result ${tier.className}`}>
            <div className="reward-icon">{tier.icon}</div>
            <div className="reward-user-score">คะแนนสะสมของสายลับ</div>
            <div className="reward-user-score">"{employeeName}"</div>
            <div className="reward-user-score"><strong>{totalScore} คะแนน</strong></div>
            <div className="reward-title">{tier.title}</div>
            <div className="reward-message">{tier.message}</div>
          </div>
        )}

        {/* ตารางเกณฑ์ */}
        <div className="reward-criteria">
          <h3>🎯 เกณฑ์การประเมิน</h3>
          <table className="reward-table">
            <thead>
              <tr>
                <th>ช่วงคะแนน</th>
                <th>ผลการประเมิน</th>
              </tr>
            </thead>
            <tbody>
              {REWARD_CONFIG.TIERS.map((tier, index) => (
                <tr
                  key={index}
                  className={
                    showScoreResult &&
                    totalScore >= tier.minScore &&
                    totalScore <= tier.maxScore
                      ? "highlight"
                      : ""
                  }
                >
                  <td>
                    {tier.minScore === tier.maxScore
                      ? `${tier.maxScore} คะแนน`
                      : `${tier.minScore} - ${tier.maxScore} คะแนน`}
                  </td>
                  <td>
                    {tier.icon} {tier.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ปุ่มปิด */}
        <div className="reward-actions">
          <button className="reward-btn-close" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}