// Tekstur prosedural (canvas) untuk museum — tanpa aset eksternal.
import * as THREE from 'three';

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Lantai marmer dua warna (3.6m x 3.6m per tile tekstur, di-repeat). */
export function makeFloorTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512);
  const rand = seededRandom(20260328);

  const drawTile = (x: number, y: number, base: string, vein: string) => {
    ctx.fillStyle = base;
    ctx.fillRect(x, y, 256, 256);
    // Urat marmer
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = vein;
      ctx.globalAlpha = 0.08 + rand() * 0.14;
      ctx.lineWidth = 0.6 + rand() * 1.8;
      ctx.beginPath();
      let px = x + rand() * 256;
      let py = y + rand() * 256;
      ctx.moveTo(px, py);
      for (let s = 0; s < 4; s++) {
        px += (rand() - 0.5) * 140;
        py += (rand() - 0.5) * 140;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Kilau halus
    const g = ctx.createLinearGradient(x, y, x + 256, y + 256);
    g.addColorStop(0, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.5, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.10)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, 256, 256);
  };

  drawTile(0, 0, '#ddd8cb', '#8a867c');
  drawTile(256, 0, '#35322c', '#0f0e0c');
  drawTile(0, 256, '#35322c', '#0f0e0c');
  drawTile(256, 256, '#ddd8cb', '#8a867c');

  // Garis nat
  ctx.strokeStyle = '#191613';
  ctx.lineWidth = 7;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.beginPath();
  ctx.moveTo(256, 0); ctx.lineTo(256, 512);
  ctx.moveTo(0, 256); ctx.lineTo(512, 256);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Dinding: plester krem + wainscot kayu gelap + lis emas tipis (4m x 5m per tile). */
export function makeWallTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512);
  const rand = seededRandom(18300328);

  // Plester krem dengan gradasi vertikal
  const plaster = ctx.createLinearGradient(0, 0, 0, 512);
  plaster.addColorStop(0, '#efe8d9');
  plaster.addColorStop(0.75, '#e7dfcf');
  plaster.addColorStop(1, '#ddd4c2');
  ctx.fillStyle = plaster;
  ctx.fillRect(0, 0, 512, 512);

  // Noise halus pada plester
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(60,50,40,0.05)';
    ctx.fillRect(rand() * 512, rand() * 380, 1.6, 1.6);
  }

  const dadoTop = 396; // tinggi wainscot (dari y atas)
  // Lis emas tipis di atas wainscot
  ctx.fillStyle = '#b98a1e';
  ctx.fillRect(0, dadoTop - 6, 512, 5);
  ctx.fillStyle = '#e8c860';
  ctx.fillRect(0, dadoTop - 6, 512, 2);

  // Wainscot kayu gelap
  const wood = ctx.createLinearGradient(0, dadoTop, 0, 512);
  wood.addColorStop(0, '#46301f');
  wood.addColorStop(1, '#241510');
  ctx.fillStyle = wood;
  ctx.fillRect(0, dadoTop, 512, 512 - dadoTop);

  // Panel vertikal pada wainscot
  for (let x = 18; x < 512; x += 84) {
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, dadoTop + 18, 56, 512 - dadoTop - 30);
    ctx.strokeStyle = 'rgba(255,220,160,0.16)';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x + 3, dadoTop + 21, 50, 512 - dadoTop - 36);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
}

/** Papan nama ruangan / signage emas di atas arch. Transparan. */
export function makeSignTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 128);

  const spaced = text.toUpperCase().split('').join('\u2009\u2009');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 46px Georgia, "Times New Roman", serif';
  // Cahaya emas
  ctx.shadowColor = 'rgba(255,205,110,0.65)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#e9c568';
  ctx.fillText(spaced, 512, 66, 980);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff3c9';
  ctx.globalAlpha = 0.55;
  ctx.fillText(spaced, 512, 64, 980);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Plakat perunggu bergaya museum untuk potret rektor. */
