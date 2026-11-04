// Data koleksi Museum Rektor Universitas Diponegoro.
// 12 periode rektor (1957–2029) dikelompokkan dalam 3 zona:
//   Galeri Barat  — Masa Perintisan  (1957–1986)  frame hitam
//   Aula Utama    — Masa Pembangunan (1986–2010)  frame emas
//   Galeri Timur  — Masa Modern      (2010–2029)  frame kayu

export type FrameStyle = 'gold' | 'black' | 'wood';

export interface Rektor {
  id: number;
  name: string;
  period: string;
  role: string; // jabatan singkat (muncul di plakat)
  origin: string; // latar/fakultas
  zone: 'perintisan' | 'pembangunan' | 'modern';
  highlights: string[];
  bio: string;
  /** Path foto, atau null → siluet inisial otomatis */
  image: string | null;
  credit: string;
  /** Posisi pusat kanvas di dunia 3D */
  position: [number, number, number];
  rotationY: number;
  frame: FrameStyle;
  canvasWidth: number;
  triggerDistance: number;
  plaqueSide: 1 | -1;
  spotIntensity: number;
}

const P = 1.33; // tinggi kanvas 3:4 (dihitung dari canvasWidth)
export { P as PORTRAIT_HEIGHT_RATIO };

export const RECTORS: Rektor[] = [
  // ============ Sisi barat — MASA PERINTISAN (frame hitam) ============
  {
    id: 1,
    name: 'Prof. Mr. Imam Bardjo',
    period: '1957 – 1961',
    role: 'Presiden Universitas Semarang → Undip',
    origin: 'Hukum · Pendiri Universitas',
    zone: 'perintisan',
    highlights: [
      'Mendirikan Universitas Semarang (9 Januari 1957)',
      'Mengawal perubahan nama menjadi Universitas Diponegoro (1960)',
      'Namanya diabadikan: Auditorium Imam Bardjo, Kampus Pleburan',
    ],
    bio:
      'Prof. Mr. Imam Bardjo adalah pendiri Universitas Semarang — cikal bakal Universitas Diponegoro. ' +
      'Pada 9 Januari 1957 beliau meresmikan pembukaan Universitas Semarang dengan dirinya sebagai Presiden Universitas pertama. ' +
      'Di bawah kepemimpinannya, perguruan tinggi swasta ini berkembang pesat hingga pada Dies Natalis ketiga (9 Januari 1960) ' +
      'Presiden Soekarno mengganti namanya menjadi Universitas Diponegoro sebagai penghargaan atas prestasinya membina ' +
      'pendidikan tinggi di Jawa Tengah.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [-23.77, 2.4, 7.0],
    rotationY: Math.PI / 2,
    frame: 'black',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 24,
  },
  {
    id: 2,
    name: 'Prof. Mr. Sudarto S.H.',
    period: '1961 – 1963',
    role: 'Presiden Universitas Diponegoro',
    origin: 'Hukum · Fakultas Hukum Undip',
    zone: 'perintisan',
    highlights: [
      'Pejabat Presiden Undip (1 Januari 1961)',
      'Presiden Universitas Diponegoro (1962–1963, SK No. 7167/UP/II/62)',
      'Merangkap Dekan Fakultas Hukum Undip',
    ],
    bio:
      'Prof. Mr. Sudarto S.H. adalah sarjana hukum (Meester in de rechten) dan akademisi. ' +
      'Ia menjadi Pejabat Presiden Undip sejak 1 Januari 1961, kemudian resmi diangkat sebagai Presiden Universitas Diponegoro ' +
      'pada 8 Juni 1962 (SK Menteri PTIP No. 7167/UP/II/62). Pada 14 September 1963 ia diberhentikan dan digantikan oleh ' +
      'Prof. Sunarjo S.H. Beliau kelak kembali dipercaya memimpin Undip untuk dua periode (1978–1986) hingga akhir hayatnya.',
    image: '/rektor/sudarto.jpg',
    credit: 'Foto: Kantor Kearsipan Universitas Diponegoro (2025)',
    position: [-23.77, 2.4, 1.6],
    rotationY: Math.PI / 2,
    frame: 'black',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 24,
  },
  {
    id: 3,
    name: 'Prof. Sunarjo S.H.',
    period: '1963 – 1965',
    role: 'Presiden Universitas Diponegoro',
    origin: 'Hukum · Fakultas Hukum Undip',
    zone: 'perintisan',
    highlights: [
      'Rektor/Presiden Undip 1963–1965',
      'Meneruskan pembangunan fakultas-fakultas awal Undip',
      'Era konsolidasi akhir Orde Lama',
    ],
    bio:
      'Prof. Sunarjo S.H. menjabat Presiden Universitas Diponegoro 1963–1965, menggantikan Sudarto di masa pergolakan politik ' +
      'akhir Orde Lama. Arsip resmi Undip (undip.ac.id & kearsipan.undip.ac.id) mencatat kepemimpinan singkatnya di masa ' +
      'menjelang G30S/1965 — masa ketika Undip tetap berdiri sebagai lembaga pendidikan di tengah instabilitas politik nasional.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [-23.77, 2.4, -3.6],
    rotationY: Math.PI / 2,
    frame: 'black',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 24,
  },
  {
    id: 4,
    name: 'Dr. A. Soeroyo',
    period: '1965 – 1978',
    role: 'Rektor Universitas Diponegoro',
    origin: '— (era transisi)',
    zone: 'perintisan',
    highlights: [
      'Rektor era transisi (1965–1978)',
      'Memimpin Undip dari Orde Lama ke Orde Baru',
      'Menyerahkan jabatan kepada Soedarto (Kepres No. 130/M 1977)',
    ],
    bio:
      'Dr. A. Soeroyo memimpin Undip pada masa transisi politik nasional (G30S/PKI → Orde Baru) hingga 1977/1978. ' +
      'Di eranya, Undip memperluas cakupan fakultas dan membina generasi akademisi baru. ' +
      'Ia kemudian menyerahkan jabatan kepada Prof. Sudarto S.H. yang dilantik berdasarkan Keputusan Presiden No. 130/M Tahun 1977.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [-19.5, 2.4, -19.77],
    rotationY: 0,
    frame: 'black',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 24,
  },
  {
    id: 5,
    name: 'Prof. Sudarto S.H.',
    period: '1978 – 1986',
    role: 'Rektor — 2 periode',
    origin: 'Hukum · Fakultas Hukum Undip',
    zone: 'perintisan',
    highlights: [
      'Rektor 1978–1986 (dua periode, Kepres No. 130/M 1977)',
      'Pengabdi ilmu & hukum; perancang awal KUHP nasional',
      'Namanya diabadikan: Jl. Prof. Soedarto & Auditorium Prof. Soedarto',
    ],
    bio:
      'Prof. Sudarto S.H. (Jember, 10 Februari 1923 – Semarang, 28 Juli 1986) adalah negarawan dan pengabdi ilmu hukum pidana. ' +
      'Ia kembali dipercaya menjadi Rektor Universitas Diponegoro melalui Keputusan Presiden No. 130/M Tahun 1977, ' +
      'menjabat dua periode hingga akhir hayatnya (1978–1986). Di bawah kepemimpinannya, Undip berkembang pesat. ' +
      'Hari ini namanya diabadikan menjadi nama jalan utama menuju Kampus Tembalang (Jl. Prof. Soedarto, S.H.) ' +
      'dan Auditorium Prof. Soedarto. Ia juga tokoh perancang awal Kitab Undang-Undang Hukum Pidana (KUHP) nasional yang disahkan DPR pada 2022.',
    image: '/rektor/sudarto.jpg',
    credit: 'Foto: Kantor Kearsipan Universitas Diponegoro (2025)',
    position: [-12, 2.4, -19.77],
    rotationY: 0,
    frame: 'black',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 24,
  },
  // ============ Bar utara — MASA PEMBANGUNAN (frame emas) ============
  {
    id: 6,
    name: 'Prof. Dr. Moeljono S. Trastotenojo, Sp.A(K)',
    period: '1986 – 1994',
    role: 'Rektor — 2 periode',
    origin: 'Kedokteran · FK Undip',
    zone: 'pembangunan',
    highlights: [
      'Rektor 1986–1994 (dua periode), menggantikan Soedarto yang wafat',
      'Guru Besar Ilmu Kesehatan Anak FK Undip',
      'Masa pembangunan fisik kampus Tembalang',
    ],
    bio:
      'Prof. Dr. Moeljono S. Trastotenojo, Sp.A(K) (±1934 – 28 Oktober 2018) adalah Dokter Spesialis Anak dan ' +
      'Guru Besar Ilmu Kesehatan Anak Fakultas Kedokteran Undip. Beliau menjabat Rektor Undip selama dua periode (1986–1994) ' +
      'menggantikan Soedarto yang wafat pada 1986, memimpin Undip dalam masa-masa pembangunan gedung dan kampus Tembalang. ' +
      'Beliau wafat di RSUP dr. Kariadi, Semarang, dan disemayamkan di Auditorium Imam Bardjo, Kampus Pleburan.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [-4.5, 2.4, -19.77],
    rotationY: 0,
    frame: 'gold',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 30,
  },
  {
    id: 7,
    name: 'Prof. Dr. Muladi, S.H.',
    period: '1994 – 1998',
    role: 'Rektor Undip & Menteri Kehakiman RI',
    origin: 'Hukum · Fakultas Hukum Undip',
    zone: 'pembangunan',
    highlights: [
      'Rektor 1994–1998 (Kepres No. 63/M Tahun 1994)',
      'Menteri Kehakiman RI (1998–99) & Menteri Sekretaris Negara',
      'Muladi Dome dinamai dari beliau (5 April 2024)',
    ],
    bio:
      'Prof. Dr. Muladi, S.H. (Surakarta, 26 Mei 1943 – Jakarta, 31 Desember 2020) adalah pakar hukum pidana. ' +
      'Ia menjabat Dekan Fakultas Hukum Undip (1986–1992), kemudian Rektor Universitas Diponegoro (1994–1998). ' +
      'Setelah Undip, ia menjadi Menteri Kehakiman Kabinet Pembangunan VII & Kabinet Reformasi Pembangunan (1998–1999) ' +
      'merangkap Menteri Negara/Sekretaris Negara, lalu Gubernur Lemhanas (2005–2011). ' +
      'Dikenang sebagai negarawan dan pejuang reformasi hukum. Pada 5 April 2024 Undip meresmikan Gedung Serba Guna ' +
      'terbesar se-Jawa Tengah dengan nama Muladi Dome sebagai penghormatan kepadanya.',
    image: '/rektor/muladi.jpg',
    credit: 'Foto: ANTARA',
    position: [3.5, 2.4, -19.77],
    rotationY: 0,
    frame: 'gold',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: -1,
    spotIntensity: 30,
  },
  {
    id: 8,
    name: 'Prof. Dr. Ir. Eko Budihardjo, M.Sc.',
    period: '1998 – 2006',
    role: 'Rektor — 2 periode',
    origin: 'Teknik · FT Undip',
    zone: 'pembangunan',
    highlights: [
      'Rektor 1998–2006 (dua periode)',
      'Rektor pertama yang berasal dari Fakultas Teknik',
      'Guru Besar Arsitektur & Perencanaan Kota',
    ],
    bio:
      'Prof. Dr. Ir. Eko Budihardjo, M.Sc. adalah arsitek dan Guru Besar Perencanaan Kota Undip. ' +
      'Ia menjabat Rektor Undip selama dua periode (1998–2006) — rektor pertama yang berasal dari Fakultas Teknik — ' +
      'setelah sebelumnya menjabat Dekan FT Undip (1989–2000). Dikenal sebagai akademisi produktif di bidang konservasi kota, ' +
      'arsitektur berkelanjutan, dan perencanaan wilayah; karya-karyanya banyak membentuk wajah kampus Tembalang.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [11, 2.4, -19.77],
    rotationY: 0,
    frame: 'gold',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: 1,
    spotIntensity: 30,
  },
  {
    id: 9,
    name: 'Prof. Dr. dr. Susilo Wibowo, M.S.Med., SpAnd(K)',
    period: '2006 – 2010',
    role: 'Rektor Undip',
    origin: 'Kedokteran · FK Undip',
    zone: 'pembangunan',
    highlights: [
      'Rektor 2006–2010 (memenangi Pilrek 2006)',
      'Guru Besar Andrologi FK Undip',
      'GOR Basket Prof. Susilo Wibowo dinamai dari beliau (2023)',
    ],
    bio:
      'Prof. Dr. dr. Susilo Wibowo, M.S.Med., SpAnd(K) (Temanggung, 21 Maret 1945 – Semarang, 27 Mei 2022) adalah ' +
      'Guru Besar Andrologi Fakultas Kedokteran Undip. Ia memenangi pemilihan rektor (Pilrek) Undip Mei 2006 ' +
      '(mengalahkan antara lain Prof. Sudharto P Hadi) dan menjabat Rektor 2006–2010. ' +
      'Pada 1 September 2023 Undip meresmikan GOR Basket standar FIBA dengan nama GOR Prof. Susilo Wibowo sebagai penghormatan.',
    image: null,
    credit: 'Foto belum tersedia di publik — ditampilkan siluet inisial',
    position: [18, 2.4, -19.77],
    rotationY: 0,
    frame: 'gold',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: -1,
    spotIntensity: 30,
  },
  // ============ Sisi timur — MASA MODERN (frame kayu) ============
  {
    id: 10,
    name: 'Prof. Sudharto Prawoto Hadi, M.E.S., Ph.D.',
    period: '2010 – 2015',
    role: 'Rektor Undip',
    origin: 'Teknik · FT Undip',
    zone: 'modern',
    highlights: [
      'Rektor 2010–2015 (memenangi Pilrek 8 Juni 2010)',
      'Guru Besar Manajemen Lingkungan, FT Undip',
      'Lahir Klaten, 3 September 1954; alumnus UGM',
    ],
    bio:
      'Prof. Sudharto Prawoto Hadi, M.E.S., Ph.D. adalah Guru Besar Manajemen Lingkungan Fakultas Teknik Undip. ' +
      'Ia memenangi Pilrek Undip pada 8 Juni 2010 (unggul dari Susilo Wibowo dkk.) dan menjabat Rektor 2010–2014/15, ' +
      'menggantikan Susilo Wibowo. Di eranya, Undip memperkuat kerja sama internasional dan pembangunan infrastruktur ' +
      'kampus. Ia kemudian aktif di organisasi alumni dan Majelis Wali Amanat Undip.',
    image: '/rektor/sudharto.jpg',
    credit: 'Foto: alumniprofile.undip.ac.id',
    position: [23.77, 2.4, -3.6],
    rotationY: -Math.PI / 2,
    frame: 'wood',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: -1,
    spotIntensity: 26,
  },
  {
    id: 11,
    name: 'Prof. Dr. Yos Johan Utama, S.H., M.Hum.',
    period: '2015 – 2024',
    role: 'Rektor — 2 periode',
    origin: 'Hukum · Fakultas Hukum Undip',
    zone: 'modern',
    highlights: [
      'Rektor 2015–2019 & 2019–2024 (dua periode)',
      'Pakar Hukum Acara Tata Usaha Negara; mantan Dekan FH Undip',
      'Peresmian Muladi Dome (5 April 2024) di masa kepemimpinannya',
    ],
    bio:
      'Prof. Dr. Yos Johan Utama, S.H., M.Hum., lahir 10 November 1962. Pakar Hukum Acara Tata Usaha Negara, ' +
      'mantan Dekan Fakultas Hukum Undip. Ia terpilih sebagai Rektor Undip pada 2 April 2015 (mengalahkan Prof. Slamet Budi Prayitno) ' +
      'dan terpilih kembali untuk periode 2019–2024. Masa kepemimpinannya ditandai ekspansi kerja sama internasional, ' +
      'peresmian Muladi Dome (2024), dan konsolidasi status PTN-BH Undip.',
    image: '/rektor/yosutama.jpg',
    credit: 'Foto: hukumonline.com (2015)',
    position: [23.77, 2.4, 1.6],
    rotationY: -Math.PI / 2,
    frame: 'wood',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: -1,
    spotIntensity: 26,
  },
  {
    id: 12,
    name: 'Prof. Dr. Suharnomo, S.E., M.Si.',
    period: '2024 – 2029',
    role: 'Rektor Undip — petahana',
    origin: 'Ekonomika & Bisnis · FEB Undip',
    zone: 'modern',
    highlights: [
      'Rektor petahana (pelantikan 29 April 2024, Muladi Dome)',
      'Guru Besar Manajemen Sumber Daya Manusia; mantan Dekan FEB (2 periode)',
      'Melanjutkan internasionalisasi & akreditasi internasional Undip',
    ],
    bio:
      'Prof. Dr. Suharnomo, S.E., M.Si. (lahir 22 Juli 1970) adalah Guru Besar Manajemen Sumber Daya Manusia ' +
      'Fakultas Ekonomika dan Bisnis Undip. Ia menjabat Dekan FEB Undip selama dua periode, kemudian dilantik sebagai ' +
      'Rektor Universitas Diponegoro periode 2024–2029 pada 29 April 2024 di Muladi Dome, menggantikan Prof. Yos Johan Utama. ' +
      'Fokusnya: menjaga martabat dan manfaat Undip — "UNDIP Bermartabat, UNDIP Bermanfaat".',
    image: '/rektor/suharnomo.jpg',
    credit: 'Foto: Rektor Undip (rektor.undip.ac.id)',
    position: [23.77, 2.4, 7.0],
    rotationY: -Math.PI / 2,
    frame: 'wood',
    canvasWidth: 1.05,
    triggerDistance: 2.4,
    plaqueSide: -1,
    spotIntensity: 26,
  },
];

