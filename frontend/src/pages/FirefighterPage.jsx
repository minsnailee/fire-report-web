import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function FirefighterPage() {
   const [searchParams] = useSearchParams();
   const token = searchParams.get("token");
   const [report, setReport] = useState(null);
   const apiUrl = import.meta.env.VITE_API_URL;

   useEffect(() => {
      if (!token) return;

      // 토큰으로 신고 상세 정보 요청
      axios
         .get(`${apiUrl}/fire-reports/by-token/${token}`)
         .then((res) => setReport(res.data))
         .catch((err) => console.error("❌ 신고 데이터 불러오기 실패", err));
   }, [token]);

   useEffect(() => {
      if (!report) return;

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
         import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;
      script.onload = () => {
         window.kakao.maps.load(() => {
            const container = document.getElementById("firefighter-map");
            const options = {
               center: new window.kakao.maps.LatLng(
                  report.fireLat,
                  report.fireLng
               ),
               level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            // 화재 위치 마커
            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(
                  report.fireLat,
                  report.fireLng
               ),
               title: "🔥 화재 위치",
            });

            // 신고자 위치 마커
            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(
                  report.reporterLat,
                  report.reporterLng
               ),
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

      // cleanup: 스크립트 제거 (선택 사항)
      return () => {
         document.head.removeChild(script);
      };
   }, [report]);

   if (!report) return <p>데이터 불러오는 중...</p>;

   return (
      <div>
         <h2>🚒 소방관 출동 화면</h2>
         <p>
            신고자 위치: {report.reporterLat.toFixed(6)},{" "}
            {report.reporterLng.toFixed(6)} <br />
            신고자 주소: {report.reporterAddress || "-"}
         </p>
         <p>
            화재 위치: {report.fireLat.toFixed(6)}, {report.fireLng.toFixed(6)}{" "}
            <br />
            화재 주소: {report.fireAddress || "-"}
         </p>

         <div
            id="firefighter-map"
            style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
         ></div>

         <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => alert("상황 보고 기능은 추후 구현 예정")}
         >
            상황 보고
         </button>
      </div>
   );
}

export default FirefighterPage;
