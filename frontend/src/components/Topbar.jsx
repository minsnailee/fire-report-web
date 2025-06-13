import { FaBars } from "react-icons/fa";

export default function Topbar({ toggleSidebar }) {
   return (
      <header className="bg-white shadow p-4 flex items-center">
         <button
            className="text-gray-800 text-xl focus:outline-none mr-4"
            onClick={toggleSidebar}
         >
            <FaBars />
         </button>
         <h1 className="text-lg font-semibold text-gray-800">대시보드</h1>
      </header>
   );
}
