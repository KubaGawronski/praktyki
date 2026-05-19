import { useEffect, useState } from "react";

import {
    pageContainerStyle,
    contentWrapperStyle,
    cardStyle,
    inputStyle,
    primaryButtonStyle, dangerButtonStyle
} from "../styles/commonStyles";

import type { Connection } from "../types/Connection";

import { API_URL } from "../config/api";

import ConnectionMap from "../components/ConnectionMap";
import { cityCoordinates } from "../data/cityCoordinates";

function SearchPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [results, setResults] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [sort, setSort] = useState("");
    const [stations, setStations] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [showAllDates, setShowAllDates] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [favorites, setFavorites] = useState<Connection[]>([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleSearch = async () => {
        if (!from || !to || (!date && !showAllDates)) {
            setError("Uzupełnij wszystkie pola wyszukiwania!");
            return;
        }

        if (from === to) {
            setError("Miasto początkowe i końcowe nie mogą być takie same!");
            return;
        }

        setError("");
        setLoading(true);
        setSearched(true);
        setResults([]);

        let url = `${API_URL}/connections?from=${from}&to=${to}`;

    if (!showAllDates) {
        url += `&date=${date}`;
    }

if (sort) {
    url += `&sort=${sort}`;
}

const res = await fetch(url);
const data = await res.json();

setResults(data);
setLoading(false);
};

const fetchStations = async () => {
    const res = await fetch(`${API_URL}/stations`);
    const data = await res.json();

    const names = data.map((station: any) => station.name);

    setStations(names);
};

useEffect(() => {
    fetchStations();
}, []);

useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");

    if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
    }
}, []);

const addToFavorites = (connection: Connection) => {
    const alreadyExists = favorites.some(
        fav =>
            fav.from === connection.from &&
            fav.to === connection.to &&
            fav.date === connection.date &&
            fav.departureTime === connection.departureTime
        );

        if (alreadyExists) {
            return;
        }

        const updatedFavorites = [...favorites, connection];

        setFavorites(updatedFavorites);

        localStorage.setItem(
            "favorites",
            JSON.stringify(updatedFavorites)
        );
};

const removeFavorite = (connection: Connection) => {
    const updatedFavorites = favorites.filter(
        fav =>
            !(
                fav.from === connection.from &&
                fav.to === connection.to &&
                fav.date === connection.date &&
                fav.departureTime === connection.departureTime
            )
    );

    setFavorites(updatedFavorites);

    localStorage.setItem(
        "favorites",
        JSON.stringify(updatedFavorites)
    );
};

