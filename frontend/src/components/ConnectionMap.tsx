import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline
} from "react-leaflet";

type Props = {
    fromCoords: [number, number];
    toCoords: [number, number];
};

function ConnectionMap({ fromCoords, toCoords }: Props) {
    return (
        <MapContainer
            center={fromCoords}
            zoom={6}
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "20px",
                marginTop: "30px"
            }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={fromCoords} />
            <Marker position={toCoords} />

            <Polyline
                positions={[fromCoords, toCoords]}
            />
        </MapContainer>
    );
}

export default ConnectionMap;