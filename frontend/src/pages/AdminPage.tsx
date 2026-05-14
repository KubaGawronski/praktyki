import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
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

function AdminPage() {
    const [newConnection, setNewConnection] = useState({
        from: "",
        to: "",
        date: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        price: "",
        changes: ""
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [connections, setConnections] = useState<Connection[]>([]);
    const [stations, setStations] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const fetchConnections = async () => {
        const res = await fetch("http://localhost:3001/connections");
        const data = await res.json();

        setConnections(data);
    };

    const fetchStations = async () => {
        const res = await fetch("http://localhost:3001/stations");
        const data = await res.json();

        const names = data.map((station: any) => station.name);

        setStations(names);
    };



    useEffect(() => {
        fetchConnections();
        fetchStations();
    }, []);

    const handleEdit = (conn: Connection) => {
        setEditingId(conn._id || null);

        setNewConnection({
            from: conn.from,
            to: conn.to,
            date: conn.date,
            departureTime: conn.departureTime,
            arrivalTime: conn.arrivalTime,
            duration: String(conn.duration),
            price: String(conn.price),
            changes: String(conn.changes)
        });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                padding: isMobile ? "20px" : "40px",
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
                            fontSize: isMobile ? "34px" : "48px",
                            marginBottom: "10px"
                        }}
                    >
                        Panel administratora ⚙️
                    </h1>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#94a3b8"
                        }}
                    >
                        Zarządzaj połączeniami kolejowymi
                    </p>
                </div>

                <div
                    style={{
                        width: isMobile ? "100%" : "auto",
                        backgroundColor: "#1e293b",
                        borderRadius: "24px",
                        padding: "24px",
                        marginBottom: "40px",
                        border: "1px solid #334155",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "20px"
                        }}
                    >
                        Dodaj połączenie
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: "14px"
                        }}
                    >
                        <select
                            value={newConnection.from}
                            style={inputStyle}
                            onChange={(e) =>
                                setNewConnection({
                                    ...newConnection,
                                    from: e.target.value
                                })
                            }
                        >
                            <option value="">Skąd</option>

                            {stations.map((station) => (
                                <option key={station} value={station}>
                                    {station}
                                </option>
                            ))}
                        </select>

                        <select
                            value={newConnection.to}
                            style={inputStyle}
                            onChange={(e) =>
                                setNewConnection({
                                    ...newConnection,
                                    to: e.target.value
                                })
                            }
                        >
                            <option value="">Dokąd</option>

                            {stations.map((station) => (
                                <option key={station} value={station}>
                                    {station}
                                </option>
                            ))}
                        </select>

                        <input
                            value={newConnection.date}
                            type="date"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    date: e.target.value
                                })
                            }
                        />

                        <input
                            value={newConnection.departureTime}
                            type="time"
                            placeholder="Godzina odjazdu"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    departureTime: e.target.value
                                })
                            }
                        />

                        <input
                            value={newConnection.arrivalTime}
                            type="time"
                            placeholder="Godzina przyjazdu"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    arrivalTime: e.target.value
                                })
                            }
                        />

                        <input
                            value={newConnection.duration}
                            placeholder="Czas (min)"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    duration: e.target.value
                                })
                            }
                        />

                        <input
                            value={newConnection.price}
                            placeholder="Cena"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    price: e.target.value
                                })
                            }
                        />

                        <input
                            value={newConnection.changes}
                            placeholder="Przesiadki"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    changes: e.target.value
                                })
                            }
                        />
                    </div>

                    <button
                        style={{
                            marginTop: "20px",
                            padding: "14px 24px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "14px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "15px"
                        }}
                        onClick={async () => {

                            if (
                                !newConnection.from ||
                                !newConnection.to ||
                                !newConnection.date ||
                                !newConnection.departureTime ||
                                !newConnection.arrivalTime
                            ) {
                                setError("Uzupełnij wszystkie pola");
                                return;
                            }

                            if (newConnection.from === newConnection.to) {
                                setError("Miasto początkowe i końcowe nie mogą być takie same");
                                return;
                            }

                            if (newConnection.departureTime === newConnection.arrivalTime) {
                                setError("Godzina odjazdu i przyjazdu nie mogą być takie same");
                                return;
                            }

                            if (
                                Number(newConnection.duration) <= 0 ||
                                Number(newConnection.price) <= 0 ||
                                Number(newConnection.changes) < 0
                            ) {
                                setError("Wprowadź poprawne wartości liczbowe");
                                return;
                            }

                            setError("");

                            if (editingId) {
                                await fetch(
                                    `http://localhost:3001/connections/${editingId}`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(newConnection)
                                    }
                                );

                                setError("Pomyślnie zedytowano połączenie");
                            } else {
                                await fetch("http://localhost:3001/connections", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(newConnection)
                                });

                                setError("Pomyślnie dodano połączenie");
                            }

                            fetchConnections();

                            setEditingId(null);

                            setNewConnection({
                                from: "",
                                to: "",
                                date: "",
                                departureTime: "",
                                arrivalTime: "",
                                duration: "",
                                price: "",
                                changes: ""
                            });
                        }}
                    >
                        {editingId ? "Zapisz zmiany" : "Dodaj połączenie"}
                    </button>
                    {error && (
                        <p
                            style={{
                                marginTop: "14px",
                                color: error.includes("Pomyślnie")
                                    ? "#22c55e"
                                    : "#ef4444",
                                fontWeight: "bold"
                            }}
                        >
                            {error}
                        </p>
                    )}
                </div>

                <div>
                    <h2 style={{ marginBottom: "20px" }}>
                        Wszystkie połączenia
                    </h2>

                    {connections.map((conn) => (
                        <div
                            key={conn._id}
                            style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "18px",
                                padding: "20px",
                                marginBottom: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: isMobile ? "column" : "row",
                                alignItems: isMobile ? "flex-start" : "center",
                                gap: "16px",
                                boxShadow: "0 8px 20px rgba(0,0,0,0.25)"

                            }}
                        >
                            <h3>
                                {conn.from} → {conn.to}
                            </h3>

                            <p style={{ color: "#94a3b8"}}>
                                {new Date(conn.date).toLocaleDateString("pl-PL")}
                            </p>

                            <p style={{ margin: 0 }}>
                                {conn.departureTime} - {conn.arrivalTime}
                            </p>

                            <p style={{ margin: 0 }}>
                                Liczba przesiadek: {conn.changes}
                            </p>

                            <p style={{color: "#22c55e", fontWeight: "bold" }}>
                                {conn.price} zł
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: isMobile ? "column" : "row",
                                    gap: "10px",
                                    width: isMobile ? "100%" : "auto"
                                }}
                            >
                                <button
                                    style={{
                                        width: isMobile ? "100%" : "auto",
                                        backgroundColor: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "12px 18px",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => handleEdit(conn)}
                                >
                                    Edytuj
                                </button>

                                <button
                                    style={{
                                        width: isMobile ? "100%" : "auto",
                                        backgroundColor: "#dc2626",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "12px 18px",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                    onClick={async () => {
                                        const confirmDelete = window.confirm(
                                            "Czy na pewno chcesz usunąć to połączenie?"
                                        );

                                        if (!confirmDelete) return;

                                        await fetch(
                                            `http://localhost:3001/connections/${conn._id}`,
                                            {
                                                method: "DELETE"
                                            }
                                        );

                                        fetchConnections();

                                        setError("Pomyślnie usunięto połączenie");
                                    }}
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const inputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "15px",
    outline: "none"
};

export default AdminPage;