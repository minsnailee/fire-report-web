function translateStatus(status) {
   switch (status) {
      case "RECEIVED":
         return "신고 접수됨";
      case "DISPATCHED":
         return "출동 지시됨";
      case "ARRIVED":
         return "현장 도착";
      case "INITIAL_SUPPRESSION":
         return "초기 진압";
      case "OVERHAUL":
         return "잔불 정리";
      case "FULLY_SUPPRESSED":
         return "완전 진압";
      case "WITHDRAWN":
         return "철수";
      case "MONITORING":
         return "잔불 감시";
      default:
         return "신고 접수됨";
   }
}

function getStatusBadgeColor(status) {
   switch (status) {
      case "RECEIVED":
         return "bg-gray-100 text-gray-600";
      case "DISPATCHED":
         return "bg-blue-100 text-blue-600";
      case "ARRIVED":
         return "bg-indigo-100 text-indigo-600";
      case "INITIAL_SUPPRESSION":
         return "bg-orange-100 text-orange-600";
      case "OVERHAUL":
         return "bg-yellow-100 text-yellow-600";
      case "FULLY_SUPPRESSED":
         return "bg-green-100 text-green-600";
      case "WITHDRAWN":
         return "bg-red-100 text-red-600";
      case "MONITORING":
         return "bg-purple-100 text-purple-600";
      default:
         return "bg-gray-100 text-gray-600";
   }
}

export default function ReportTable({ reports, onSelect }) {
   return (
      <div className="rounded-2xl border border-gray-200 bg-white">
         <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800">신고 목록</h3>
         </div>
         <div className="p-4 border-t border-gray-100 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
               <div className="max-w-full overflow-x-auto">
                  <table className="min-w-full text-sm">
                     <thead className="border-b border-gray-100 bg-neutral-50">
                        <tr>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              ID
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              신고자 주소
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              신고자 위도
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              신고자 경도
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-900 bg-red-50">
                              화재 주소
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-900 bg-red-50">
                              화재 위도
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-900 bg-red-50">
                              화재 경도
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              시간
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              상태
                           </th>
                           <th className="px-6 py-4 text-center text-xs font-medium text-gray-500">
                              상세보기
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {reports.map((report) => (
                           <tr key={report.id}>
                              <td className="text-center px-6 py-4 text-gray-700">
                                 {report.id}
                              </td>
                              <td className="text-center px-6 py-4 text-gray-700">
                                 {report.reporterAddress}
                              </td>
                              <td className="text-center px-6 py-4 text-gray-700">
                                 {report.reporterLat.toFixed(4)}
                              </td>
                              <td className="text-center px-6 py-4 text-gray-700">
                                 {report.reporterLng.toFixed(4)}
                              </td>
                              <td className="text-center px-6 py-4 bg-red-100 text-red-800">
                                 {report.fireAddress}
                              </td>
                              <td className="text-center px-6 py-4 bg-red-100 text-red-800">
                                 {report.fireLat.toFixed(4)}
                              </td>
                              <td className="text-center px-6 py-4 bg-red-100 text-red-800">
                                 {report.fireLng.toFixed(4)}
                              </td>
                              <td className="text-center px-6 py-4 text-gray-700">
                                 {new Date(report.reportedAt).toLocaleString()}
                              </td>
                              <td className="text-center px-6 py-4">
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs ${getStatusBadgeColor(
                                       report.status
                                    )}`}
                                 >
                                    {translateStatus(report.status)}
                                 </span>
                              </td>
                              <td className="text-center px-6 py-4">
                                 <button
                                    onClick={() => onSelect(report)}
                                    className="text-blue-600 hover:underline"
                                 >
                                    보기
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
}
