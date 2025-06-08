import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function FirefighterPage() {
   const [searchParams] = useSearchParams();
   const token = searchParams.get("token");
   const fireStationId = searchParams.get("fireStationId");

   const apiUrl = import.meta.env.VITE_API_URL;
   const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
   const kakaoRestKey = import.meta.env.VITE_KAKAO_MAP_REST_KEY;

   const [report, setReport] = useState(null);
   const [hydrants, setHydrants] = useState([]);
   const [fireStation, setFireStation] = useState(null);
   const [map, setMap] = useState(null);
   const [polyline, setPolyline] = useState(null);

   const getDistance = (lat1, lng1, lat2, lng2) => {
      const toRad = (deg) => (deg * Math.PI) / 180;
      const R = 6371e3;
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

   useEffect(() => {
      if (!token) return;
      axios
         .get(`${apiUrl}/fire-reports/by-token/${token}`)
         .then((res) => setReport(res.data))
         .catch((err) => console.error("❌ 신고 데이터 불러오기 실패", err));
   }, [token]);

   useEffect(() => {
      if (!fireStationId) return;
      axios
         .get(`${apiUrl}/fire-stations/${fireStationId}`)
         .then((res) => setFireStation(res.data))
         .catch((err) => console.error("❌ 소방서 정보 불러오기 실패", err));
   }, [fireStationId]);

   useEffect(() => {
      axios
         .get(`${apiUrl}/hydrants`)
         .then((res) => setHydrants(res.data))
         .catch((err) => console.error("❌ 소화전 데이터 불러오기 실패", err));
   }, []);

   useEffect(() => {
      if (!report || !fireStation || hydrants.length === 0) return;

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
      script.async = true;

      script.onload = () => {
         window.kakao.maps.load(async () => {
            const container = document.getElementById("firefighter-map");
            const kakao = window.kakao;

            const mapInstance = new kakao.maps.Map(container, {
               center: new kakao.maps.LatLng(report.fireLat, report.fireLng),
               level: 3,
            });
            setMap(mapInstance);
            mapInstance.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

            const bounds = new kakao.maps.LatLngBounds();
            bounds.extend(
               new kakao.maps.LatLng(report.fireLat, report.fireLng)
            );
            bounds.extend(
               new kakao.maps.LatLng(report.reporterLat, report.reporterLng)
            );
            bounds.extend(
               new kakao.maps.LatLng(
                  fireStation.latitude,
                  fireStation.longitude
               )
            );
            mapInstance.setBounds(bounds);

            const createMarker = (lat, lng, title, color, size = 12) => {
               return new kakao.maps.Marker({
                  map: mapInstance,
                  position: new kakao.maps.LatLng(lat, lng),
                  title,
                  image: new kakao.maps.MarkerImage(
                     "data:image/svg+xml;base64," +
                        btoa(`
                           <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
                              <circle cx='${size / 2}' cy='${size / 2}' r='${
                           size / 2
                        }' fill='${color}' />
                           </svg>
                        `),
                     new kakao.maps.Size(size, size),
                     { offset: new kakao.maps.Point(size / 2, size / 2) }
                  ),
               });
            };

            createMarker(
               report.fireLat,
               report.fireLng,
               "🔥 화재 위치",
               "orange",
               16
            );
            createMarker(
               report.reporterLat,
               report.reporterLng,
               "🧍‍♂️ 신고자 위치",
               "lime",
               12
            );
            createMarker(
               fireStation.latitude,
               fireStation.longitude,
               "🚒 소방서 위치",
               "red",
               14
            );

            const nearbyHydrants = hydrants.filter((h) => {
               const dist = getDistance(
                  report.fireLat,
                  report.fireLng,
                  h.lat,
                  h.lng
               );
               return dist <= 500;
            });

            nearbyHydrants.forEach((hydrant) => {
               createMarker(
                  hydrant.lat,
                  hydrant.lng,
                  `소화전\n${hydrant.address || ""}`,
                  "#28f5ff",
                  12
               );
            });

            async function fetchRoute() {
               if (nearbyHydrants.length === 0) {
                  console.warn("반경 500m 이내 소화전이 없습니다.");
                  return;
               }

               let closestHydrant = nearbyHydrants[0];
               let minDist = getDistance(
                  fireStation.latitude,
                  fireStation.longitude,
                  closestHydrant.lat,
                  closestHydrant.lng
               );

               nearbyHydrants.forEach((h) => {
                  const dist = getDistance(
                     fireStation.latitude,
                     fireStation.longitude,
                     h.lat,
                     h.lng
                  );
                  if (dist < minDist) {
                     minDist = dist;
                     closestHydrant = h;
                  }
               });

               try {
                  const params = new URLSearchParams({
                     origin: `${fireStation.longitude},${fireStation.latitude}`,
                     destination: `${report.fireLng},${report.fireLat}`,
                     waypoints: `${closestHydrant.lng},${closestHydrant.lat}`,
                     priority: "RECOMMEND",
                  });

                  const url = `https://apis-navi.kakaomobility.com/v1/directions?${params.toString()}`;

                  const res = await axios.get(url, {
                     headers: {
                        Authorization: `KakaoAK ${kakaoRestKey}`,
                     },
                  });

                  if (!res.data.routes?.length) {
                     console.error("경로가 없습니다.");
                     return;
                  }

                  // const linePath = [];
                  // const roads = res.data.routes[0].sections[0].roads;
                  // roads.forEach((road) => {
                  //    const vtx = road.vertexes;
                  //    for (let i = 0; i < vtx.length; i += 2) {
                  //       const lng = vtx[i];
                  //       const lat = vtx[i + 1];
                  //       linePath.push(new kakao.maps.LatLng(lat, lng));
                  //    }
                  // });

                  // 경로 polyline 그리기 개선
                  const linePath = [];

                  res.data.routes[0].sections.forEach((section) => {
                     section.roads.forEach((road) => {
                        // 너무 짧은 선 생략 (옵션)
                        if (road.distance < 5) return;

                        const vtx = road.vertexes;
                        for (let i = 0; i < vtx.length; i += 2) {
                           const lng = vtx[i];
                           const lat = vtx[i + 1];
                           linePath.push(new kakao.maps.LatLng(lat, lng));
                        }
                     });
                  });

                  if (polyline) polyline.setMap(null);

                  const newPolyline = new kakao.maps.Polyline({
                     path: linePath,
                     strokeWeight: 5,
                     strokeColor: "#FF0000",
                     strokeOpacity: 0.7,
                     strokeStyle: "solid",
                  });

                  newPolyline.setMap(mapInstance);
                  setPolyline(newPolyline);
               } catch (err) {
                  console.error("🚨 경로 탐색 API 호출 실패", err);
               }
            }

            fetchRoute();
         });
      };

      document.head.appendChild(script);

      return () => {
         document.head.removeChild(script);
         if (polyline) polyline.setMap(null);
         setPolyline(null);
         setMap(null);
      };
   }, [report, fireStation, hydrants]);

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
         {fireStation && (
            <p>
               소방서 위치: {fireStation.latitude.toFixed(6)},{" "}
               {fireStation.longitude.toFixed(6)} <br />
               소방서 주소: {fireStation.address} <br />
               소방서 이름: {fireStation.centerName || "-"}
            </p>
         )}
         <div
            id="firefighter-map"
            style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
         ></div>

         <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => alert("상황 보고 기능은 추후 구현 예정")}
         >
            상황 보고하기
         </button>
      </div>
   );
}

export default FirefighterPage;
