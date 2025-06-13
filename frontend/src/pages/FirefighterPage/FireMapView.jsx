function FireMapView({ mapContainerId = "firefighter-map" }) {
    return (
        <div
            id={mapContainerId}
            style={{
                width: "100%",
                height: "400px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        ></div>
    );
}

export default FireMapView;
