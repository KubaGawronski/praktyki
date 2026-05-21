import { useEffect, useState } from "react";

import {
    pageContainerStyle,
    contentWrapperStyle,
    cardStyle,
    inputStyle,
    primaryButtonStyle
} from "../styles/commonStyles";

import { API_URL } from "../config/api";

function PdfPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [station, setStation] = useState("");
    const [stations, setStations] = useState<string[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const fetchStations = async () => {
        const res = await fetch(`${API_URL}/stations`);
        const data = await res.json();

        const names = data.map((station: any) => station.name);

        setStations(names);
    };

    const handleGeneratePdf = () => {
        if (!station) {
            setError("Wybierz stację!");
            return;
        }

        setError("");

    };

    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <div
            style={{
                ...pageContainerStyle,
                padding: isMobile ? "20px" : "40px"
            }}
        >
            <div style={contentWrapperStyle}>
                <div style={{ marginBottom: "40px" }}>
                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: isMobile ? "34px" : "48px",
                            marginBottom: "10px"
                        }}
                    >
                        Generator PDF 📄
                    </h1>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#94a3b8"
                        }}
                    >
                        Pobieraj rozkłady jazdy w formacie PDF
                    </p>
                </div>

                <div
                    style={{
                        ...cardStyle,
                        padding: "30px",
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : "2fr 1fr",
                        gap: "16px",
                        alignItems: "center"
                    }}
                >
                    <select
                        value={station}
                        style={inputStyle}
                        onChange={(e) => setStation(e.target.value)}
                    >
                        <option value="">
                            Wybierz stację
                        </option>

                        {stations.map((station) => (
                            <option
                                key={station}
                                value={station}
                            >
                                {station}
                            </option>
                        ))}
                    </select>

                    <button
                        style={{
                            ...primaryButtonStyle,
                            width: "100%"
                        }}
                        onClick={handleGeneratePdf}
                    >
                        Generuj PDF
                    </button>
                </div>
                {error && (
                    <p
                        style={{
                            color: "#ef4444",
                            marginTop: "16px",
                            textAlign: "center",
                            fontWeight: "bold"
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default PdfPage;