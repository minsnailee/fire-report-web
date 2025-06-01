import FireMap from "../components/FireMap";
import ChatBotBox from "../components/ChatBotBox";

function ReportPage() {
   return (
      <div>
         <h1 className="hidden">🔥 화재 신고하기</h1>
         <FireMap />
         <ChatBotBox />
      </div>
   );
}

export default ReportPage;
