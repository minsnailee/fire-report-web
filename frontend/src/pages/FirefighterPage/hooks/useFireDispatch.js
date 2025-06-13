import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function useFireDispatch(token, fireStationId) {
    const [searchParams] = useSearchParams();
    const dispatchId = searchParams.get("dispatchId");

    const apiUrl = import.meta.env.VITE_API_URL;
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    const kakaoRestKey = import.meta.env.VITE_KAKAO_MAP_REST_KEY;

    const [report, setReport] = useState(undefined);
    const [fireStation, setFireStation] = useState(undefined);
    const [hydrants, setHydrants] = useState([]);
    const [mapContainerId] = useState("firefighter-map");
    const [polyline, setPolyline] = useState(null);

    const [statusSelectVisible, setStatusSelectVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const toggleStatusSelect = () => setStatusSelectVisible((v) => !v);
    const handleStatusChange = (e) => setSelectedStatus(e.target.value);

    const handleSubmitStatus = () => {
        if (!selectedStatus || !dispatchId)
            return alert("상태와 Dispatch ID를 확인하세요.");

        axios
            .put(`${apiUrl}/fire-dispatches/${dispatchId}/status`, null, {
                params: { status: selectedStatus },
            })
            .then((res) => {
                alert("상태 업데이트 완료");
                setReport(res.data);
            })
            .catch(() => alert("상태 업데이트 실패"));
    };

    const getDistance = (lat1, lng1, lat2, lng2) => {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const R = 6371e3;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        if (!token) return;
        axios
            .get(`${apiUrl}/fire-reports/by-token/${token}`)
            .then((res) => setReport(res.data))
            .catch(() => setReport(null));
    }, [token]);

    useEffect(() => {
        if (!fireStationId) return;
        axios
            .get(`${apiUrl}/fire-stations/${fireStationId}`)
            .then((res) => setFireStation(res.data))
            .catch(() => setFireStation(null));
    }, [fireStationId]);

    useEffect(() => {
        axios
            .get(`${apiUrl}/hydrants`)
            .then((res) => setHydrants(res.data))
            .catch(() => setHydrants([]));
    }, []);

    useEffect(() => {
        if (!report || !fireStation || !hydrants.length) return;

        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(async () => {
                const mapInstance = new kakao.maps.Map(
                    document.getElementById(mapContainerId),
                    {
                        center: new kakao.maps.LatLng(
                            report.fireLat,
                            report.fireLng
                        ),
                        level: 3,
                    }
                );

                mapInstance.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

                const createMarker = (lat, lng, color, size = 12) =>
                    new kakao.maps.Marker({
                        map: mapInstance,
                        position: new kakao.maps.LatLng(lat, lng),
                        image: new kakao.maps.MarkerImage(
                            "data:image/svg+xml;base64," +
                                btoa(
                                    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${
                                        size / 2
                                    }' cy='${size / 2}' r='${
                                        size / 2
                                    }' fill='${color}' /></svg>`
                                ),
                            new kakao.maps.Size(size, size),
                            { offset: new kakao.maps.Point(size / 2, size / 2) }
                        ),
                    });

                createMarker(report.fireLat, report.fireLng, "orange", 16);
                createMarker(
                    report.reporterLat,
                    report.reporterLng,
                    "lime",
                    12
                );
                createMarker(
                    fireStation.latitude,
                    fireStation.longitude,
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

                nearbyHydrants.forEach((h) =>
                    createMarker(h.lat, h.lng, "#28f5ff", 12)
                );

                const routeUrl = `https://apis-navi.kakaomobility.com/v1/directions`;
                const closest = nearbyHydrants.reduce((a, b) =>
                    getDistance(
                        fireStation.latitude,
                        fireStation.longitude,
                        a.lat,
                        a.lng
                    ) <
                    getDistance(
                        fireStation.latitude,
                        fireStation.longitude,
                        b.lat,
                        b.lng
                    )
                        ? a
                        : b
                );

                const params = new URLSearchParams({
                    origin: `${fireStation.longitude},${fireStation.latitude}`,
                    destination: `${report.fireLng},${report.fireLat}`,
                    waypoints: `${closest.lng},${closest.lat}`,
                    priority: "RECOMMEND",
                });

                const res = await axios.get(
                    `${routeUrl}?${params.toString()}`,
                    {
                        headers: { Authorization: `KakaoAK ${kakaoRestKey}` },
                    }
                );

                const linePath = [];
                res.data.routes?.[0]?.sections?.forEach((sec) =>
                    sec.roads.forEach((road) => {
                        const v = road.vertexes;
                        for (let i = 0; i < v.length; i += 2)
                            linePath.push(
                                new kakao.maps.LatLng(v[i + 1], v[i])
                            );
                    })
                );

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
            });
        };

        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
            if (polyline) polyline.setMap(null);
        };
    }, [report, fireStation, hydrants]);

    return {
        report,
        fireStation,
        hydrants,
        mapContainerId,
        statusSelectVisible,
        toggleStatusSelect,
        selectedStatus,
        handleStatusChange,
        handleSubmitStatus,
    };
}
