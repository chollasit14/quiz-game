// Rules.tsx
import { useNavigate , useLocation } from "react-router-dom";
import "../styles/Rules.css";

export default function Rules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeName, missionId, missionName } = location.state || {};
  console.log(missionId, missionName, employeeName);
  return (
    <div className="rules-container">
      <div className="rules-content">
        <div className="rules-header">
          {/* <h1>กติกาการเล่น</h1> */}
          <h1>กติกาการเข้าร่วมภารกิจลับ 💡</h1>
          {/* <p>อ่านกติกาให้เข้าใจก่อนเริ่มเกม</p> เข้าสู่ภารกิจลับ : */}
          <h2>{missionName}</h2>
        </div>

        <div className="rules-box">
          <div className="rule-item">
            <div className="rule-icon">1</div>
            <div className="rule-text">
              {missionId === 1
                      ? `คำถามมีจำนวนทั้งหมด 5 ข้อ`
                      : `คำถามมีจำนวนทั้งหมด 7 ข้อ`}
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">2</div>
            <div className="rule-text">เมื่อสายลับเลือกคำตอบ ระบบจะทำการตรวจสอบและเฉลยโดยทันที ไม่สามารถแก้ไขได้</div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">3</div>
            <div className="rule-text">เมื่อสายลับตอบคำถามภารกิจนี้ครบทุกข้อ ระบบจะเผยคะแนนสายลับของคุณให้ทราบ</div>
          </div>

          <div className="rule-item">
            <div className="rule-icon-ex heavy">*</div>
            <div className="rule-text heavy">สายลับต้องทำครบทั้ง 3 ภารกิจเท่านั้นจึงจะมีสิทธิ์รับรางวัลใหญ่</div>
          </div>
        </div>

        <div className="rules-actions">
          <button className="btn-start" onClick={() => navigate("/quiz")}>
            เริ่มเกม
          </button>
        </div>
      </div>
    </div>
  );
}