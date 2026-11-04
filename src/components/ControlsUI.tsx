import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getRektorView } from '../data/rectors';

export function ControlsUI() {
  const isRunning = useGameStore((s) => s.isRunning);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const toggleCameraMode = useGameStore((s) => s.toggleCameraMode);
  const activeExhibitId = useGameStore((s) => s.activeExhibitId);
  const lightboxOpen = useGameStore((s) => s.lightboxOpen);
  const closeLightbox = useGameStore((s) => s.closeLightbox);
  const toggleLightbox = useGameStore((s) => s.toggleLightbox);

  const activeExhibit = getRektorView(activeExhibitId);

  // Lepas pointer lock saat lightbox terbuka supaya kursor bisa mengklik tombol Tutup
  useEffect(() => {
    if (lightboxOpen && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [lightboxOpen]);

  return (
    <>
      {/* ===== Judul museum ===== */}
      <div
        style={{
          position: 'fixed',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#e9c568',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Museum Rektor Universitas Diponegoro
        </div>
        <div
          style={{
            fontFamily: 'Georgia, serif',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '10px',
            letterSpacing: '0.26em',
            marginTop: '3px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Galeri Rektor · 1957 — 2029
        </div>
      </div>

      {/* ===== Badge kanan atas: sudut pandang & kecepatan ===== */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleCameraMode}
          title="Klik atau tekan 'C' untuk mengganti sudut pandang"
          style={{
            background: 'rgba(20, 16, 12, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(233, 197, 104, 0.35)',
            borderRadius: '20px',
            padding: '5px 14px',
            color: '#e9c568',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            fontFamily: 'Georgia, serif',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: cameraMode === 'first-person' ? '#a855f7' : '#38bdf8',
            }}
          />
          {cameraMode === 'first-person' ? 'Orang Pertama (C)' : 'Orang Ketiga (C)'}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
            userSelect: 'none',
            background: 'rgba(20, 16, 12, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '5px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isRunning ? '#ff6b35' : '#4ecdc4',
              boxShadow: `0 0 6px ${isRunning ? '#ff6b35' : '#4ecdc4'}`,
              transition: 'all 0.2s ease',
            }}
          />
          {isRunning ? 'Berlari' : 'Berjalan'}
        </div>
      </div>

      {/* ===== Panel kontrol (kiri bawah) ===== */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(20, 16, 12, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: '#e6dfd0',
          fontSize: '12px',
          lineHeight: 1.9,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
          border: '1px solid rgba(233, 197, 104, 0.18)',
          minWidth: '185px',
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: '8px',
            color: '#e9c568',
          }}
        >
          Kontrol
        </div>
        <ControlRow keys="W A S D" label="Berjalan" />
        <ControlRow keys="Shift" label="Berlari" />
        <ControlRow keys="C" label="Ganti sudut pandang" />
        <ControlRow keys="E" label="Lihat detail karya" />
        <ControlRow keys="Esc" label="Tutup detail" />
        <ControlRow keys="Klik" label="Kunci mouse" />
        <ControlRow keys="Scroll" label="Zoom (orang ketiga)" />
      </div>

      {/* ===== Kartu info karya (kanan bawah), tampil saat dekat lukisan ===== */}
      {activeExhibit && !lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '320px',
            background: 'rgba(24, 20, 14, 0.82)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '18px 20px 14px',
            zIndex: 10,
            border: '1px solid rgba(233, 197, 104, 0.35)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
            animation: 'museumFadeIn 0.35s ease',
            color: '#efe9dc',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#e9c568',
              lineHeight: 1.35,
            }}
          >
            {activeExhibit.name}
          </div>
          <div
            style={{ fontSize: '11px', fontStyle: 'italic', color: '#c8c2b2', marginTop: '5px' }}
          >
            {activeExhibit.role}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              margin: '10px 0',
              padding: '7px 10px',
              background: 'rgba(0,0,0,0.35)',
              borderRadius: '6px',
              fontSize: '10px',
              color: '#a89468',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ fontWeight: 700 }}>{activeExhibit.period}</span>
            <span style={{ textAlign: 'right' }}>{activeExhibit.origin}</span>
          </div>

          <button
            onClick={toggleLightbox}
            style={{
              width: '100%',
              cursor: 'pointer',
              background: 'linear-gradient(180deg, #e9c568 0%, #b98a1e 100%)',
              color: '#241a08',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 0',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
            }}
          >
            Lihat Detail — tekan E
          </button>
        </div>
      )}

      {/* ===== Lightbox fullscreen ===== */}
      {lightboxOpen && activeExhibit && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
            background: 'rgba(8, 6, 4, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'museumFadeIn 0.3s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: '28px',
              maxWidth: '1100px',
              width: '92vw',
              maxHeight: '88vh',
              background: 'linear-gradient(160deg, #221d16 0%, #171310 100%)',
              border: '1px solid rgba(233,197,104,0.35)',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
              overflow: 'auto',
            }}
          >
            {/* Potret / gambar */}
            <img
              src={activeExhibit.image ?? '/rektor/placeholder-portrait.png'}
              alt={activeExhibit.name}
              style={{
                height: '62vh',
                maxWidth: '46%',
                objectFit: 'contain',
                border: '10px solid #c8a13a',
                borderRadius: '4px',
                boxShadow: '0 0 0 2px #6b4f12, 0 16px 48px rgba(0,0,0,0.8)',
                background: '#141210',
              }}
            />
            {/* Panel info */}
            <div style={{ flex: 1, minWidth: '230px', color: '#efe9dc', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#a89468', textTransform: 'uppercase' }}>
                Museum Rektor Universitas Diponegoro
              </div>
              <h1
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '23px',
                  color: '#e9c568',
                  margin: '10px 0 4px',
                  lineHeight: 1.3,
                }}
              >
                {activeExhibit.name}
              </h1>
              <div style={{ fontStyle: 'italic', fontSize: '13px', color: '#d8d2c4' }}>
                {activeExhibit.role}
              </div>
              <div style={{ fontSize: '11px', color: '#a8a294', marginTop: '3px' }}>
                {activeExhibit.period} · {activeExhibit.origin}
              </div>
              <div
                style={{
                  margin: '12px 0',
                  padding: '10px 14px',
                  borderLeft: '3px solid #b98a1e',
                  background: 'rgba(233,197,104,0.06)',
                  fontSize: '12px',
                  lineHeight: 1.9,
                  color: '#ddd6c8',
                }}
              >
                {activeExhibit.highlights.map((h) => (
                  <div key={h}>▸ {h}</div>
                ))}
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.85, color: '#d5cfc2', margin: 0 }}>
                {activeExhibit.bio}
              </p>
              <div style={{ fontSize: '10px', color: '#8a8478', marginTop: '12px', fontStyle: 'italic' }}>
                {activeExhibit.credit}
              </div>
              <div style={{ flex: 1 }} />
              <button
                onClick={closeLightbox}
                style={{
                  marginTop: '16px',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#e9c568',
                  border: '1px solid rgba(233,197,104,0.5)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Tutup — E / Esc
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ControlRow({ keys, label }: { keys: string; label: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
      <span
        style={{
          color: '#e9c568',
          fontFamily: 'monospace',
          fontWeight: 600,
          fontSize: '11px',
        }}
      >
        {keys}
      </span>
      <span style={{ opacity: 0.85 }}>{label}</span>
    </div>
  );
}
