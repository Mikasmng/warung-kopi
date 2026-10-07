import { useState, useMemo, useEffect } from "react";
import "./App.css";

const MENU = [
  { id: "kopsu", nama: "Kopi Susu Aren", ket: "manis legit", harga: 18000, warna: "#a9744f" },
  { id: "tubruk", nama: "Kopi Tubruk", ket: "pekat & jujur", harga: 10000, warna: "#34200f" },
  { id: "teh", nama: "Teh Tarik", ket: "creamy hangat", harga: 12000, warna: "#c98a4b" },
  { id: "coklat", nama: "Coklat Panas", ket: "tebal & lembut", harga: 15000, warna: "#5a3425" },
];

const TOPPING = [
  { id: "boba", nama: "Boba", harga: 4000 },
  { id: "shot", nama: "Extra Shot", harga: 5000 },
  { id: "roti", nama: "Roti Bakar", harga: 8000 },
];

const BAYAR = ["Tunai", "QRIS", "Transfer"];
const GULA = ["Tanpa gula", "Sedikit", "Normal", "Manis", "Sangat manis"];
const BIJI = [
  { l: "6%", t: "12%", s: 38, d: 0 },
  { l: "88%", t: "18%", s: 30, d: 1.2 },
  { l: "12%", t: "62%", s: 26, d: 2.1 },
  { l: "92%", t: "70%", s: 42, d: 0.6 },
  { l: "48%", t: "92%", s: 28, d: 1.8 },
  { l: "70%", t: "4%", s: 22, d: 2.6 },
];

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const waktu = (d) =>
  d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" }) +
  " · " +
  d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");

const AWAL = {
  nama: "",
  meja: "",
  menu: "kopsu",
  panas: true,
  gula: 2,
  topping: [],
  jumlah: 1,
  bayar: "QRIS",
  catatan: "",
};

function Bean({ s, d }) {
  return (
    <svg viewBox="0 0 40 40" width={s} height={s} style={{ animationDelay: `${d}s` }} className="bean" aria-hidden="true">
      <ellipse cx="20" cy="20" rx="12" ry="17" transform="rotate(35 20 20)" />
      <path d="M12 9 C22 16 16 24 28 31" />
    </svg>
  );
}

function Cup({ warna, panas, aktif }) {
  return (
    <svg viewBox="0 0 130 120" className="cup" aria-hidden="true">
      <g className={`steam ${aktif && panas ? "on" : ""}`}>
        <path d="M48 40 C41 30 55 25 48 12" />
        <path d="M65 40 C58 30 72 25 65 12" />
        <path d="M82 40 C75 30 89 25 82 12" />
      </g>
      <ellipse cx="62" cy="108" rx="52" ry="7" fill="#fff8ee" stroke="#2e1d12" strokeWidth="3" />
      <path d="M30 46 H94 V80 a22 22 0 0 1 -22 22 H52 a22 22 0 0 1 -22 -22 Z" fill="#fff8ee" stroke="#2e1d12" strokeWidth="4" />
      <path d="M34 54 H90 V80 a18 18 0 0 1 -18 18 H52 a18 18 0 0 1 -18 -18 Z" fill={warna} style={{ transition: "fill .5s" }} />
      {!panas && (
        <g className="es">
          <rect x="42" y="58" width="15" height="15" rx="3" transform="rotate(-12 49 65)" />
          <rect x="62" y="62" width="14" height="14" rx="3" transform="rotate(14 69 69)" />
          <rect x="52" y="76" width="13" height="13" rx="3" transform="rotate(-6 58 82)" />
        </g>
      )}
      <path d="M94 56 h8 a10 10 0 0 1 0 22 h-8" fill="none" stroke="#2e1d12" strokeWidth="4" />
    </svg>
  );
}

function Barcode({ kode }) {
  const bars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => 1 + ((kode.charCodeAt(i % kode.length) * (i + 3)) % 4)),
    [kode]
  );
  return (
    <div className="barcode" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w * 1.5 }} />
      ))}
    </div>
  );
}

