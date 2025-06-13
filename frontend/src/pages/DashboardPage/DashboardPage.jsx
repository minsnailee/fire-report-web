import { useEffect, useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import ReportDetail from "./ReportDetail";

function DashboardPage() {
   const [reports, setReports] = useState([]);
   const [selectedReport, setSelectedReport] = useState(null);
   const [generatedUrl, setGeneratedUrl] = useState("");
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

   const generateReportUrl = async () => {
      try {
         const { data: token } = await axios.post(`${apiUrl}/fire-report-tokens/create`);
         const url = `${window.location.origin}/report?token=${token}`;
         setGeneratedUrl(url);
         console.log(url);
      } catch (error) {
         alert("❌ 신고 URL 생성 실패");
         console.error(error);
      }
   };

   const copyToClipboard = () => {
      if (generatedUrl) {
         navigator.clipboard.writeText(generatedUrl).then(() => {
            alert("URL이 클립보드에 복사되었습니다.");
         });
      }
   };

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

   return (
      <div className="p-4">
         <h2 className="text-2xl font-bold mb-4">📋 화재 신고 대시보드</h2>

         <div className="mb-4">
            <button
               onClick={generateReportUrl}
               className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
               신고 URL 생성
            </button>

            {generatedUrl && (
               <div className="mt-2">
                  <label className="block mb-1">생성된 URL</label>
                  <input
                     type="text"
                     readOnly
                     value={generatedUrl}
                     className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm border"
                  />
                  <button
                     onClick={copyToClipboard}
                     className="mt-1 px-3 py-2 text-xs text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                  >
                     복사
                  </button>
               </div>
            )}
         </div>

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