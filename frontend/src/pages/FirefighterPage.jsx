import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function FirefighterPage() {
   const [searchParams] = useSearchParams();
   const token = searchParams.get("token");
   const [report, setReport] = useState(null); // 신고 정보
   const [hydrants, setHydrants] = useState([]); // 전체 소화전 목록
   const apiUrl = import.meta.env.VITE_API_URL;

   // 신고 데이터 요청
   useEffect(() => {
      if (!token) return;
      axios
         .get(`${apiUrl}/fire-reports/by-token/${token}`)
         .then((res) => setReport(res.data))
         .catch((err) => console.error("❌ 신고 데이터 불러오기 실패", err));
   }, [token]);

   // 소화전 데이터 가져오기
   useEffect(() => {
      axios
         .get(`${apiUrl}/hydrants`)
         .then((res) => setHydrants(res.data))
         .catch((err) => console.error("❌ 소화전 데이터 불러오기 실패", err));
   }, []);

   // 콘솔 로그로 데이터 상태 확인
   useEffect(() => {
      console.log("🔥 report 데이터:", report);
   }, [report]);

   useEffect(() => {
      console.log("🚰 hydrants 데이터 개수:", hydrants.length);
   }, [hydrants]);

   // 거리 계산 함수 (Haversine 공식, m 단위)
   const getDistance = (lat1, lng1, lat2, lng2) => {
      const toRad = (deg) => (deg * Math.PI) / 180;
      const R = 6371e3; // 지구 반지름 (미터)
      const deltaLat = toRad(lat2 - lat1);
      const deltaLng = toRad(lng2 - lng1);
      const a =
         Math.sin(deltaLat / 2) ** 2 +
         Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(deltaLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
   };

   // 카카오맵 렌더링
   useEffect(() => {
      if (!report || hydrants.length === 0) return;

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
         import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;

      script.onload = () => {
         window.kakao.maps.load(() => {
            const container = document.getElementById("firefighter-map");

            const map = new window.kakao.maps.Map(container, {
               center: new window.kakao.maps.LatLng(
                  report.fireLat,
                  report.fireLng
               ),
               level: 3,
            });

            // 🔥 화재 위치 마커
            new window.kakao.maps.Marker({
               map,
               position: new window.kakao.maps.LatLng(
                  report.fireLat,
                  report.fireLng
               ),
               title: "🔥 화재 위치",
            });

            // 🧍‍♂️ 신고자 위치 마커
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

            // 📍 소화전 마커 표시
            hydrants.forEach((hydrant) => {
               const distance = getDistance(
                  report.fireLat,
                  report.fireLng,
                  hydrant.lat,
                  hydrant.lng
               );

               if (distance <= 500) {
                  new window.kakao.maps.Marker({
                     map,
                     position: new window.kakao.maps.LatLng(
                        hydrant.lat,
                        hydrant.lng
                     ),
                     title: `소화전\n${hydrant.address || ""}`,
                     image: new window.kakao.maps.MarkerImage(
                        "data:image/svg+xml;base64," +
                           btoa(`
                     <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'>
                        <circle cx='6' cy='6' r='6' fill='blue'/>
                     </svg>`),
                        new window.kakao.maps.Size(12, 12),
                        { offset: new window.kakao.maps.Point(4, 4) }
                     ),
                  });
               }
            });
         });
      };

      document.head.appendChild(script);
      return () => {
         document.head.removeChild(script);
      };
   }, [report, hydrants]);

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