export function makeRektorPlaqueTexture(name: string, period: string, role: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 0, 320);
  bg.addColorStop(0, '#33302a');
  bg.addColorStop(0.5, '#232019');
  bg.addColorStop(1, '#171410');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 320);

  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, 492, 300);
  ctx.strokeStyle = 'rgba(255,230,150,0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(17, 17, 478, 286);

  ctx.textAlign = 'center';
  // Nama (auto-wrap, 1–2 baris)
  ctx.fillStyle = '#e6c860';
  ctx.font = '700 23px Georgia, "Times New Roman", serif';
  wrapText(ctx, name, 256, 62, 448, 28);
  // Periode
  ctx.fillStyle = '#f5eedd';
  ctx.font = '700 34px Georgia, serif';
  ctx.fillText(period, 256, 198);
  // Jabatan
  ctx.fillStyle = '#c8c2b2';
  ctx.font = 'italic 17px Georgia, serif';
  ctx.fillText(role, 256, 240, 448);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Siluet hormat untuk rektor tanpa foto — inisial + keterangan. */
export function makeSilhouetteTexture(name: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 682; // ratio 3:4
  const ctx = c.getContext('2d')!;

  const bg = ctx.createRadialGradient(256, 300, 60, 256, 341, 480);
  bg.addColorStop(0, '#3a3630');
  bg.addColorStop(1, '#14110e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 682);

  // Siluet bust: kepala + bahu
  ctx.fillStyle = '#0d0b09';
  ctx.beginPath();
  ctx.ellipse(256, 250, 92, 112, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 560, 190, 190, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Inisial nama
  const initials = name
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(prof|dr|mr|ir|s\.?h|m\.?s|sp)$/i.test(w.replace(/\./g, '')))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c9a842';
  ctx.font = '700 74px Georgia, serif';
  ctx.fillText(initials, 256, 262);
  ctx.strokeStyle = 'rgba(233,197,104,0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 430);
  ctx.lineTo(362, 430);
  ctx.stroke();
  ctx.fillStyle = '#a89468';
  ctx.font = '600 17px Georgia, serif';
  ctx.fillText('FOTO BELUM TERSEDIA', 256, 468);
  ctx.fillStyle = '#8a8478';
  ctx.font = 'italic 14px Georgia, serif';
  ctx.fillText('dipajang sebagai tanda hormat', 256, 496);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Dinding Lini Masa Universitas Diponegoro. */
export function makeTimelineTexture(items: { year: string; event: string }[]): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1152;
  const ctx = c.getContext('2d')!;

  const bg = ctx.createRadialGradient(1024, 420, 120, 1024, 576, 1400);
  bg.addColorStop(0, '#2b2620');
  bg.addColorStop(1, '#171310');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 1152);
  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 2012, 1116);
  ctx.strokeStyle = 'rgba(233,197,104,0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 1988, 1092);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9c568';
  ctx.font = '700 64px Georgia, "Times New Roman", serif';
  ctx.fillText('LINI MASA UNIVERSITAS DIPONEGORO', 1024, 116);
  ctx.fillStyle = '#c8c2b2';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillText('1956 — 2024  ·  dari Universitas Semarang hingga PTN-BH', 1024, 162);

  // Tiga kolom entri
  const colW = 620;
  const colX = [52, 714, 1376];
  const rowsPerCol = Math.ceil(items.length / 3);
  items.forEach((item, i) => {
    const col = Math.floor(i / rowsPerCol);
    const row = i % rowsPerCol;
    const x = colX[col];
    const y = 260 + row * 168;
    // Tahun
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e9c568';
    ctx.font = '700 40px Georgia, serif';
    ctx.fillText(item.year, x, y);
    // Garis putus kecil
    ctx.strokeStyle = 'rgba(233,197,104,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 90, y + 8);
    ctx.stroke();
    // Deskripsi (wrap)
    ctx.fillStyle = '#ddd6c8';
    ctx.font = '19px Georgia, serif';
    wrapTextLeft(ctx, item.event, x, y + 36, colW - 30, 24);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function wrapTextLeft(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
}

/** Panel kredit sumber & disclaimer. */
export function makeCreditsTexture(credits: { name: string; source: string }[]): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1600;
  c.height = 1152;
  const ctx = c.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 0, 1152);
  bg.addColorStop(0, '#221e18');
  bg.addColorStop(1, '#141110');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1600, 1152);
  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 1568, 1120);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9c568';
  ctx.font = '700 52px Georgia, serif';
  ctx.fillText('SUMBER & KREDIT', 800, 96);
  ctx.fillStyle = '#c8c2b2';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('Foto dan karya yang dipajang di museum ini', 800, 140);

  ctx.textAlign = 'left';
  let y = 230;
  for (const item of credits) {
    ctx.fillStyle = '#efe9dc';
    ctx.font = '600 24px Georgia, serif';
    ctx.fillText('•  ' + item.name, 90, y, 1420);
    ctx.fillStyle = '#a89468';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('      ' + item.source, 90, y + 28, 1420);
    y += 74;
  }

  ctx.fillStyle = '#8a8478';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(
    'Pemakaian untuk edukasi & penghormatan non-komersial. Hak cipta foto milik pemegang haknya masing-masing.',
    90,
    y + 22,
    1420
  );
  ctx.fillText('Keberatan atau koreksi: Kantor Kearsipan Universitas Diponegoro · Humas Undip.', 90, y + 52, 1420);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Papan monumental LOBI: 12 Rektor Universitas Diponegoro. */
