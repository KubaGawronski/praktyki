import { useState } from "react";


type Connection = {
  _id?: string;
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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState("");
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

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    const res = await fetch(
        `http://localhost:3001/connections?from=${from}&to=${to}&date=${date}&sort=${sort}`
    );
    const data = await res.json();

    setResults(data);
    setLoading(false);
  };

  return (
      <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial" }}>
        <h1 style={{ textAlign: "center" }}>🚆 Wyszukiwarka połączeń</h1>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input placeholder="Skąd" onChange={e => setFrom(e.target.value)} />
          <input placeholder="Dokąd" onChange={e => setTo(e.target.value)} />
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

                <p>{conn.departureTime} - {conn.arrivalTime}</p>

                <p>Czas: {conn.duration} min</p>

                <p>Cena: {conn.price} zł</p>

                <p>Przesiadki: {conn.changes}</p>

                <button onClick={async () => {
                  await fetch(`http://localhost:3001/connections/${conn._id}`, {
                    method: "DELETE"
                  });

                  alert("Usunięto!");
                }}>
                  Usuń
                </button>

              </div>
          ))}
          {loading && <p>Ładowanie...</p>}

          {searched && !loading && results.length === 0 && (
              <p>Brak połączeń</p>
          )}
        </div>
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
        }}>
          Dodaj
        </button>
      </div>
  );
}

export default App;