export default function App() {
  const [f, setF] = useState(AWAL);
  const [err, setErr] = useState({});
  const [lunas, setLunas] = useState(false);
  const [goyang, setGoyang] = useState(false);
  const [nomor, setNomor] = useState("");
  const [sekarang, setSekarang] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setSekarang(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const menu = MENU.find((m) => m.id === f.menu);
  const tambahan = TOPPING.filter((t) => f.topping.includes(t.id));
  const total = (menu.harga + tambahan.reduce((s, t) => s + t.harga, 0)) * f.jumlah;

  const set = (k, v) => {
    setF((p) => ({ ...p, [k]: v }));
    if (err[k]) setErr((p) => ({ ...p, [k]: undefined }));
  };
  const toggleTopping = (id) =>
    set("topping", f.topping.includes(id) ? f.topping.filter((t) => t !== id) : [...f.topping, id]);

  const kirim = (e) => {
    e.preventDefault();
    const baru = {};
    if (!f.nama.trim()) baru.nama = "Nama belum diisi";
    if (!f.meja.trim()) baru.meja = "Meja?";
    setErr(baru);
    if (Object.keys(baru).length) {
      setGoyang(true);
      setTimeout(() => setGoyang(false), 500);
      return;
    }
    setNomor("KS" + String(Math.floor(Math.random() * 9000) + 1000));
    setLunas(true);
  };

  const ulang = () => {
    setF(AWAL);
    setErr({});
    setLunas(false);
  };

  return (
    <>
      <div className="biji" aria-hidden="true">
        {BIJI.map((b, i) => (
          <span key={i} style={{ left: b.l, top: b.t }}>
            <Bean s={b.s} d={b.d} />
          </span>
        ))}
      </div>

      <main className="halaman">
        <div className="nota-wrap">
          <form className={`nota ${goyang ? "goyang" : ""}`} onSubmit={kirim} noValidate>
            <div className="meta">
              <span>NOTA PESANAN</span>
              <span>{lunas ? `No. ${nomor}` : waktu(sekarang)}</span>
            </div>

            <header className="kepala">
              <Cup warna={menu.warna} panas={f.panas} aktif={f.nama.trim().length > 0} />
              <h1>Warung Kopi Senja</h1>
              <p className="tag">Seduh pelan, ngobrol lama.</p>
              <p className="alamat">Jl. Sudirman No. 12 · Buka 07.00 – 22.00</p>
            </header>

            <div className="garis" />

            <div className="baris nama-meja">
              <div className="kolom">
                <label htmlFor="nama">Nama pemesan</label>
                <input
                  id="nama"
                  className={`fld ${err.nama ? "salah" : ""}`}
                  value={f.nama}
                  onChange={(e) => set("nama", e.target.value)}
                  placeholder="mis. Budi"
                  autoComplete="given-name"
                />
                {err.nama && <small className="pesan">{err.nama}</small>}
              </div>
              <div className="kolom">
                <label htmlFor="meja">Meja</label>
                <input
                  id="meja"
                  className={`fld ${err.meja ? "salah" : ""}`}
                  value={f.meja}
                  onChange={(e) => set("meja", e.target.value)}
                  placeholder="07"
                  inputMode="numeric"
                />
                {err.meja && <small className="pesan">{err.meja}</small>}
              </div>
            </div>

            <fieldset className="kolom">
              <legend>Pilih menu</legend>
              <div className="menu-grid">
                {MENU.map((m) => (
                  <label key={m.id} className={`kartu ${f.menu === m.id ? "aktif" : ""}`}>
                    <input type="radio" name="menu" className="sr" checked={f.menu === m.id} onChange={() => set("menu", m.id)} />
                    <i style={{ background: m.warna }} />
                    <b>{m.nama}</b>
                    <em>{m.ket}</em>
                    <span>{rupiah(m.harga)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="kolom">
              <legend>Suhu</legend>
              <div className="seg">
                {[
                  { v: true, t: "Panas" },
                  { v: false, t: "Dingin" },
                ].map((o) => (
                  <label key={o.t} className={f.panas === o.v ? "aktif" : ""}>
                    <input type="radio" name="suhu" className="sr" checked={f.panas === o.v} onChange={() => set("panas", o.v)} />
                    {o.t}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="kolom">
              <label htmlFor="gula">
                Level gula <b className="nilai">{GULA[f.gula]}</b>
              </label>
              <input
                id="gula"
                type="range"
                min="0"
                max="4"
                value={f.gula}
                style={{ "--p": `${f.gula * 25}%` }}
                onChange={(e) => set("gula", Number(e.target.value))}
              />
              <div className="kubus" aria-hidden="true">
                {Array.from({ length: f.gula }).map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            </div>

            <fieldset className="kolom">
              <legend>Tambahan</legend>
              <div className="chip-grup">
                {TOPPING.map((t) => (
                  <label key={t.id} className={`chip ${f.topping.includes(t.id) ? "aktif" : ""}`}>
                    <input type="checkbox" className="sr" checked={f.topping.includes(t.id)} onChange={() => toggleTopping(t.id)} />
                    {t.nama} <small>+{rupiah(t.harga)}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="baris dua">
              <div className="kolom">
                <label>Jumlah</label>
                <div className="stepper">
                  <button type="button" onClick={() => set("jumlah", Math.max(1, f.jumlah - 1))} aria-label="Kurangi">−</button>
                  <span>{f.jumlah}</span>
                  <button type="button" onClick={() => set("jumlah", Math.min(20, f.jumlah + 1))} aria-label="Tambah">+</button>
                </div>
              </div>
              <div className="kolom">
                <label htmlFor="catatan">Catatan</label>
                <input
                  id="catatan"
                  className="fld"
                  value={f.catatan}
                  onChange={(e) => set("catatan", e.target.value)}
                  placeholder="es dikit…"
                />
              </div>
            </div>

            <fieldset className="kolom">
              <legend>Pembayaran</legend>
              <div className="chip-grup">
                {BAYAR.map((b) => (
                  <label key={b} className={`chip ${f.bayar === b ? "aktif" : ""}`}>
                    <input type="radio" name="bayar" className="sr" checked={f.bayar === b} onChange={() => set("bayar", b)} />
                    {b}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="garis putus" />

            <section className="rincian" aria-live="polite">
              <div>
                <span>{f.jumlah}× {menu.nama} ({f.panas ? "panas" : "dingin"})</span>
                <i />
                <span>{rupiah(menu.harga * f.jumlah)}</span>
              </div>
              {tambahan.map((t) => (
                <div key={t.id}>
                  <span>{f.jumlah}× {t.nama}</span>
                  <i />
                  <span>{rupiah(t.harga * f.jumlah)}</span>
                </div>
              ))}
              <div className="total">
                <span>TOTAL</span>
                <i />
                <span key={total} className="pop">{rupiah(total)}</span>
              </div>
            </section>

            {!lunas ? (
              <button type="submit" className="tombol">Pesan Sekarang</button>
            ) : (
              <div className="aksi">
                <button type="button" className="tombol sekunder" onClick={ulang}>Pesan Lagi</button>
                <button type="button" className="tombol hantu" onClick={() => window.print()}>Cetak Nota</button>
              </div>
            )}

            {lunas && <Barcode kode={nomor} />}
            <p className="terima">~ Terima kasih, sering-sering mampir ya ~</p>

            {lunas && (
              <div className="stempel" role="status">
                LUNAS
                <small>{f.nama} · Meja {f.meja} · {f.bayar}</small>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}