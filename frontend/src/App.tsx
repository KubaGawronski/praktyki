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
      <div>
        <h1>Wyszukiwarka połączeń 🚆</h1>

        <input placeholder="Skąd" onChange={e => setFrom(e.target.value)} />
        <input placeholder="Dokąd" onChange={e => setTo(e.target.value)} />
        <input type="date" onChange={e => setDate(e.target.value)} />

        <button onClick={handleSearch}>Szukaj</button>
        <div>
          {results.map((conn: Connection, index) => (
              <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
                <p>{conn.from} → {conn.to}</p>
                <p>{conn.departureTime} - {conn.arrivalTime}</p>
                <p>{conn.duration} min</p>
                <p>{conn.price} zł</p>
                <p>Przesiadki: {conn.changes}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;