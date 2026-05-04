"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          color: "#fff",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "5rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            Oops!
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            A critical error occurred
          </h1>
          <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
            The application encountered an unrecoverable error.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "0.75rem",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try to Recover
          </button>
        </div>
      </body>
    </html>
  );
}
