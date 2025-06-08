import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage() {
   const [reports, setReports] = useState([]);
   const [selectedReport, setSelectedReport] = useState(null);
   const [generatedUrl, setGeneratedUrl] = useState("");
   const [fireStations, setFireStations] = useState([]);
   const apiUrl = import.meta.env.VITE_API_URL;

   useEffect(() => {
      const fetchReports = async () => {
         try {
            const response = await axios.get(`${apiUrl}/fire-reports`);
            setReports(response.data);
         } catch (error) {
            console.error("❌ 신고 목록 불러오기 실패", error);
         }
      };

      const fetchFireStations = async () => {
         try {
            const response = await axios.get(`${apiUrl}/fire-stations`);
            setFireStations(response.data);
         } catch (error) {
            console.error("❌ 소방서 정보 불러오기 실패", error);
         }
      };

      fetchReports();
      fetchFireStations();
   }, [apiUrl]);

   const generateReportUrl = async () => {
      try {
         const response = await axios.post(
            `${apiUrl}/fire-report-tokens/create`
         );
         const token = response.data;
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
         const response = await axios.patch(
            `${apiUrl}/fire-reports/${id}/dispatch`
         );
         const token = response.data;
         const firefighterUrl = `${window.location.origin}/firefighter?token=${token}`;
         alert(`🚒 소방관 URL 생성됨:\n${firefighterUrl}`);
         setReports((prev) =>
            prev.map((r) =>
               r.id === id ? { ...r, status: "dispatched", token } : r
            )
         );
      } catch (error) {
         alert("❌ 출동 지시 실패");
         console.error(error);
      }
   };

   function translateStatus(status) {
      switch (status?.toLowerCase()) {
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
            return "신고 접수됨";
      }
   }

   function getSortedStationsByDistance(fireLat, fireLng) {
      const R = 6371; // 지구 반지름 (km)
      return fireStations
         .map((station) => {
            const dLat = (station.latitude - fireLat) * (Math.PI / 180);
            const dLng = (station.longitude - fireLng) * (Math.PI / 180);
            const a =
               Math.sin(dLat / 2) ** 2 +
               Math.cos(fireLat * (Math.PI / 180)) *
                  Math.cos(station.latitude * (Math.PI / 180)) *
                  Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return { ...station, distance };
         })
         .sort((a, b) => a.distance - b.distance);
   }

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

         <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
               <tr>
                  <th scope="col" className="px-6 py-4">
                     ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                     신고자 위도
                  </th>
                  <th scope="col" className="px-6 py-4">
                     신고자 경도
                  </th>
                  <th scope="col" className="px-6 py-4">
                     신고자 주소
                  </th>
                  <th scope="col" className="px-6 py-4">
                     화재 위도
                  </th>
                  <th scope="col" className="px-6 py-4">
                     화재 경도
                  </th>
                  <th scope="col" className="px-6 py-4">
                     화재 주소
                  </th>
                  <th scope="col" className="px-6 py-4">
                     시간
                  </th>
                  <th scope="col" className="px-6 py-4">
                     상태
                  </th>
                  <th scope="col" className="px-6 py-4">
                     상세보기
                  </th>
                  <th scope="col" className="px-6 py-4">
                     출동지시
                  </th>
               </tr>
            </thead>
            <tbody>
               {reports.map((report) => (
                  <tr
                     key={report.id}
                     className="border-b dark:border-neutral-500"
                  >
                     <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {report.id}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.reporterLat.toFixed(4)}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.reporterLng.toFixed(4)}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.reporterAddress || "-"}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.fireLat.toFixed(4)}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.fireLng.toFixed(4)}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {report.fireAddress || "-"}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {new Date(report.reportedAt).toLocaleString()}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        {translateStatus(report.status)}
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        <button
                           className="text-blue-600 hover:underline"
                           onClick={() => setSelectedReport(report)}
                        >
                           상세보기
                        </button>
                     </td>
                     <td className="whitespace-nowrap px-6 py-4">
                        <button
                           className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                           onClick={() => handleDispatch(report.id)}
                        >
                           {report.status?.toLowerCase() === "dispatched"
                              ? "재전송"
                              : "출동 지시"}
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {selectedReport && (
            <div className="mt-8">
               <h3 className="text-xl font-semibold mb-2">
                  🗺️ 신고 위치 지도 보기 (ID: {selectedReport.id})
               </h3>
               <p>
                  🔑 <strong>토큰 :</strong>
                  <code>{selectedReport.token ?? "없음"}</code>
               </p>
               <MapPreview
                  reporterLat={selectedReport.reporterLat}
                  reporterLng={selectedReport.reporterLng}
                  fireLat={selectedReport.fireLat}
                  fireLng={selectedReport.fireLng}
               />

               {/* 가까운 소방서 목록 */}
               <h4 className="text-lg font-semibold mt-4 mb-2">
                  🚒 가까운 소방서 목록
               </h4>
               <table className="min-w-full text-left text-sm border">
                  <thead className="bg-gray-100">
                     <tr>
                        <th className="px-4 py-2">센터명</th>
                        <th className="px-4 py-2">주소</th>
                        <th className="px-4 py-2">전화번호</th>
                        <th className="px-4 py-2">거리 (km)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {getSortedStationsByDistance(
                        selectedReport.fireLat,
                        selectedReport.fireLng
                     )
                        .slice(0, 5)
                        .map((station) => (
                           <tr key={station.id} className="border-t">
                              <td className="px-4 py-2">
                                 {station.centerName}
                              </td>
                              <td className="px-4 py-2">{station.address}</td>
                              <td className="px-4 py-2">{station.phone}</td>
                              <td className="px-4 py-2">
                                 {station.distance.toFixed(2)}
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
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

            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(fireLat, fireLng),
               title: "🔥 화재 위치",
            });

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
