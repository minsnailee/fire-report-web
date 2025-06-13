export default function FireStationList({ fireLat, fireLng, stations, reportToken, onDispatch }) {
   const getSortedStations = () => {
      const R = 6371;
      return stations.map((s) => {
         const dLat = (s.latitude - fireLat) * (Math.PI / 180);
         const dLng = (s.longitude - fireLng) * (Math.PI / 180);
         const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(fireLat * (Math.PI / 180)) *
               Math.cos(s.latitude * (Math.PI / 180)) *
               Math.sin(dLng / 2) ** 2;
         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
         const distance = R * c;
         return { ...s, distance };
      }).sort((a, b) => a.distance - b.distance);
   };

   return (
      <div>
         <h4 className="text-lg font-semibold mt-4 mb-2">🚒 가까운 소방서 목록</h4>
         <table className="min-w-full text-left text-sm border">
            <thead>
               <tr>
                  <th className="px-4 py-2">센터명</th>
                  <th className="px-4 py-2">주소</th>
                  <th className="px-4 py-2">전화번호</th>
                  <th className="px-4 py-2">거리 (km)</th>
                  <th className="px-4 py-2">출동 지시</th>
               </tr>
            </thead>
            <tbody>
               {getSortedStations().slice(0, 5).map((s) => (
                  <tr key={s.id} className="border-t">
                     <td className="px-4 py-2">{s.centerName}</td>
                     <td className="px-4 py-2">{s.address}</td>
                     <td className="px-4 py-2">{s.phone}</td>
                     <td className="px-4 py-2">{s.distance.toFixed(2)}</td>
                     <td className="px-4 py-2">
                        <button
                           className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                           onClick={() => onDispatch(reportToken, s.id)}
                        >
                           출동 지시
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
