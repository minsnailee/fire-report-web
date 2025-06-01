import { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

function FireMap() {
   const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
   const apiUrl = import.meta.env.VITE_API_URL;

   const mapRef = useRef(null);
   const [map, setMap] = useState(null);
   const [reporterPos, setReporterPos] = useState(null);
   const [centerPos, setCenterPos] = useState(null);
   const [accuracyInfo, setAccuracyInfo] = useState("");
   const [token, setToken] = useState("");
   const [reporterAddress, setReporterAddress] = useState("");
   const [kakaoReady, setKakaoReady] = useState(false);
   // 1. URL 쿼리에서 token 파싱 및 검증
   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token") || "";
      setToken(tokenFromUrl);

      if (tokenFromUrl) {
         axios
            .get(`${apiUrl}/fire-report-tokens/validate/${tokenFromUrl}`)
            .then((res) => {
               if (!res.data) {
                  alert("유효하지 않은 신고 URL입니다.");
               }
            })
            .catch(() => {
               alert("신고 URL 검증 중 오류 발생");
            });
      } else {
         alert("신고 URL에 토큰이 없습니다.");
      }
   }, [apiUrl]);

   // 2. 카카오맵 초기화
   useEffect(() => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
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

            window.kakao.maps.event.addListener(
               kakaoMap,
               "center_changed",
               () => {
                  const center = kakaoMap.getCenter();
                  setCenterPos(center);
               }
            );

            setKakaoReady(true); // 카카오맵 완전히 준비됨 표시
         });
      };

      script.onerror = () => {
         console.error("카카오맵 스크립트 로딩 실패");
      };

      document.head.appendChild(script);

      // cleanup: 스크립트 제거
      return () => {
         document.head.removeChild(script);
      };
   }, [KAKAO_MAP_KEY]);

   // 3. 신고자 현재 위치 가져오기
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

   // 4. 위치 새로고침
   const refreshLocation = () => {
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

   // 주소 조회 코드
   useEffect(() => {
      if (!reporterPos) return;
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
         console.warn("카카오 지도 서비스가 준비되지 않았습니다.");
         return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(
         reporterPos.getLng(),
         reporterPos.getLat(),
         (result, status) => {
            if (import.meta.env.MODE === "development") {
               console.log("주소 조회 결과:", result, status);
            }
            if (status === window.kakao.maps.services.Status.OK) {
               const address =
                  result[0]?.address?.address_name || "주소 정보 없음";
               setAccuracyInfo((prev) => prev + ` / 주소: ${address}`);
               setReporterAddress(address);
            } else {
               setAccuracyInfo((prev) => prev + " / 주소 정보 조회 실패");
               setReporterAddress("");
            }
         }
      );
   }, [reporterPos]);

   // 신고처리 (token을 reportedId 필드로 보냄)
   const handleSubmit = async () => {
      if (!map || !reporterPos || !centerPos) {
         alert("지도와 위치 정보를 모두 확인해주세요.");
         return;
      }

      if (!token) {
         alert("유효하지 않은 신고 URL입니다.");
         return;
      }

      const payload = {
         reportedId: token, // URL 토큰을 reportedId로 사용
         lat: centerPos.getLat(),
         lng: centerPos.getLng(),
         address: reporterAddress || "주소 미입력",
         status: "REPORTED",
         reportedAt: dayjs().format("YYYY-MM-DD[T]HH:mm:ss"),
         dispatchedAt: null,
         resolvedAt: null,
      };

      // **디버깅용 로그 추가 (주석 해제 및 보강)**
      // console.log("🔥 [전송 직전] payload:", payload);
      // console.log("🔑 [전송 직전] token (reportedId):", token);
      // console.log(
      //    "🧍‍♂️ 신고자 위치 (reporterPos):",
      //    reporterPos?.getLat(),
      //    reporterPos?.getLng()
      // );
      // console.log(
      //    "🔥 화재 위치 (centerPos):",
      //    centerPos?.getLat(),
      //    centerPos?.getLng()
      // );
      console.log("reportedId가 제대로 있는지 확인", JSON.stringify(payload));

      try {
         const response = await axios.post(`${apiUrl}/fire-reports`, payload);

         console.log("✅ 서버 응답:", response.data);
         alert("신고 위치가 전송되었습니다!");
      } catch (error) {
         console.error(
            "❌ 신고 전송 실패:",
            error.response?.data || error.message
         );
         alert("신고 전송에 실패했습니다.");
      }

      // if (import.meta.env.MODE === "development") {
      //    console.log(
      //       "🚨 신고자 위치:",
      //       reporterPos.getLat(),
      //       reporterPos.getLng()
      //    );
      //    console.log("🔥 화재 위치:", centerPos.getLat(), centerPos.getLng());
      //    console.log("🔑 reportedId (token):", token);
      //    console.log("전송 payload:", payload);
      // }
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

export default FireMap;
