import React from "react";
import {
   FaUsers,
   FaFire,
   FaCheckCircle,
   FaClipboardList,
} from "react-icons/fa";
import StatsCard from "./StatsCard";

export default function StatsCards() {
   // 예시 데이터
   const stats = [
      {
         icon: <FaUsers className="w-6 h-6" />,
         title: "접수",
         value: 123,
         bgColor: "from-blue-600 to-blue-400 shadow-blue-500/40",
      },
      {
         icon: <FaFire className="w-6 h-6" />,
         title: "출동",
         value: 23,
      },
      {
         icon: <FaCheckCircle className="w-6 h-6" />,
         title: "완료",
         value: 1234,
      },
      {
         icon: <FaClipboardList className="w-6 h-6" />,
         title: "오늘 신고",
         value: "267",
      },
   ];

   return (
      <div className="flex gap-6">
         {stats.map((stat) => (
            <div key={stat.title} className="flex-1">
               <StatsCard {...stat} />
            </div>
         ))}
      </div>
   );
}
