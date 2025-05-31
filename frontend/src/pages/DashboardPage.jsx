import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
   const [reports, setReports] = useState([]);
   const [selectedReport, setSelectedReport] = useState(null);

   const apiUrl = import.meta.env.VITE_API_URL;

   useEffect(() => {
      // 신고 목록 불러오기
      const fetchReports = async () => {
         try {
            const response = await axios.get(`${apiUrl}/reports`);
            setReports(response.data);
         } catch (error) {
            console.error("❌ 신고 목록 불러오기 실패", error);
         }
      };

      fetchReports();
   }, []);

   const handleDispatch = async (id) => {
      try {
         await axios.patch(`${apiUrl}/reports/${id}/dispatch`);
         alert("🚓 출동 지시 완료");
         setReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "출동지시됨" } : r))
         );
      } catch (error) {
         alert("❌ 출동 지시 실패");
         console.error(error);
      }
   };
   return (
      <div style={{ padding: "1rem" }}>
         <h2>📋 화재 신고 대시보드</h2>

         <table
            border="1"
            style={{
               width: "100%",
               marginTop: "1rem",
               borderCollapse: "collapse",
            }}
         >
            <thead>
               <tr>
                  <th>ID</th>
                  <th>신고자 위도</th>
                  <th>신고자 경도</th>
                  <th>화재 위도</th>
                  <th>화재 경도</th>
                  <th>시간</th>
                  <th>출동지시</th>
                  <th>상세보기</th>
               </tr>
            </thead>
            <tbody>
               {reports.map((report) => (
                  <tr key={report.id}>
                     <td>{report.id}</td>
                     <td>
                        {report.reporterLatitude.toFixed(4)},{" "}
                        {report.reporterLongitude.toFixed(4)}
                     </td>
                     <td>
                        {report.fireLatitude.toFixed(4)},{" "}
                        {report.fireLongitude.toFixed(4)}
                     </td>
                     <td>{new Date(report.timestamp).toLocaleString()}</td>
                     <td>{report.status || "대기중"}</td>
                     <td>
                        <button onClick={() => setSelectedReport(report)}>
                           상세보기
                        </button>{" "}
                        <button onClick={() => handleDispatch(report.id)}>
                           출동지시
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {selectedReport && (
            <div style={{ marginTop: "2rem" }}>
               <h3>🗺️ 신고 위치 지도 보기 (ID: {selectedReport.id})</h3>
               <MapPreview
                  reporterLat={selectedReport.reporterLatitude}
                  reporterLng={selectedReport.reporterLongitude}
                  fireLat={selectedReport.fireLatitude}
                  fireLng={selectedReport.fireLongitude}
               />
            </div>
         )}
      </div>
   );
}

function MapPreview({ reporterLat, reporterLng, fireLat, fireLng }) {
   useEffect(() => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
         import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;
      script.onload = () => {
         window.kakao.maps.load(() => {
            const container = document.getElementById("map-preview");
            const options = {
               center: new window.kakao.maps.LatLng(fireLat, fireLng),
               level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            // 화재 마커 (중앙)
            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(fireLat, fireLng),
               title: "🔥 화재 위치",
            });

            // 신고자 마커
            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(reporterLat, reporterLng),
               title: "🧍‍♂️ 신고자 위치",
               image: new window.kakao.maps.MarkerImage(
                  "data:image/svg+xml;base64," +
                     btoa(`
            <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'>
              <circle cx='6' cy='6' r='6' fill='lime'/>
            </svg>`),
                  new window.kakao.maps.Size(12, 12),
                  { offset: new window.kakao.maps.Point(6, 6) }
               ),
            });
         });
      };
      document.head.appendChild(script);
   }, [reporterLat, reporterLng, fireLat, fireLng]);

   return (
      <div
         id="map-preview"
         style={{ width: "100%", height: "300px", border: "1px solid #ccc" }}
      ></div>
   );
}

export default DashboardPage;
