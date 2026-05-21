import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";
import PdfPage from "./pages/PdfPage";

function App() {
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
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: isMobile ? "16px" : "0",
                        padding: isMobile ? "20px" : "20px 40px",
                        backgroundColor: "#111827",
                        borderBottom: "1px solid #334155"
                    }}
                >
                    <h2
                        style={{
                            color: "white",
                            margin: 0,
                            fontSize: isMobile ? "24px" : "28px",
                            textAlign: "center"
                        }}
                    >
                        RailFinder 🚆
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: "14px",
                            width: isMobile ? "100%" : "auto",
                            alignItems: "center"
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                ...linkStyle,
                                width: isMobile ? "100%" : "auto",
                                textAlign: "center"
                            }}
                        >
                            Wyszukiwarka
                        </Link>

                        <Link
                            to="/admin"
                            style={{
                                ...linkStyle,
                                width: isMobile ? "100%" : "auto",
                                textAlign: "center"
                            }}
                        >
                            Panel admina
                        </Link>
                        <Link
                            to="/pdf"
                            style={{
                                ...linkStyle,
                                width: isMobile ? "100%" : "auto",
                                textAlign: "center"
                            }}
                        >
                            Wygeneruj Rozkład PDF
                        </Link>
                    </div>
                </nav>

                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<SearchPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/pdf" element={<PdfPage />} />
                    </Routes>
                </div>

                <footer
                    style={{
                        padding: isMobile ? "18px" : "20px",
                        textAlign: "center",
                        color: "#94a3b8",
                        borderTop: "1px solid #334155",
                        backgroundColor: "#111827",
                        fontSize: isMobile ? "14px" : "16px"
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
    padding: "12px 18px",
    borderRadius: "10px",
    backgroundColor: "#1e293b"
};

export default App;