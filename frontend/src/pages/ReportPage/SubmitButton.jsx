function SubmitButton({ handleSubmit }) {
   return (
      <button
         onClick={handleSubmit}
         className="tracking-wider px-6 py-3 text-white rounded-xl text-xl font-hakgyoansim bg-gradient-to-br from-blue-500 to-indigo-600"
      >
         신고 위치 전송하기
      </button>
   );
}

export default SubmitButton;
