import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
   const [reports, setReports] = useState([]);
   const [selectedReport, setSelectedReport] = useState(null);
   const [generatedUrl, setGeneratedUrl] = useState("");

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
   }, [apiUrl]);

   // 신고 URL 생성 함수
   const generateReportUrl = async () => {
      try {
         // 서버에서 토큰 생성 및 저장
         const response = await axios.post(
            `${apiUrl}/fire-report-tokens/create`
         );
         const token = response.data; // 서버가 { token: "..." } 형태로 반환한다고 가정

         // 현재 사이트 주소 기준 신고 URL 생성
         const url = `${window.location.origin}/report?token=${token}`;
         setGeneratedUrl(url);
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

   const handleDispatch = async (id) => {
      try {
         await axios.patch(`${apiUrl}/reports/${id}/dispatch`);
         alert("🚓 출동 지시 완료");
         setReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "dispatched" } : r))
         );
      } catch (error) {
         alert("❌ 출동 지시 실패");
         console.error(error);
      }
   };

   return (
      <div style={{ padding: "1rem" }}>
         <h2>📋 화재 신고 대시보드</h2>

         {/* 신고 URL 생성 및 복사 */}
         <div style={{ marginBottom: "1rem" }}>
            <button onClick={generateReportUrl}>신고 URL 생성 및 공유</button>
            {generatedUrl && (
               <div style={{ marginTop: "0.5rem" }}>
                  <input
                     type="text"
                     readOnly
                     value={generatedUrl}
                     style={{ width: "400px" }}
                  />
                  <button onClick={copyToClipboard}>복사</button>
               </div>
            )}
         </div>

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
                  <th>신고자 주소</th>
                  <th>화재 위도</th>
                  <th>화재 경도</th>
                  <th>화재 주소</th>
                  <th>시간</th>
                  <th>상태</th>
                  <th>상세보기</th>
                  <th>출동지시</th>
               </tr>
            </thead>
            <tbody>
               {reports.map((report) => (
                  <tr key={report.id}>
                     <td>{report.id}</td>
                     <td>{report.reporterLat.toFixed(4)}</td>
                     <td>{report.reporterLng.toFixed(4)}</td>
                     <td>{report.reporterAddress || "-"}</td>
                     <td>{report.fireLat.toFixed(4)}</td>
                     <td>{report.fireLng.toFixed(4)}</td>
                     <td>{report.fireAddress || "-"}</td>
                     <td>{new Date(report.reportedAt).toLocaleString()}</td>
                     <td>{translateStatus(report.status)}</td>
                     <td>
                        <button onClick={() => setSelectedReport(report)}>
                           상세보기
                        </button>
                     </td>
                     <td>
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
                  reporterLat={selectedReport.reporterLat}
                  reporterLng={selectedReport.reporterLng}
                  fireLat={selectedReport.fireLat}
                  fireLng={selectedReport.fireLng}
               />
            </div>
         )}
      </div>
   );

   // 상태 enum 한글 변환 함수 예시
   function translateStatus(status) {
      switch (status) {
         case "reported":
            return "신고 접수됨";
         case "dispatched":
            return "출동 지시됨";
         case "en_route":
            return "진입 중";
         case "suppressing":
            return "진압 중";
         case "additional_support":
            return "추가 지원 요청됨";
         case "suppression_completed":
            return "진압 완료";
         case "site_recovery":
            return "현장 복구 중";
         case "resolved":
            return "종료";
         default:
            return "대기중";
      }
   }
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