// ============ PANEL INTERAKTIF LOBI ============
const LAMBANG_UNDIP: RektorView = {
  id: 101,
  name: 'Lambang Universitas Diponegoro',
  period: 'Ditetapkan 1957 · dies natalis 15 Oktober',
  role: '“Wiyata Hangreksa Gapuraning Nagara”',
  origin: 'Lambang institusi',
  highlights: [
    'Segi lima berbingkai lengkung — simbol Pancasila',
    '10 kelopak & 15 helai daun melati — Dies Natalis 15 Oktober',
    'Keris — ketajaman analisis & ketepatan',
    'Siluet Pangeran Diponegoro — jiwa kepahlawanan & jati diri Undip',
    'Kubah + 8 sinar — ketakwaan & pencerahan ilmu',
  ],
  bio:
    'Lambang Undip berbentuk segi lima berbingkai lengkung. Di dalam kuncup melati yang sedang berkembang ' +
    'terdapat keris dan siluet Pangeran Diponegoro, diapit kubah dengan 8 pancaran sinar. Segi lima melambangkan ' +
    'Pancasila sebagai dasar negara; kuncup melati melambangkan pendidikan tinggi; keris melambangkan ketajaman ' +
    'analisis; siluet Diponegoro melambangkan kepahlawanan; kubah melambangkan religiusitas; dan 8 sinar ' +
    'melambangkan pencerahan pengetahuan bagi masyarakat. Daun (15 helai) dan kelopak (10 helai) melati ' +
    'melambangkan tanggal dan bulan kelahiran Undip, 15 Oktober.',
  image: '/rektor/undip-lambang.png',
  credit: 'Lambang resmi Universitas Diponegoro — undip.ac.id',
  position: [-7.79, 2.55, 3.4],
  rotationY: Math.PI / 2,
  canvasWidth: 1.35,
  canvasHeight: 1.4,
  frame: 'gold',
  triggerDistance: 2.7,
  plaqueSide: 1,
  spotIntensity: 26,
};

