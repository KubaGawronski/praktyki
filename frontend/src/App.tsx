import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";

function App() {
    return (
        <BrowserRouter>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0f172a"
                }}
            >
                <nav
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px 40px",
                        backgroundColor: "#111827",
                        borderBottom: "1px solid #334155"
                    }}
                >
                    <h2
                        style={{
                            color: "white",
                            margin: 0
                        }}
                    >
                        RailFinder 🚆
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            gap: "20px"
                        }}
                    >
                        <Link
                            to="/"
                            style={linkStyle}
                        >
                            Wyszukiwarka
                        </Link>

                        <Link
                            to="/admin"
                            style={linkStyle}
                        >
                            Panel admina
                        </Link>
                    </div>
                </nav>

                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<SearchPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </div>

                <footer
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#94a3b8",
                        borderTop: "1px solid #334155",
                        backgroundColor: "#111827"
                    }}
                >
                    © 2025 RailFinder — System wyszukiwania połączeń kolejowych
                </footer>
            </div>
        </BrowserRouter>
    );
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "10px 16px",
    borderRadius: "10px"
};

export default App;