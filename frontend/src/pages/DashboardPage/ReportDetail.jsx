import MapPreview from "./MapPreview";
import FireStationList from "./FireStationList";

export default function ReportDetail({ report, fireStations, onDispatch }) {
   return (
      <div className="mt-8">
         <h3 className="text-xl font-semibold mb-2">
            🗺️ 신고 위치 지도 보기 (ID: {report.id})
         </h3>
         <p>
            🔑 <strong>토큰 :</strong> <code>{report.token ?? "없음"}</code>
         </p>
         <MapPreview
            reporterLat={report.reporterLat}
            reporterLng={report.reporterLng}
            fireLat={report.fireLat}
            fireLng={report.fireLng}
         />
         <FireStationList
            fireLat={report.fireLat}
            fireLng={report.fireLng}
            stations={fireStations}
            reportToken={report.token}
            onDispatch={onDispatch}
         />
      </div>
   );
}