const WIDYA_PURAYA: RektorView = {
  id: 102,
  name: 'Gedung Rektorat Widya Puraya',
  period: 'Kampus Tembalang · sejak 1980-an',
  role: 'Pusat administrasi Universitas Diponegoro',
  origin: 'Tembalang, Semarang · 180 ha',
  highlights: [
    'Kampus utama Undip (Tembalang) seluas ±180 ha',
    'Pusat administrasi, Rektorat & Majelis Wali Amanat',
    '11 fakultas & 2 sekolah · PTN-BH (PP No. 52 Tahun 2015)',
    'Dies Natalis 15 Oktober 1957 — “Pertempuran Lima Hari” Semarang',
  ],
  bio:
    'Widya Puraya adalah gedung Rektorat Universitas Diponegoro di Kampus Tembalang (Jl. Prof. Soedarto, S.H., No. 13). ' +
    'Kampus Tembalang seluas ±180 hektar menjadi pusat kegiatan akademik dan administrasi Undip sejak dibangun ' +
    'pada 1980-an — semua fakultas, Sekolah Vokasi dan pusat administrasi terpusat di sini. Di Widya Puraya ' +
    'berkantor Rektorat, Majelis Wali Amanat, Senat Akademik, dan berbagai direktorat. Di depannya berdiri ' +
    'lapangan upacara dengan bendera merah putih sebagai simbol kebanggaan almamater.',
  image: '/rektor/widya-puraya.webp',
  credit: 'Foto udara Widya Puraya — undip.ac.id',
  position: [7.79, 2.45, 4.7],
  rotationY: -Math.PI / 2,
  canvasWidth: 2.5,
  canvasHeight: 1.48,
  frame: 'wood',
  triggerDistance: 2.8,
  plaqueSide: -1,
  spotIntensity: 30,
};

// ============ VIEW TERSATU UNTUK PROXIMITY & UI ============
export interface RektorView {
  id: number;
  name: string;
  period: string;
  role: string;
  origin: string;
  highlights: string[];
  bio: string;
  image: string | null;
  credit: string;
  /** Layout 3D untuk proximity check */
  position: [number, number, number];
  rotationY: number;
  triggerDistance: number;
  canvasWidth: number;
  canvasHeight: number;
  frame: FrameStyle;
  plaqueSide: 1 | -1;
  spotIntensity: number;
}

export const COLLECTION: RektorView[] = [
  ...RECTORS.map((r) => ({ ...r, canvasHeight: 1.4 })),
  LAMBANG_UNDIP,
  WIDYA_PURAYA,
];

export function getRektorView(id: number | null): RektorView | null {
  if (id == null) return null;
  return COLLECTION.find((r) => r.id === id) ?? null;
}

