import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import "./App.css";

import ReportPage from "./pages/ReportPage";
import ChatBotPage from "./pages/ChatBotPage";
import DashboardPage from "./pages/DashboardPage";
import FirefighterPage from "./pages/FirefighterPage";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/chatbot" element={<ChatBotPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/firefighter" element={<FirefighterPage />} />
         </Routes>
      </Router>
   );
}

export default App;
