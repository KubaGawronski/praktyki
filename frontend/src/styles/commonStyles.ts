import type { CSSProperties } from "react";

export const pageContainerStyle: CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "Arial",
    color: "white"
};

export const contentWrapperStyle: CSSProperties = {
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto"
};

export const cardStyle: CSSProperties = {
    backgroundColor: "#1e293b",
    borderRadius: "24px",
    border: "1px solid #334155",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
};

export const inputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "15px",
    outline: "none"
};

export const primaryButtonStyle: CSSProperties = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "14px 24px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
};

export const dangerButtonStyle: CSSProperties = {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold"
};