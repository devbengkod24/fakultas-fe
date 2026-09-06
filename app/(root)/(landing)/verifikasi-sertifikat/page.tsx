/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { VerifikasiSertifikatButton } from "../../components/verifikasi-sertifikat/button";

const VerifikasiSertifikatPage = () => {
  return (
    <>
      <main className="flex-grow" id="VerifikasiSertifikatPage">
        <div className="container mx-auto py-10 flex flex-col items-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Verifikasi Sertifikat</h1>
            <p className="text-muted-foreground">
              Masukkan kode sertifikat untuk memverifikasi keaslian sertifikat
            </p>
          </div>
          
          <VerifikasiSertifikatButton />
        </div>
      </main>
    </>
  );
};

export default VerifikasiSertifikatPage;