export function makeRektorBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1152;
  const ctx = c.getContext('2d')!;

  const bg = ctx.createRadialGradient(1024, 400, 100, 1024, 576, 1500);
  bg.addColorStop(0, '#2e2820');
  bg.addColorStop(1, '#161310');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 1152);

  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 10;
  ctx.strokeRect(22, 22, 2004, 1108);
  ctx.strokeStyle = 'rgba(233,197,104,0.35)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(38, 38, 1972, 1076);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#c8c2b2';
  ctx.font = '600 30px Georgia, serif';
  ctx.fillText('D I P O N E G O R O   M E M E M O R I A L', 1024, 118);
  ctx.fillStyle = '#e9c568';
  ctx.font = '700 96px Georgia, "Times New Roman", serif';
  ctx.fillText('DUA BELAS REKTOR', 1024, 260);
  ctx.fillStyle = '#f5eedd';
  ctx.font = '600 44px Georgia, serif';
  ctx.fillText('1957  —  2029', 1024, 340);
  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(700, 385);
  ctx.lineTo(1348, 385);
  ctx.stroke();

  const rektor = [
    ['1', 'Imam Bardjo', '1957 – 1961'],
    ['2', 'Sudarto S.H. (I)', '1961 – 1963'],
    ['3', 'Sunarjo S.H.', '1963 – 1965'],
    ['4', 'A. Soeroyo', '1965 – 1978'],
    ['5', 'Sudarto S.H. (II)', '1978 – 1986'],
    ['6', 'Moeljono S. Trastotenojo', '1986 – 1994'],
    ['7', 'Muladi S.H.', '1994 – 1998'],
    ['8', 'Eko Budihardjo', '1998 – 2006'],
    ['9', 'Susilo Wibowo', '2006 – 2010'],
    ['10', 'Sudharto P. Hadi', '2010 – 2015'],
    ['11', 'Yos Johan Utama', '2015 – 2024'],
    ['12', 'Suharnomo', '2024 – 2029'],
  ];
  const colX = [90, 1130];
  rektor.forEach(([no, name, period], i) => {
    const col = i < 6 ? 0 : 1;
    const row = i % 6;
    const x = colX[col];
    const y = 480 + row * 118;
    // nomor dalam lingkaran emas
    ctx.strokeStyle = '#c9a842';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 34, y - 8, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#e9c568';
    ctx.font = '700 30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(no, x + 34, y + 2);
    // nama
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f0e9db';
    ctx.font = '600 31px Georgia, serif';
    ctx.fillText(name, x + 76, y, 550);
    ctx.fillStyle = '#a89468';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText(period, x + 76, y + 34);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Dinding besar: lambang/identitas Undip (dekoratif). */
export function makeCrestTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 1024);

  // Lingkaran luar emas
  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.arc(512, 512, 400, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,230,150,0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(512, 512, 372, 0, Math.PI * 2);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9c568';
  ctx.font = '700 92px Georgia, serif';
  ctx.fillText('1957', 512, 330);
  ctx.fillStyle = '#f5eedd';
  ctx.font = '700 72px Georgia, serif';
  ctx.fillText('UNIVERSITAS', 512, 470);
  ctx.fillText('DIPONEGORO', 512, 565);
  ctx.strokeStyle = '#c9a842';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(312, 640);
  ctx.lineTo(712, 640);
  ctx.stroke();
  ctx.fillStyle = '#c8c2b2';
  ctx.font = 'italic 30px Georgia, serif';
  ctx.fillText('WIYATA HANGREKSA', 512, 720);
  ctx.fillText('GAPURANING NAGARA', 512, 768);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
