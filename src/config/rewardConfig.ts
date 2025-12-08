// src/config/rewardConfig.ts

export interface RewardTier {
  minScore: number;
  maxScore: number;
  title: string;
  message: string;
  className: string;
  icon: string;
}

// ⚙️ กำหนดเกณฑ์การให้รางวัล (แก้ได้ง่าย)
export const REWARD_CONFIG = {
  // คะแนนเต็มของแต่ละภารกิจ
  // POINTS_PER_MISSION: 5,
  
  // จำนวนภารกิจทั้งหมด
  TOTAL_MISSIONS: 3,
  MISSION_1: 5, 
  MISSION_2: 7,
  MISSION_3: 10,
  // คะแนนเต็มรวม
  get MAX_SCORE() {
    // return this.POINTS_PER_MISSION * this.TOTAL_MISSIONS;
    return this.MISSION_1 + this.MISSION_2 + this.MISSION_3
  },
  
  // เกณฑ์การให้รางวัล (เรียงจากมากไปน้อย)
  TIERS: [
    {
      minScore: 22,
      maxScore: 22,
      title: "ยินดีด้วย! คุณได้รับรางวัล",
      message: "กรุณานำหลักฐานไปแลกรับของรางวัล",
      className: "tier-reward",
      icon: "🏆"
    },
    {
      minScore: 17,
      maxScore: 21,
      title: "ดีมาก!",
      message: "เกือบได้รางวัลแล้ว ลองเล่นใหม่ในภารกิจถัดไปนะ",
      className: "tier-good",
      icon: "👍"
    },
    {
      minScore: 11,
      maxScore: 16,
      title: "ปานกลาง",
      message: "ยังสามารถทำได้ดีกว่านี้ ลองอีกครั้งในภารกิจถัดไป",
      className: "tier-medium",
      icon: "😊"
    },
    {
      minScore: 6,
      maxScore: 10,
      title: "พอใช้",
      message: "พยายามต่อไป! ศึกษาเพิ่มเติมและลองใหม่ในภารกิจถัดไป",
      className: "tier-fair",
      icon: "💪"
    },
    {
      minScore: 0,
      maxScore: 5,
      title: "พยายามใหม่",
      message: "ยังไม่ผ่านเกณฑ์ แต่อย่าท้อแท้ ลองศึกษาเพิ่มเติมและเล่นภารกิจถัดไป",
      className: "tier-poor",
      icon: "📚"
    }
  ] as RewardTier[]
};

// ฟังก์ชันหา Tier ตามคะแนน
export function getRewardTier(totalScore: number): RewardTier {
  for (const tier of REWARD_CONFIG.TIERS) {
    if (totalScore >= tier.minScore && totalScore <= tier.maxScore) {
      return tier;
    }
  }
  // fallback
  return REWARD_CONFIG.TIERS[REWARD_CONFIG.TIERS.length - 1];
}