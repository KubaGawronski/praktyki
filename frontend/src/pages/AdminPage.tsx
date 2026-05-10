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

function AdminPage() {
    const [newConnection, setNewConnection] = useState({
        from: "",
        to: "",
        date: "",
        departureTime: "",
        arrivalTime: "",
        duration: 0,
        price: 0,
        changes: 0
    });

    const [connections, setConnections] = useState<Connection[]>([]);

    const fetchConnections = async () => {
        const res = await fetch("http://localhost:3001/connections");
        const data = await res.json();

        setConnections(data);
    };
    const [stations, setStations] = useState<string[]>([]);
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

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0f172a",
                padding: "40px",
                fontFamily: "Arial",
                color: "white"
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <div style={{ marginBottom: "40px" }}>
                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: "48px",
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
                            gridTemplateColumns: "1fr 1fr",
                            gap: "14px"
                        }}
                    >
                        <select
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
                            placeholder="Czas (min)"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    duration: Number(e.target.value)
                                })
                            }
                        />

                        <input
                            placeholder="Cena"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    price: Number(e.target.value)
                                })
                            }
                        />

                        <input
                            placeholder="Przesiadki"
                            type="number"
                            style={inputStyle}
                            onChange={e =>
                                setNewConnection({
                                    ...newConnection,
                                    changes: Number(e.target.value)
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
                            await fetch("http://localhost:3001/connections", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(newConnection)
                            });

                            alert("Dodano połączenie!");

                            fetchConnections();
                        }}
                    >
                        Dodaj połączenie
                    </button>
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
                                alignItems: "center",
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

                            <p style={{color: "#22c55e", fontWeight: "bold" }}>
                                {conn.price} zł
                            </p>

                            <button
                                style={{
                                    backgroundColor: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "12px 18px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                                onClick={async () => {
                                    await fetch(
                                        `http://localhost:3001/connections/${conn._id}`,
                                        {
                                            method: "DELETE"
                                        }
                                    );

                                    fetchConnections();
                                }}
                            >
                                Usuń
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "15px",
    outline: "none"
};

export default AdminPage;