function SubmitButton({ handleSubmit }) {
    return (
        <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
            🚨 위치 전송
        </button>
    );
}

export default SubmitButton;
