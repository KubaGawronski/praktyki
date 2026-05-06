import { useState } from "react";

type Connection = {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  changes: number;
};

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState<Connection[]>([]);

  const handleSearch = async () => {
    const res = await fetch(
        `http://localhost:3001/connections?from=${from}&to=${to}&date=${date}`
    );
    const data = await res.json();

    setResults(data); // zamiast console.log
  };

  return (
      <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial" }}>
        <h1 style={{ textAlign: "center" }}>🚆 Wyszukiwarka połączeń</h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input placeholder="Skąd" onChange={e => setFrom(e.target.value)} />
          <input placeholder="Dokąd" onChange={e => setTo(e.target.value)} />
          <input type="date" onChange={e => setDate(e.target.value)} />
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

                <p>{conn.departureTime} - {conn.arrivalTime}</p>

                <p>Czas: {conn.duration} min</p>

                <p>Cena: {conn.price} zł</p>

                <p>Przesiadki: {conn.changes}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;