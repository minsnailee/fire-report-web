import { NavLink } from "react-router-dom";
import { FaHome, FaLink, FaFireExtinguisher } from "react-icons/fa";

const menuItems = [
   { name: "홈", path: "/", icon: <FaHome /> },
   { name: "URL 생성 목록", path: "/urls", icon: <FaLink /> },
   { name: "출동지시 목록", path: "/dispatches", icon: <FaFireExtinguisher /> },
];

export default function Sidebar({ isOpen }) {
   return (
      <div
         className={`bg-[#172B4C] text-white transition-all duration-300 ease-in-out ${
            isOpen ? "w-64" : "w-16"
         } h-screen fixed left-0 top-0 z-20 flex flex-col`}
      >
         <div className="flex items-center justify-center h-16 font-bold text-lg border-b border-blue-800">
            {isOpen ? "관제센터" : ""}
         </div>
         <nav className="flex-1 p-2 space-y-2">
            {menuItems.map((item) => (
               <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                     `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                        isActive ? "bg-blue-800 font-bold" : ""
                     }`
                  }
               >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
               </NavLink>
            ))}
         </nav>
      </div>
   );
}
