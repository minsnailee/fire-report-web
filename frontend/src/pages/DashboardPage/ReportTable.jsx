function translateStatus(status) {
   switch (status?.toLowerCase()) {
      case "reported": return "신고 접수됨";
      case "dispatched": return "출동 지시됨";
      case "en_route": return "진입 중";
      case "suppressing": return "진압 중";
      case "additional_support": return "추가 지원 요청됨";
      case "suppression_completed": return "진압 완료";
      case "site_recovery": return "현장 복구 중";
      case "resolved": return "종료";
      default: return "신고 접수됨";
   }
}

export default function ReportTable({ reports, onSelect }) {
   return (
      <table className="min-w-full text-left text-sm font-light">
         <thead className="border-b bg-neutral-50 font-medium">
            <tr>
               <th className="px-6 py-4">ID</th>
               <th className="px-6 py-4">신고자 위도</th>
               <th className="px-6 py-4">신고자 경도</th>
               <th className="px-6 py-4">신고자 주소</th>
               <th className="px-6 py-4">화재 위도</th>
               <th className="px-6 py-4">화재 경도</th>
               <th className="px-6 py-4">화재 주소</th>
               <th className="px-6 py-4">시간</th>
               <th className="px-6 py-4">상태</th>
               <th className="px-6 py-4">상세보기</th>
            </tr>
         </thead>
         <tbody>
            {reports.map((report) => (
               <tr key={report.id} className="border-b">
                  <td className="px-6 py-4">{report.id}</td>
                  <td className="px-6 py-4">{report.reporterLat.toFixed(4)}</td>
                  <td className="px-6 py-4">{report.reporterLng.toFixed(4)}</td>
                  <td className="px-6 py-4">{report.reporterAddress || "-"}</td>
                  <td className="px-6 py-4">{report.fireLat.toFixed(4)}</td>
                  <td className="px-6 py-4">{report.fireLng.toFixed(4)}</td>
                  <td className="px-6 py-4">{report.fireAddress || "-"}</td>
                  <td className="px-6 py-4">
                     {new Date(report.reportedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{translateStatus(report.status)}</td>
                  <td className="px-6 py-4">
                     <button
                        className="text-blue-600 hover:underline"
                        onClick={() => onSelect(report)}
                     >
                        상세보기
                     </button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   );
}
