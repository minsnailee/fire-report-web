function LocationInfo({
    reporterPos,
    accuracyInfo,
    refreshLocation,
    firePos,
    fireAddress,
}) {
    return (
        <>
            <div className="mt-4">
                <p>🧍‍♂️ 신고자 위치 (GPS)</p>
                {reporterPos && (
                    <p className="text-sm">
                        위도: {reporterPos.getLat().toFixed(6)} / 경도:
                        {reporterPos.getLng().toFixed(6)}
                    </p>
                )}
                {accuracyInfo && (
                    <p className="text-sm text-gray-500">{accuracyInfo}</p>
                )}
                <button
                    onClick={refreshLocation}
                    className="px-4 py-2 mt-2 border rounded-lg text-sm border-gray-500 hover:opacity-60"
                >
                    위치 새로고침
                </button>
            </div>

            <div className="mt-4">
                <p>🔥 화재 발생 위치 (지도 중심)</p>
                {firePos && (
                    <p className="text-sm">
                        위도: {firePos.getLat().toFixed(6)} / 경도:
                        {firePos.getLng().toFixed(6)}
                    </p>
                )}
                {fireAddress && (
                    <p className="text-sm text-gray-600">주소: {fireAddress}</p>
                )}
                <p className="text-sm text-gray-600">
                    👉 지도를 움직여 화재 위치를 조정하세요.
                </p>
            </div>
        </>
    );
}

export default LocationInfo;
