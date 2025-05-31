import { useEffect, useRef, useState } from "react";
import axios from "axios";

function MapPage() {
   const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
   const mapRef = useRef(null);
   const [map, setMap] = useState(null);
   const [reporterPos, setReporterPos] = useState(null);
   const [centerPos, setCenterPos] = useState(null);
   const [accuracyInfo, setAccuracyInfo] = useState("");

   // 카카오맵 초기화
   useEffect(() => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
         window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
               center: new window.kakao.maps.LatLng(37.5665, 126.978),
               level: 1,
            };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            mapRef.current = kakaoMap;
            setMap(kakaoMap);

            // 중심 좌표 변경 시 상태 업데이트
            window.kakao.maps.event.addListener(
               kakaoMap,
               "center_changed",
               () => {
                  const center = kakaoMap.getCenter();
                  setCenterPos(center);
               }
            );
         });
      };

      script.onerror = () => {
         console.error("카카오맵 스크립트 로딩 실패");
      };

      document.head.appendChild(script);
   }, []);

   // 신고자 현재 위치 가져오기
   useEffect(() => {
      if (!map) return;

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const pos = new window.kakao.maps.LatLng(lat, lng);

            map.setCenter(pos);
            setReporterPos(pos);
            setAccuracyInfo(
               `위치 정확도: 약 ${Math.round(position.coords.accuracy)}m`
            );

            // 신고자 위치 마커 추가
            // new window.kakao.maps.Marker({
            //    map: map,
            //    position: pos,
            //    title: "신고자 위치",
            // });
            new window.kakao.maps.Marker({
               map: map,
               position: pos,
               title: "신고자 위치",
               image: new window.kakao.maps.MarkerImage(
                  "data:image/svg+xml;base64," +
                     btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
        <circle cx="6" cy="6" r="6" fill="lime" />
      </svg>
    `),
                  new window.kakao.maps.Size(12, 12),
                  { offset: new window.kakao.maps.Point(6, 6) }
               ),
            });
         },
         () => {
            alert("위치 정보를 가져올 수 없습니다.");
         }
      );
   }, [map]);

   // 위치 새로고침
   const refreshLocation = async () => {
      if (!navigator.geolocation) {
         alert("브라우저가 위치 정보를 지원하지 않습니다.");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const pos = new window.kakao.maps.LatLng(
               position.coords.latitude,
               position.coords.longitude
            );
            map.setCenter(pos);
            setReporterPos(pos);
            setAccuracyInfo(
               `위치 정확도: 약 ${Math.round(position.coords.accuracy)}m`
            );

            // 새 마커 추가 (기존 마커 삭제는 필요 시 추가)
            new window.kakao.maps.Marker({
               map: map,
               position: pos,
               title: "신고자 위치",
            });
         },
         () => {
            alert("위치 정보를 다시 가져올 수 없습니다.");
         }
      );
   };

   // 신고처리
   const handleSubmit = async () => {
      if (!map || !reporterPos || !centerPos) return;

      const payload = {
         reporterLatitude: reporterPos.getLat(),
         reporterLongitude: reporterPos.getLng(),
         fireLatitude: centerPos.getLat(),
         fireLongitude: centerPos.getLng(),
         timestamp: new Date().toISOString(),
      };

      try {
         const apiUrl = import.meta.env.VITE_API_URL;
         const response = await axios.post(`${apiUrl}/reports`, payload);

         console.log("✅ 서버 응답:", response.data);
         alert("신고 위치가 전송되었습니다!");
      } catch (error) {
         console.error("❌ 신고 전송 실패:", error);
         alert("신고 전송에 실패했습니다.");
      }

      if (import.meta.env.MODE === "development") {
         console.log(
            "🚨 신고자 위치:",
            reporterPos.getLat(),
            reporterPos.getLng()
         );
         console.log("🔥 화재 위치:", centerPos.getLat(), centerPos.getLng());
      }

      // console.log(
      //    "🚨 신고자 위치:",
      //    reporterPos.getLat(),
      //    reporterPos.getLng()
      // );
      // console.log("🔥 화재 위치:", centerPos.getLat(), centerPos.getLng());
   };
   return (
      <div style={{ padding: "1rem", position: "relative" }}>
         <h2>📍 화재 신고 위치 선택</h2>

         {/* 지도 */}
         <div
            id="map"
            style={{
               width: "100%",
               height: "400px",
               position: "relative",
               border: "1px solid #ccc",
            }}
         ></div>

         {/* 🔴 고정된 마커 (화재 위치) */}
         <div
            style={{
               position: "absolute",
               top: "calc(200px + 40px)",
               left: "50%",
               transform: "translate(-50%, -100%)",
               zIndex: 10,
               pointerEvents: "none",
            }}
         >
            {/* <img
               src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"
               alt="fire-marker"
            /> */}
            <img
               src={`data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <circle cx="7" cy="7" r="7" fill="orange" />
    </svg>
  `)}`}
               alt="fire-marker"
            />
         </div>

         {/* 신고자 위치 정보 */}
         <div style={{ marginTop: "1rem" }}>
            <p>🧍‍♂️ 신고자 위치 (GPS)</p>
            {reporterPos && (
               <p style={{ fontSize: "0.9em" }}>
                  위도: {reporterPos.getLat().toFixed(6)} / 경도:{" "}
                  {reporterPos.getLng().toFixed(6)}
               </p>
            )}
            {accuracyInfo && (
               <p style={{ fontSize: "0.9em", color: "gray" }}>
                  {accuracyInfo}
               </p>
            )}
            <button onClick={refreshLocation}>🔄 위치 새로고침</button>
         </div>

         {/* 화재 위치 정보 */}
         <div style={{ marginTop: "1rem" }}>
            <p>🔥 화재 발생 위치 (지도 중심)</p>
            {centerPos && (
               <p style={{ fontSize: "0.9em" }}>
                  위도: {centerPos.getLat().toFixed(6)} / 경도:{" "}
                  {centerPos.getLng().toFixed(6)}
               </p>
            )}
            <p style={{ fontSize: "0.9em", color: "#666" }}>
               👉 지도를 움직여 화재 위치를 조정하세요.
            </p>
         </div>

         {/* 신고 버튼 */}
         <button
            onClick={handleSubmit}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
         >
            🚨 위치 전송
         </button>
      </div>
   );
}

export default MapPage;
