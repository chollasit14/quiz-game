// Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  // ตรวจรูปแบบรหัส
  const validateEmployeeId = (id: string): boolean => {
    const pattern = /^[A-Z]\d{6}$/;
    return pattern.test(id);
  };

  const checkEmployee = async () => {
    setError("");

    if (!employeeId) {
      setError("กรุณากรอกรหัสพนักงาน");
      return;
    }

    if (!validateEmployeeId(employeeId)) {
      setError("รูปแบบรหัสไม่ถูกต้อง (เช่น A123456)");
      return;
    }

    setLoading(true);

    try {
      // 1) ตรวจว่ารหัสมีพนักงานจริงไหม
      const empUrl = `https://script.google.com/macros/s/AKfycbyi-anb30fkWQ8ZNmDX4t1dpRqK4zXB8UlFdw9jmZTgeKC6YwOkOQeBh21xKCpWadHz/exec?sheet=kaizen&empId=${employeeId}`;
      const empRes = await fetch(empUrl);
      const empData = await empRes.json();

      if (empData.error) {
        setError("ไม่พบรหัสพนักงาน");
        setLoading(false);
        return;
      }

      const fullName = `${empData.name}`; // ${empData.lastname}

      // 2) ตรวจว่าทำแบบทดสอบไปแล้วหรือยัง
      // const checkUrl = `https://script.google.com/macros/s/AKfycbyHtLaTThhM5nYbEXzvCxLXtrpOEfb-h_KOdcl0b3iHU8ao8lsMYr15yS-J6leqAOYP/exec?employeeId=${employeeId}`;
      // const checkRes = await fetch(checkUrl);
      // const checkData = await checkRes.json();

      // if (checkData.exists) {
      //   setError("รหัสนี้ทำแบบทดสอบไปแล้ว");
      //   setLoading(false);
      //   return;
      // }

      // 3) เก็บข้อมูลลง localStorage
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("employeeName", fullName);

      // 4) ส่งชื่อไปหน้า rules
      // navigate("/rules", { state: { employeeName: fullName } });
      navigate("/mission", { state: { employeeName: fullName } });

    } catch (err) {
      console.log(err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(e.target.value.toUpperCase());
    setError("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">👀</div>
          <h1 className="">ภารกิจลับจับจุดเสี่ยง</h1>
          <p>กรุณากรอกรหัสพนักงานเพื่อเข้าร่วมกิจกรรม</p>
        </div>

        <div className="login-form">
          <div className="input-group">
            <label htmlFor="employeeId">รหัสพนักงาน</label>
            <input
              id="employeeId"
              type="text"
              placeholder="เช่น A123456"
              value={employeeId}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && checkEmployee()}
              disabled={loading}
              maxLength={7}
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <button
            className={`login-button ${loading ? "loading" : ""}`}
            onClick={checkEmployee}
            disabled={loading}
          >
            {loading ? "" : "เข้าสู่ระบบ"}
          </button>
        </div>

        <div className="login-footer">
          <p>กรุณาตรวจสอบรหัสให้ถูกต้อง</p>
        </div>
      </div>
    </div>
  );
}
