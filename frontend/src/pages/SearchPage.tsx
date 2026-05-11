import { useEffect, useState } from "react";

type Connection = {
    _id?: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    price: number;
    changes: number;
};

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

        let url = `http://localhost:3001/connections?from=${from}&to=${to}`;

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
        const res = await fetch("http://localhost:3001/stations");
        const data = await res.json();

        const names = data.map((station: any) => station.name);

        setStations(names);
    };

    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                padding: "40px",
                fontFamily: "Arial",
                color: "white",
                flex: 1
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    width: "100%",
                    margin: "0 auto"
                }}
            >
                <div style={{ marginBottom: "40px" }}>
                    <h1
                        style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: "52px",
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
                            fontSize: "18px",
                            margin: 0,
                            paddingTop: "10px"
                        }}
                    >
                        Wyszukuj połączenia kolejowe w całej Polsce
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "14px",
                        marginBottom: "35px",
                        backgroundColor: "#1e293b",
                        padding: "24px",
                        borderRadius: "24px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                        border: "1px solid #334155",
                        alignItems: "center"
                    }}
                >
                    <select
                        style={{
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid #334155",
                            flex: 1,
                            backgroundColor: "#0f172a",
                            color: "white",
                            fontSize: "15px",
                            outline: "none"
                        }}
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
                        style={{
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid #334155",
                            flex: 1,
                            backgroundColor: "#0f172a",
                            color: "white",
                            fontSize: "15px",
                            outline: "none"
                        }}
                        onChange={(e) => setTo(e.target.value)}
                    >
                        <option value="">Dokąd</option>

                        {stations.map((station) => (
                            <option key={station} value={station}>
                                {station}
                            </option>
                        ))}
                    </select>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            whiteSpace: "nowrap"
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

                    {!showAllDates && (
                        <input
                            style={{
                                padding: "14px",
                                borderRadius: "14px",
                                border: "1px solid #334155",
                                flex: 1,
                                backgroundColor: "#0f172a",
                                color: "white",
                                fontSize: "15px",
                                outline: "none"
                            }}
                            type="date"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    )}
                    <select
                        style={{
                            padding: "14px",
                            borderRadius: "14px",
                            border: "1px solid #334155",
                            flex: 1,
                            backgroundColor: "#0f172a",
                            color: "white",
                            fontSize: "15px",
                            outline: "none"
                        }}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sortuj</option>
                        <option value="price">Cena</option>
                        <option value="duration">Czas</option>
                    </select>

                    <button
                        style={{
                            padding: "14px 24px",
                            cursor: "pointer",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "14px",
                            fontWeight: "bold",
                            fontSize: "15px",
                            transition: "0.2s"
                        }}
                        onClick={handleSearch}
                    >
                        Szukaj
                    </button>
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
                <div>
                    {results.map((conn: Connection, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "16px",
                                padding: "20px",
                                marginBottom: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
                            }}
                        >
                            <div>
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
                                        fontSize: "28px"
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
                                    textAlign: "center",
                                    flex: 1
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
                                    textAlign: "right"
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "28px"
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
                </div>
            </div>
        </div>
    );
}

export default SearchPage;