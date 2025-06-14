import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import "./App.css";

import ReportPage from "./pages/ReportPage/ReportPage";
import ChatBotPage from "./pages/ChatBotPage/ChatBotPage";
import DashboardWrapper from "./pages/DashboardPage/DashboardWrapper";
import FirefighterPage from "./pages/FirefighterPage/FirefighterPage";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/chatbot" element={<ChatBotPage />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/firefighter" element={<FirefighterPage />} />
         </Routes>
      </Router>
   );
}

export default App;
