import { useState } from "react";
import axios from "axios";
import { IoIosLink } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import Toast from "./Toast";

const dummyRecipients = [
   "010-1234-5678",
   "010-9876-5432",
   "010-5555-6666",
   "010-1111-2222",
];

export default function Topbar({ toggleSidebar }) {
   const [generatedUrl, setGeneratedUrl] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [toastVisible, setToastVisible] = useState(false);
   const [showRecipientList, setShowRecipientList] = useState(false);
   const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
   const apiUrl = import.meta.env.VITE_API_URL;

   const generateReportUrl = async () => {
      try {
         setIsLoading(true);
         const { data: token } = await axios.post(
            `${apiUrl}/fire-report-tokens/create`
         );
         const url = `${window.location.origin}/report?token=${token}`;
         setGeneratedUrl(url);
      } catch (error) {
         alert("❌ 신고 URL 생성 실패");
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   const copyToClipboard = () => {
      if (generatedUrl) {
         navigator.clipboard.writeText(generatedUrl).then(() => {
            setToastVisible(true);
         });
      }
   };

   // 수신번호 선택 함수
   const onSelectPhoneNumber = (phone) => {
      setSelectedPhoneNumber(phone);
      setShowRecipientList(false);
   };

   return (
      <>
         <header className="bg-white shadow p-4 pr-8 flex items-center justify-between border-b border-[#E4E7EC]">
            <button
               className="text-gray-800 text-xl focus:outline-none p-2 border border-[#E4E7EC] rounded-md"
               onClick={toggleSidebar}
            >
               {/* 햄버거 아이콘 */}
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M4 6h16M4 12h16M4 18h16"
                  />
               </svg>
            </button>

            {/* 신고 URL 생성 버튼 */}
            <button
               onClick={() => {
                  setShowModal(true);
                  setGeneratedUrl(""); // 팝업 열 때 URL 초기화
                  setSelectedPhoneNumber("");
                  setShowRecipientList(false);
               }}
               className="flex gap-2 items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
               <IoIosLink className="text-xl" />
               <span className="text-sm">신고 URL 생성</span>
            </button>
         </header>

         {/* 팝업 모달 */}
         {showModal && (
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-50">
               <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow-sm">
                     {/* 헤더 */}
                     <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                           신고 URL 생성
                        </h3>
                        <button
                           type="button"
                           onClick={() => setShowModal(false)}
                           className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg w-8 h-8 flex items-center justify-center"
                        >
                           <CgClose className="w-5 h-5" />
                        </button>
                     </div>

                     {/* 바디 */}
                     <div className="p-4 md:p-5">
                        {/* 수신번호 입력칸 추가 */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                           수신번호 (전화번호)
                        </label>
                        <input
                           type="text"
                           readOnly
                           value={selectedPhoneNumber}
                           placeholder="수신번호를 선택하세요"
                           className="w-full px-4 py-2 mb-2 bg-gray-100 border rounded text-sm text-black"
                        />

                        <button
                           type="button"
                           onClick={() => setShowRecipientList((prev) => !prev)}
                           className="mb-4 text-blue-600 underline hover:text-blue-800 text-sm"
                        >
                           {showRecipientList
                              ? "수신목록 닫기"
                              : "수신목록 보기"}
                        </button>

                        {/* 수신목록 리스트 */}
                        {showRecipientList && (
                           <div className="mb-4 max-h-32 overflow-y-auto border rounded bg-gray-50">
                              {dummyRecipients.map((phone, index) => (
                                 <button
                                    key={phone}
                                    onClick={() => onSelectPhoneNumber(phone)}
                                    className={`block w-full text-left px-4 py-2 hover:bg-blue-100 text-sm ${
                                       index === 0
                                          ? "text-blue-600 font-semibold"
                                          : "text-gray-700"
                                    }`}
                                 >
                                    {phone}
                                    {index === 0 && (
                                       <span className="ml-2 text-xs font-normal text-blue-500">
                                          (최근)
                                       </span>
                                    )}
                                 </button>
                              ))}
                           </div>
                        )}

                        <input
                           type="text"
                           readOnly
                           value={generatedUrl}
                           placeholder="아직 URL이 생성되지 않았습니다."
                           className="w-full px-4 py-2 mb-4 bg-gray-100 border rounded text-sm text-black"
                        />

                        <div className="flex justify-end gap-2">
                           {!generatedUrl && (
                              <button
                                 onClick={generateReportUrl}
                                 disabled={isLoading || !selectedPhoneNumber} // 수신번호 없으면 disabled
                                 className={`inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center
    ${
       isLoading || !selectedPhoneNumber
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white"
    }`}
                              >
                                 {isLoading ? (
                                    <>
                                       <svg
                                          aria-hidden="true"
                                          role="status"
                                          className="inline w-4 h-4 mr-3 text-white animate-spin"
                                          viewBox="0 0 100 101"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                       >
                                          <path
                                             d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                             fill="#E5E7EB"
                                          />
                                          <path
                                             d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5533C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                             fill="currentColor"
                                          />
                                       </svg>
                                       생성중...
                                    </>
                                 ) : (
                                    "URL 생성"
                                 )}
                              </button>
                           )}

                           {generatedUrl && (
                              <button
                                 onClick={() => {
                                    copyToClipboard();
                                    setShowModal(false);
                                 }}
                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                              >
                                 복사 후 닫기
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {toastVisible && (
            <Toast
               message="URL이 클립보드에 복사되었습니다."
               onClose={() => setToastVisible(false)}
            />
         )}
      </>
   );
}
