import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";

function App() {
    return (
        <BrowserRouter>
            <nav style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                borderBottom: "1px solid #ddd"
            }}>
                <Link to="/">Wyszukiwarka</Link>
                <Link to="/admin">Panel admina</Link>
            </nav>

            <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;