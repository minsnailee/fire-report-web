const STATUS_OPTIONS = [
    { value: "RECEIVED", label: "접수" },
    { value: "DISPATCHED", label: "출동" },
    { value: "ARRIVED", label: "도착" },
    { value: "INITIAL_SUPPRESSION", label: "초진" },
    { value: "OVERHAUL", label: "잔불정리" },
    { value: "FULLY_SUPPRESSED", label: "완진" },
    { value: "WITHDRAWN", label: "철수" },
    { value: "MONITORING", label: "잔불감시" },
];

function FireStatusControl({
    visible,
    toggleVisible,
    selectedStatus,
    handleStatusChange,
    handleSubmitStatus,
}) {
    return (
        <>
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded mt-3"
                onClick={toggleVisible}
            >
                상황 보고
            </button>
            {visible && (
                <div className="mt-2">
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">-- 상태 선택 --</option>
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                        onClick={handleSubmitStatus}
                    >
                        제출
                    </button>
                </div>
            )}
        </>
    );
}

export default FireStatusControl;
