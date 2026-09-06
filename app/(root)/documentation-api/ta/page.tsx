
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RedocStandalone = dynamic(
    () => import("redoc").then((mod) => mod.RedocStandalone),
    { ssr: false }
);

export default function ApiDocsTA() {
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const password = "stita";
        const entered = prompt("Masukkan password untuk membuka API Docs:");

        if (entered === password) {
            setAuthorized(true);
        } else {
            alert("Password salah!");
        }
    }, []);

    if (!authorized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Akses ditolak 🚫</p>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh" }}>
            <RedocStandalone
                specUrl="/docs-siadin/sti-docs-ta.yaml"
                options={{
                    scrollYOffset: 50,
                    theme: {
                        colors: { primary: { main: "#1d4ed8" } },
                        typography: { fontSize: "16px", fontFamily: "Arial" },
                    },
                }}
            />
        </div>
    );
}
