import { Award, BookOpen } from "lucide-react";

const DasarHukum = () => {
  const ketentuan = [
    {
      text: "Masa studi maksimal 7 tahun, dengan beban SKS minimum kelulusan",
      highlight: " 144 SKS",
      detail: ".",
    },
    {
      text: "",
      highlight: "SKS",
      detail:
        " = takaran waktu belajar yang dibebankan kepada mahasiswa seminggu.",
    },
    {
      text: "",
      highlight: "1 SKS",
      detail:
        " pada proses pembelajaran berupa kuliah, responsi, atau tutorial:",
      subItems: [
        "Tatap muka 60 menit / mgg / smt",
        "Penugasan terstruktur 60 menit / mgg / smt",
        "Kegiatan Mandiri 60 menit / mgg / smt",
      ],
    },
    {
      text: "Mahasiswa mengambil paket 20 SKS pada semester I dan 21 SKS pada semester II.",
      highlight: "",
      detail: "",
    },
    {
      text: "Pada semester III dan seterusnya, jumlah SKS sesuai Indeks Prestasi Semester",
      highlight: " (IPS)",
      detail: ".",
    },
    {
      text: "Mahasiswa memilih minat studi pada",
      highlight: " Semester III",
      detail: ".",
    },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-primary to-primary-500 py-4 md:py-6 px-4 md:px-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 100,50 50,100 0,50" fill="%23fff" opacity="0.1"/></svg>\')',
            backgroundSize: "30px 30px",
          }}
        />

        <h3 className="text-xl md:text-2xl font-bold text-white relative z-10">
          Landasan Kurikulum
        </h3>
      </div>

      <div className="p-4 md:p-8">
        <div className="space-y-4 md:space-y-6">
          {/* Undang-Undang */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 ">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto sm:mx-0">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-gray-900">
                Undang-Undang No. 12 Tahun 2012
              </h4>
              <p className="text-gray-700">
                tentang Pendidikan Tinggi
              </p>
            </div>
          </div>

          {/* Peraturan Presiden */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 ">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto sm:mx-0">
              <Award className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-gray-900">
                Peraturan Presiden No. 8 Tahun 2012
              </h4>
              <p className="text-gray-700">
                tentang Kerangka Kualifikasi Nasional Indonesia (KKNI)
              </p>
            </div>
          </div>

          {/* Ketentuan Akademik */}
          <div className="mt-6 md:mt-8 space-y-4">
            <h4 className="text-lg font-bold text-gray-900">
              Ketentuan Akademik:
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {ketentuan.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary-600 font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      {item.text}
                      {item.highlight && (
                        <span className="font-bold text-primary-600 inline-block">
                          {item.highlight}
                        </span>
                      )}
                      {item.detail}
                    </p>

                    {/* Sub Items */}
                    {item.subItems && (
                      <ul className="ml-6 md:ml-9 mt-2 space-y-1 text-gray-700 text-sm md:text-base">
                        {item.subItems.map((subItem, subIndex) => (
                          <li
                            key={subIndex}
                            className="flex items-center"
                          >
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2" />
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasarHukum;
