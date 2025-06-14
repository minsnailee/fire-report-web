import { useState } from "react";
import { TbMenu3 } from "react-icons/tb";
import axios from "axios";
import { FaLink } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdAddLink } from "react-icons/md";
import { IoIosLink } from "react-icons/io";

export default function Topbar({ toggleSidebar }) {
   const [generatedUrl, setGeneratedUrl] = useState("");
   const [showModal, setShowModal] = useState(false);
   const apiUrl = import.meta.env.VITE_API_URL;

   const generateReportUrl = async () => {
      try {
         const { data: token } = await axios.post(
            `${apiUrl}/fire-report-tokens/create`
         );
         const url = `${window.location.origin}/report?token=${token}`;
         setGeneratedUrl(url);
         setShowModal(true); // 모달 열기
      } catch (error) {
         alert("❌ 신고 URL 생성 실패");
         console.error(error);
      }
   };

   const copyToClipboard = () => {
      if (generatedUrl) {
         navigator.clipboard.writeText(generatedUrl).then(() => {
            alert("📋 URL이 클립보드에 복사되었습니다.");
         });
      }
   };

   return (
      <>
         <header className="bg-white shadow p-4 pr-8 flex items-center justify-between border-b border-[#E4E7EC]">
            <button
               className="text-gray-800 text-xl focus:outline-none p-2 border border-[#E4E7EC] rounded-md"
               onClick={toggleSidebar}
            >
               <CgMenuLeftAlt />
            </button>

            <button
               onClick={generateReportUrl}
               className="flex gap-2 items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
               <IoIosLink className="text-xl" />
               <span className="text-sm">신고 URL 생성</span>
            </button>
         </header>

         {/* ✅ 팝업 모달 */}
         {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                  <h2 className="text-lg font-semibold mb-3">
                     ✅ 신고 URL 생성됨
                  </h2>
                  <input
                     type="text"
                     readOnly
                     value={generatedUrl}
                     className="w-full px-4 py-2 mb-3 bg-gray-100 border rounded text-sm"
                  />
                  <div className="flex justify-end gap-2">
                     <button
                        onClick={() => {
                           copyToClipboard();
                           setShowModal(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                     >
                        복사 후 닫기
                     </button>
                     <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
                     >
                        닫기
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}
