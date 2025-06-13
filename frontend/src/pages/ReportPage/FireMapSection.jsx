import useFireMap from "./hooks/useFireMap";
import LocationInfo from "./LocationInfo";
import SubmitButton from "./SubmitButton";

function FireMapSection() {
    const {
        reporterPos,
        firePos,
        fireAddress,
        reporterAddress,
        accuracyInfo,
        refreshLocation,
        handleSubmit,
    } = useFireMap();

    return (
        <div>
            <div id="map" className="w-full h-[70vh] border relative"></div>

            <LocationInfo
                reporterPos={reporterPos}
                accuracyInfo={accuracyInfo}
                refreshLocation={refreshLocation}
                firePos={firePos}
                fireAddress={fireAddress}
            />

            <SubmitButton handleSubmit={handleSubmit} />
        </div>
    );
}

export default FireMapSection;
