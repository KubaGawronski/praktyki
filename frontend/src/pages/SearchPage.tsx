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

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        setResults([]);

        const res = await fetch(
            `http://localhost:3001/connections?from=${from}&to=${to}&date=${date}&sort=${sort}`
        );
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
        <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center" }}>🚆 Wyszukiwarka połączeń</h1>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <select onChange={(e) => setFrom(e.target.value)}>
                    <option value="">Skąd</option>

                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>

                <select onChange={(e) => setTo(e.target.value)}>
                    <option value="">Dokąd</option>

                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>
                <input type="date" onChange={e => setDate(e.target.value)} />

                <select onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sortuj</option>
                    <option value="price">Cena</option>
                    <option value="duration">Czas</option>
                </select>

                <button style={{ padding: "8px 12px", cursor: "pointer" }} onClick={handleSearch}>
                    Szukaj
                </button>
            </div>

            <div>
                {results.map((conn: Connection, index) => (
                    <div key={index} style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                    }}>
                        <h3>{conn.from} → {conn.to}</h3>

                        <p>
                            Data: {new Date(conn.date).toLocaleDateString("pl-PL")}
                        </p>

                        <p>{conn.departureTime} - {conn.arrivalTime}</p>

                        <p>Czas: {conn.duration} min</p>

                        <p>Cena: {conn.price} zł</p>

                        <p>Przesiadki: {conn.changes}</p>

                    </div>
                ))}
                {loading && <p>Ładowanie...</p>}

                {searched && !loading && results.length === 0 && (
                    <p>Brak połączeń</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;