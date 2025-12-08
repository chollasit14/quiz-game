// Rules.tsx
import { useNavigate , useLocation } from "react-router-dom";
import "../styles/Rules.css";
import t01 from "../assets/img/t01.png";

export default function Rules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeName, missionId, missionName } = location.state || {};
  console.log(missionId, missionName);
  return (
    <div className="rules-container">
      <div className="rules-content">
        <div className="rules-header">
          {/* <h1>กติกาการเล่น</h1> */}
          <h1>ยินดีต้อนรับ สายลับ {employeeName}</h1>
          {/* <p>อ่านกติกาให้เข้าใจก่อนเริ่มเกม</p> เข้าสู่ภารกิจลับ : */}
          <h2>{missionName}</h2>
        </div>

        <div className="rules-box">
          <div className="rule-item">
            <div className="rule-icon">1</div>
            <div className="rule-text">จะมีคำถามทั้งหมด 5 ข้อ</div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">2</div>
            <div className="rule-text">ตอบแล้วจะเฉลยทันที</div>
          </div>

          <div className="rule-item">
            <div className="rule-icon">3</div>
            <div className="rule-text">ตอบครบแล้วจะสรุปคะแนนให้</div>
          </div>
        </div>

        <img
          src={t01}
          className="rule-img"
          alt="rules graphic"
        />

        <div className="rules-actions">
          <button className="btn-start" onClick={() => navigate("/quiz")}>
            เริ่มเกม
          </button>
        </div>
      </div>
    </div>
  );
}