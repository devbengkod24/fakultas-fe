// "use client";
// import dynamic from "next/dynamic";

// const RedocStandalone = dynamic(
//   () => import("redoc").then((mod) => mod.RedocStandalone),
//   { ssr: false }
// );

// export default function ApiDocs() {
//   return (
//     <div style={{ height: "100vh" }}>
//       <RedocStandalone
//         specUrl="/docs-siadin/index.yaml"  // taruh file api.yaml di /public
//         options={{
//           scrollYOffset: 50,
//           theme: {
//             colors: { primary: { main: "#1d4ed8" } }, // contoh ganti warna biru
//             typography: { fontSize: "16px", fontFamily: "Arial" },
//           },
//         }}
//       />
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RedocStandalone = dynamic(
  () => import("redoc").then((mod) => mod.RedocStandalone),
  { ssr: false }
);

export default function ApiDocs() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const password = "sti-docs-privateA11.2022"; // ambil dari .env
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
        specUrl="/docs-siadin/index.yaml"
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
