import { useEffect, useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import ReportDetail from "./ReportDetail";
import StatsCards from "../../components/StatsCards";

function DashboardPage() {
   const [reports, setReports] = useState([]);
   const [selectedReport, setSelectedReport] = useState(null);
   const [fireStations, setFireStations] = useState([]);
   const apiUrl = import.meta.env.VITE_API_URL;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [reportsRes, stationsRes] = await Promise.all([
               axios.get(`${apiUrl}/fire-reports`),
               axios.get(`${apiUrl}/fire-stations`),
            ]);
            setReports(reportsRes.data);
            setFireStations(stationsRes.data);
         } catch (error) {
            console.error("❌ 데이터 불러오기 실패:", error);
         }
      };
      fetchData();
   }, [apiUrl]);

   const handleDispatch = async (reportToken, fireStationId) => {
      try {
         const res = await axios.post(`${apiUrl}/fire-dispatches`, {
            reportToken,
            fireStationId,
            status: "DISPATCHED",
         });

         const dispatchId = res.data.id;
         const url = `${window.location.origin}/firefighter?token=${reportToken}&fireStationId=${fireStationId}&dispatchId=${dispatchId}`;
         alert(`🚒 출동 URL 생성됨:\n${url}`);
         console.log(`출동 URL:\n${url}`);

         // 상태 업데이트
         setReports((prev) =>
            prev.map((r) =>
               r.id === selectedReport?.id ? { ...r, status: "dispatched" } : r
            )
         );
         setSelectedReport((prev) =>
            prev ? { ...prev, status: "dispatched" } : prev
         );
      } catch (error) {
         alert("❌ 출동 지시 실패");
         console.error(error);
      }
   };

   const statsData = [
      { label: "접수", value: 3 },
      { label: "출동", value: 2 },
      { label: "완료", value: 1 },
      { label: "오늘 신고", value: "6건" },
   ];
   return (
      <div className="flex flex-col gap-8">
         <StatsCards stats={statsData} />

         <ReportTable
            reports={reports}
            onSelect={(report) => setSelectedReport(report)}
         />

         {selectedReport && (
            <ReportDetail
               report={selectedReport}
               fireStations={fireStations}
               onDispatch={handleDispatch}
            />
         )}
      </div>
   );
}

export default DashboardPage;
