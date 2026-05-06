import { useState } from "react";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = async () => {
    const res = await fetch(
        `http://localhost:3001/connections?from=${from}&to=${to}&date=${date}`
    );
    const data = await res.json();
    console.log(data);
  };

  return (
      <div>
        <h1>Wyszukiwarka połączeń 🚆</h1>

        <input placeholder="Skąd" onChange={e => setFrom(e.target.value)} />
        <input placeholder="Dokąd" onChange={e => setTo(e.target.value)} />
        <input type="date" onChange={e => setDate(e.target.value)} />

        <button onClick={handleSearch}>Szukaj</button>
      </div>
  );
}

export default App;