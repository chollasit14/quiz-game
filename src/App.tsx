// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Rules from "./pages/Rules";
import Quiz from "./pages/Quiz";
import Quiz3 from "./pages/Quiz3";
import Summary from "./pages/Summary";
import Mission from "./pages/Mission";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz3" element={<Quiz3 />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}
