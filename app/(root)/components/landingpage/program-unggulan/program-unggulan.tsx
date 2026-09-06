import ProgramUnggulanClient from "./program-unggulan-client";
import ErrorState from "../../error-state";
import type { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";

const dummyProgramsData: ProgramUnggulan[] = [
  {
    id: 1,
    title: "Bengkel Koding",
    short_desc:
      "Bengkel Koding: magang internal Teknik Informatika Udinus untuk tingkatkan skill coding praktis.",
    description:
      "Bengkel Koding adalah program magang internal yang diselenggarakan oleh Program Studi Sarjana Teknik Informatika Universitas Dian Nuswantoro (Udinus). Program ini dirancang khusus untuk memberikan pengalaman nyata kepada mahasiswa dalam mengasah keterampilan teknis, khususnya di bidang pemrograman, pengembangan aplikasi, serta praktik kerja tim dalam proyek teknologi. Melalui Bengkel Koding, mahasiswa terlibat langsung dalam proyek-proyek pengembangan perangkat lunak yang relevan dengan kebutuhan industri maupun institusi kampus. Mereka didampingi oleh dosen pembimbing dan mentor teknis untuk memastikan penguasaan konsep serta praktik pengembangan aplikasi modern. Tujuan dari program ini adalah menjembatani kesenjangan antara teori di kelas dan praktik di lapangan, memperkuat portofolio mahasiswa, serta mempersiapkan mereka menghadapi tantangan dunia kerja di bidang teknologi informasi secara profesional.",
    image:
      "/assets/landingpage/logo/program-unggulan/program-bengkelkoding.png",
    partner: "Universitas Dian Nuswantoro",
    duration: "6 Bulan",
    location: "Kampus UDINUS",
    application_deadline: "2025-09-31",
    application_link: "/program-unggulan/",
    statistics: [
      {
        id: 1,
        name: "Peserta",
        pivot: {
          program_id: 1,
          statistic_id: 1,
          value: 500,
        },
      },
    ],
  },
  {
    id: 2,
    title: "Apple Academy",
    short_desc: "Apple Developer Academy @Ciputra: program pelatihan intensif.",
    description:
      "Apple Developer Academy @Ciputra adalah program pelatihan intensif yang diselenggarakan oleh Apple bekerja sama dengan Universitas Ciputra. Program ini dirancang untuk membekali peserta—baik mahasiswa maupun lulusan baru—dengan keterampilan teknis dan non-teknis dalam mengembangkan aplikasi iOS yang inovatif dan berdampak. Selama pelatihan berdurasi 10–12 bulan, peserta akan mempelajari berbagai aspek pengembangan aplikasi, mulai dari coding dengan Swift, desain antarmuka pengguna (UI/UX), hingga soft skill seperti kerja tim, komunikasi, dan kewirausahaan. Program ini tidak hanya fokus pada aspek teknis, tetapi juga menekankan kreativitas, empati terhadap pengguna, dan pemecahan masalah nyata melalui pendekatan berbasis proyek. Tujuan utama dari Apple Developer Academy @Ciputra adalah menciptakan generasi pengembang dan inovator digital yang mampu bersaing secara global dan memberikan kontribusi nyata melalui solusi digital yang bermanfaat bagi masyarakat.",
    image: "/assets/landingpage/logo/program-unggulan/program-appleacademy.png",
    partner: "Apple Inc.",
    duration: "12 Bulan",
    location: "Kampus CIPUTRA",
    application_deadline: "2025-09-31",
    application_link: "/program-unggulan/",
    statistics: [
      {
        id: 1,
        name: "Peserta",
        pivot: {
          program_id: 1,
          statistic_id: 1,
          value: 500,
        },
      },
    ],
  },
  {
    id: 3,
    title: "Garuda Ace ",
    short_desc:
      "Garuda ACE: program beasiswa non-gelar 6 bulan untuk tingkatkan riset.",
    description:
      "Garuda ACE (Academic of Excellence) adalah program beasiswa non-gelar yang diselenggarakan oleh Kementerian Pendidikan Tinggi, Sains, dan Teknologi (Kemdiktistek) Republik Indonesia. Program ini dirancang untuk meningkatkan kapasitas riset internasional dan kemampuan bahasa Inggris mahasiswa Indonesia, khususnya dari jenjang Sarjana (S1) dan Magister (S2), yang berasal dari bidang komputer, teknik, dan telekomunikasi. Selama durasi pelatihan intensif selama 6 bulan, peserta Garuda ACE akan mengikuti berbagai program pengembangan diri, seperti pelatihan bahasa Inggris akademik dan profesional, penguatan soft skill, pengenalan budaya global, serta pelatihan riset dan penulisan ilmiah internasional. Program ini juga membuka peluang kolaborasi riset dengan institusi luar negeri dan dosen pembimbing dari berbagai universitas terkemuka. Garuda ACE bertujuan menciptakan generasi akademisi dan peneliti muda yang unggul, siap berkontribusi dalam forum internasional, serta memperkuat posisi Indonesia dalam ekosistem riset global.",
    image: "/assets/landingpage/logo/program-unggulan/program-msib.png",
    partner: "Kementerian Pendidikan dan Kebudayaan",
    duration: "6 Bulan",
    location: "Perusahaan Terkemuka",
    application_deadline: "2025-09-31",
    application_link: "/program-unggulan/",
    statistics: [
      {
        id: 1,
        name: "Peserta",
        pivot: {
          program_id: 1,
          statistic_id: 1,
          value: 500,
        },
      },
    ],
  },
];

interface Props {
  programs: ProgramUnggulan[] | null | undefined;
  error?: string | null;
}
export const revalidate = 86400; // 1 hari

const ProgramUnggulanSection = ({ programs, error }: Props) => {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Program Unggulan"
        description="Terjadi kesalahan saat memuat data program unggulan. Silakan coba lagi."
      />
    );
  }

  // Pastikan selalu array dan tidak null
  const safePrograms =
    Array.isArray(programs) && programs.length > 0
      ? programs
      : dummyProgramsData;

  return <ProgramUnggulanClient programs={safePrograms} />;
};

export default ProgramUnggulanSection;
