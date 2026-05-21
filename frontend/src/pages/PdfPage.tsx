import { useEffect, useState } from "react";

import {
    pageContainerStyle,
    contentWrapperStyle,
    cardStyle
} from "../styles/commonStyles";

function PdfPage() {
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
        <div
            style={{
                ...pageContainerStyle,
                padding: isMobile ? "20px" : "40px"
            }}
        >
            <div style={contentWrapperStyle}>
                <div style={{ marginBottom: "40px" }}>
                    <h1
                        style={{
                            textAlign: "center",
                            fontSize: isMobile ? "34px" : "48px",
                            marginBottom: "10px"
                        }}
                    >
                        Generator PDF 📄
                    </h1>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#94a3b8"
                        }}
                    >
                        Pobieraj rozkłady jazdy w formacie PDF
                    </p>
                </div>

                <div
                    style={{
                        ...cardStyle,
                        padding: "30px",
                        textAlign: "center"
                    }}
                >
                    <h2>
                        Funkcja w przygotowaniu 🚧
                    </h2>

                    <p style={{ color: "#94a3b8" }}>
                        W tej zakładce będzie można generować
                        pliki PDF z rozkładem jazdy dla wybranej stacji.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PdfPage;