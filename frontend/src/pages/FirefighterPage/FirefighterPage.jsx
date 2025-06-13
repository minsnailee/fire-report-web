import { useSearchParams } from "react-router-dom";
import useFireDispatch from "./hooks/useFireDispatch";
import FireInfoPanel from "./FireInfoPanel";
import FireMapView from "./FireMapView";
import FireStatusControl from "./FireStatusControl";

function FirefighterPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const fireStationId = searchParams.get("fireStationId");

    const {
        report,
        fireStation,
        hydrants,
        mapContainerId,
        statusSelectVisible,
        toggleStatusSelect,
        selectedStatus,
        handleStatusChange,
        handleSubmitStatus,
    } = useFireDispatch(token, fireStationId);

    if (!token) return <p>❗ token 파라미터가 없습니다.</p>;
    if (!fireStationId) return <p>❗ fireStationId 파라미터가 없습니다.</p>;

    if (report === undefined || fireStation === undefined)
        return <p>데이터 불러오는 중...</p>;
    if (report === null) return <p>❌ 신고 데이터를 불러오지 못했습니다.</p>;
    if (fireStation === null)
        return <p>❌ 소방서 데이터를 불러오지 못했습니다.</p>;
    if (!hydrants.length) return <p>❌ 소화전 데이터를 불러오지 못했습니다.</p>;

    return (
        <div>
            <h2>🚒 소방관 출동 화면</h2>

            <FireInfoPanel report={report} fireStation={fireStation} />

            <FireMapView mapContainerId={mapContainerId} />

            <p className="mt-4">
                🔥 화재 상태: <strong>{report.status}</strong>
            </p>

            <FireStatusControl
                visible={statusSelectVisible}
                toggleVisible={toggleStatusSelect}
                selectedStatus={selectedStatus}
                handleStatusChange={handleStatusChange}
                handleSubmitStatus={handleSubmitStatus}
            />
        </div>
    );
}

export default FirefighterPage;
