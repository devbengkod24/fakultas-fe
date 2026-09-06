import React from 'react';
import { usePresensi } from '../hooks/usePresensi';

const PresensiComponent = ({ kelasId }) => {
  const { data, isLoading, submitPresensi } = usePresensi(kelasId);

  const handlePresensi = async (mahasiswaId, status) => {
    try {
      await submitPresensi(mahasiswaId, status);
      alert('Presensi berhasil diubah!');
    } catch (error) {
      alert('Gagal mengubah presensi');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.mahasiswa?.map(mahasiswa => (
        <div key={mahasiswa.id} className="mahasiswa-item">
          <span>{mahasiswa.nama}</span>
          <select 
            value={mahasiswa.status_presensi || ''}
            onChange={(e) => handlePresensi(mahasiswa.id, e.target.value)}
          >
            <option value="">Pilih Status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak_hadir">Tidak Hadir</option>
            <option value="izin">Izin</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default PresensiComponent;
