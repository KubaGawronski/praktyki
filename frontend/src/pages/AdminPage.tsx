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

    useEffect(() => {
        fetchConnections();
    }, []);
    return (
        <div>
            <h2>Dodaj połączenie</h2>

            <input placeholder="Skąd" onChange={e => setNewConnection({...newConnection, from: e.target.value})} />
            <input placeholder="Dokąd" onChange={e => setNewConnection({...newConnection, to: e.target.value})} />
            <input type="date" onChange={e => setNewConnection({...newConnection, date: e.target.value})} />
            <input placeholder="Godzina odjazdu" onChange={e => setNewConnection({...newConnection, departureTime: e.target.value})} />
            <input placeholder="Godzina przyjazdu" onChange={e => setNewConnection({...newConnection, arrivalTime: e.target.value})} />
            <input placeholder="Czas (min)" type="number" onChange={e => setNewConnection({...newConnection, duration: Number(e.target.value)})} />
            <input placeholder="Cena" type="number" onChange={e => setNewConnection({...newConnection, price: Number(e.target.value)})} />
            <input placeholder="Przesiadki" type="number" onChange={e => setNewConnection({...newConnection, changes: Number(e.target.value)})} />

            <button onClick={async () => {
                await fetch("http://localhost:3001/connections", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newConnection)
                });

                alert("Dodano!");
                fetchConnections();
            }}>
                Dodaj
            </button>

            <div>
                {connections.map((conn) => (
                    <div key={conn._id} style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginTop: "10px"
                    }}>
                        <p>
                            <strong>{conn.from} → {conn.to}</strong>
                        </p>

                        <p>
                            Data: {new Date(conn.date).toLocaleDateString("pl-PL")}
                        </p>

                        <p>
                            {conn.departureTime} - {conn.arrivalTime}
                        </p>

                        <p>
                            Cena: {conn.price} zł
                        </p>

                        <button onClick={async () => {
                            await fetch(`http://localhost:3001/connections/${conn._id}`, {
                                method: "DELETE"
                            });

                            fetchConnections();
                        }}>
                            Usuń
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default AdminPage;