function FireInfoPanel({ report, fireStation }) {
    return (
        <div>
            <p>
                신고자 위치:
                {report.reporterLat != null
                    ? `${report.reporterLat.toFixed(
                          6
                      )}, ${report.reporterLng.toFixed(6)}`
                    : "정보 없음"}
                <br />
                신고자 주소: {report.reporterAddress || "-"}
            </p>
            <p>
                화재 위치:
                {report.fireLat != null
                    ? `${report.fireLat.toFixed(6)}, ${report.fireLng.toFixed(
                          6
                      )}`
                    : "정보 없음"}
                <br />
                화재 주소: {report.fireAddress || "-"}
            </p>
            <p>
                소방서 위치:
                {fireStation.latitude != null
                    ? `${fireStation.latitude.toFixed(
                          6
                      )}, ${fireStation.longitude.toFixed(6)}`
                    : "정보 없음"}
                <br />
                소방서 주소: {fireStation.address || "-"}
                <br />
                소방서 이름: {fireStation.centerName || "-"}
            </p>
        </div>
    );
}

export default FireInfoPanel;