return (
    <div
        style={{
            ...pageContainerStyle,
            padding: isMobile ? "20px" : "40px"
        }}
    >
        <div
            style={contentWrapperStyle}
        >
            <div style={{ marginBottom: "40px" }}>
                <h1
                    style={{
                        textAlign: "center",
                        fontSize: isMobile ? "34px" : "52px",
                        marginBottom: "10px",
                        fontWeight: "bold"
                    }}
                >
                    Wyszukiwarka połączeń 🚆
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: isMobile ? "15px" : "18px",
                        margin: 0,
                        paddingTop: "10px"
                    }}
                >
                    Wyszukuj połączenia kolejowe w całej Polsce
                </p>
            </div>

            <div
                style={{
                    ...cardStyle,
                    display: "grid",
                    gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(5, 1fr)",
                    gap: "14px",
                    marginBottom: "35px",
                    padding: "24px"
                }}
            >
                <select
                    style={inputStyle}
                    onChange={(e) => setFrom(e.target.value)}
                >
                    <option value="">Skąd</option>

                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>

                <select
                    style={inputStyle}
                    onChange={(e) => setTo(e.target.value)}
                >
                    <option value="">Dokąd</option>

                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>

                {!showAllDates && (
                    <input
                        style={inputStyle}
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                    />
                )}

                <select
                    style={inputStyle}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sortuj</option>
                    <option value="price">Cena</option>
                    <option value="duration">Czas</option>
                </select>

                <button
                    style={{
                        ...primaryButtonStyle,
                        width: "100%"
                    }}
                    onClick={handleSearch}
                >
                    Szukaj
                </button>

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px"
                    }}
                >
                    <input
                        type="checkbox"
                        checked={showAllDates}
                        onChange={(e) => {
                            setShowAllDates(e.target.checked);

                            if (e.target.checked) {
                                setDate("");
                            }
                        }}
                    />

                    Wszystkie terminy
                </label>
            </div>

            {error && (
                <p
                    style={{
                        color: "#ef4444",
                        marginBottom: "20px",
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    {error}
                </p>
            )}

            {favorites.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ marginBottom: "20px" }}>
                        ❤️ Ulubione trasy
                    </h2>

                    {favorites.map((conn, index) => (
                        <div
                            key={index}
                            style={{
                                ...cardStyle,
                                padding: "20px",
                                marginBottom: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "20px",
                                flexDirection: isMobile ? "column" : "row"
                            }}
                        >
                            <div>
                                <h3 style={{ margin: 0 }}>
                                    {conn.from} → {conn.to}
                                </h3>

                                <p style={{ color: "#94a3b8", margin: "6px 0" }}>
                                    {new Date(conn.date).toLocaleDateString("pl-PL")}
                                </p>

                                <p style={{ margin: "6px 0" }}>
                                    {conn.departureTime} - {conn.arrivalTime}
                                </p>

                                <p style={{ margin: "6px 0" }}>
                                    {conn.changes === 0
                                        ? "Bez przesiadek"
                                        : `Przesiadki: ${conn.changes}`}
                                </p>

                                <h3 style={{ color: "#22c55e", margin: 0 }}>
                                    {conn.price} zł
                                </h3>
                            </div>

                            <button
                                style={dangerButtonStyle}
                                onClick={() => removeFavorite(conn)}
                            >
                                Usuń
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div>
                {results.map((conn: Connection, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: "#1e293b",
                            borderRadius: "16px",
                            padding: "20px",
                            marginBottom: "16px",
                            display: "grid",
                            gridTemplateColumns: isMobile
                                ? "1fr"
                                : "1fr 2fr 1fr",
                            gap: "20px",
                            alignItems: "center",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
                        }}
                    >
                        <div
                            style={{
                                textAlign: isMobile ? "center" : "left"
                            }}
                        >
                            <p
                                style={{
                                    color: "#94a3b8",
                                    marginBottom: "6px",
                                    fontSize: "14px"
                                }}
                            >
                                {new Date(conn.date).toLocaleDateString("pl-PL")}
                            </p>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: isMobile ? "24px" : "28px"
                                }}
                            >
                                {conn.departureTime}
                            </h2>

                            <p
                                style={{
                                    margin: "4px 0",
                                    color: "#94a3b8"
                                }}
                            >
                                {conn.from}
                            </p>
                        </div>

                        <div
                            style={{
                                textAlign: "center"
                            }}
                        >
                            <p
                                style={{
                                    color: "#94a3b8",
                                    marginBottom: "8px"
                                }}
                            >
                                {conn.duration} min
                            </p>

                            <div
                                style={{
                                    height: "2px",
                                    backgroundColor: "#334155",
                                    position: "relative",
                                    margin: "0 20px"
                                }}
                            >
                                <div
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        backgroundColor: "#2563eb",
                                        position: "absolute",
                                        top: "-5px",
                                        left: "50%"
                                    }}
                                />
                            </div>

                            <p
                                style={{
                                    marginTop: "8px",
                                    color: "#94a3b8"
                                }}
                            >
                                {conn.changes === 0
                                    ? "Bez przesiadek"
                                    : `Liczba przesiadek: ${conn.changes}`}
                            </p>
                        </div>

                        <div
                            style={{
                                textAlign: isMobile ? "center" : "right"
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: isMobile ? "24px" : "28px"
                                }}
                            >
                                {conn.arrivalTime}
                            </h2>

                            <p
                                style={{
                                    margin: "4px 0",
                                    color: "#94a3b8"
                                }}
                            >
                                {conn.to}
                            </p>

                            <h3
                                style={{
                                    color: "#22c55e",
                                    marginTop: "12px"
                                }}
                            >
                                {conn.price} zł
                            </h3>
                            <button
                                style={{
                                    ...primaryButtonStyle,
                                    marginTop: "10px",
                                    width: isMobile ? "100%" : "auto"
                                }}
                                onClick={() => addToFavorites(conn)}
                            >
                                ❤️ Zapisz
                            </button>
                        </div>
                    </div>
                ))}

                {loading && (
                    <p style={{ textAlign: "center" }}>
                        Ładowanie...
                    </p>
                )}

                {searched && !loading && results.length === 0 && (
                    <p style={{ textAlign: "center" }}>
                        Brak połączeń
                    </p>
                )}

                {results.length > 0 && (
                    <div>
                        <h2 style={{ marginBottom: "20px" }}>
                            🗺️ Trasa na mapie:
                        </h2>
                        <ConnectionMap
                            fromCoords={cityCoordinates[results[0].from]}
                            toCoords={cityCoordinates[results[0].to]}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
);
}

export default SearchPage;