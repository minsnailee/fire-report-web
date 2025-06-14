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

export default function ReportTable({ reports, onSelect }) {
   return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
         <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
               신고 목록
            </h3>
         </div>
         <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
               <div className="max-w-full overflow-x-auto">
                  <table className="min-w-full text-sm">
                     <thead className="border-b border-gray-100 dark:border-white/[0.05] bg-neutral-50 dark:bg-white/[0.01]">
                        <tr>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              ID
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              신고자 위도
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              신고자 경도
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              신고자 주소
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              화재 위도
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              화재 경도
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              화재 주소
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              시간
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              상태
                           </th>
                           <th className="px-6 py-4 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                              상세보기
                           </th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {reports.map((report) => (
                           <tr key={report.id}>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.id}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.reporterLat.toFixed(4)}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.reporterLng.toFixed(4)}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.reporterAddress || "-"}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.fireLat.toFixed(4)}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.fireLng.toFixed(4)}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {report.fireAddress || "-"}
                              </td>
                              <td className="px-6 py-4 text-gray-700 dark:text-white/90">
                                 {new Date(report.reportedAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs
                    ${
                       report.status === "active"
                          ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                          : report.status === "pending"
                          ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400"
                          : report.status === "cancel"
                          ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-white/[0.08] dark:text-white/80"
                    }
                  `}
                                 >
                                    {translateStatus(report.status)}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <button
                                    onClick={() => onSelect(report)}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
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
