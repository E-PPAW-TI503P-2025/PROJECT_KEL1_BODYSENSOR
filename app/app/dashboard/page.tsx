"use client";
import React, { useMemo, useState } from "react";

/** ===== Types (SIAP UNTUK DATA REAL NANTI) ===== */
type Room = {
  id: number;
  name: string;
  deviceId?: string | null;
  isOccupied?: boolean;
  lastMotion?: string | null;
};

type Booking = {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
  room?: { id: number; name: string };
};

type Tab = "dashboard" | "rooms" | "booking";

export default function DashboardPage() {
  /** ===== STATE (KOSONG DULU – UI ONLY) ===== */
  const [tab, setTab] = useState<Tab>("dashboard");
  const [rooms] = useState<Room[]>([]);
  const [bookings] = useState<Booking[]>([]);
  const [error] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /** ===== Derived Stats (AMAN walau kosong) ===== */
  const total = rooms.length;
  const full = useMemo(() => rooms.filter((r) => r.isOccupied).length, [rooms]);
  const available = Math.max(total - full, 0);

  const availableRooms = useMemo(
    () => rooms.filter((r) => !r.isOccupied),
    [rooms]
  );

  return (
    <div style={styles.page}>
      {/* ===== TOP BAR ===== */}
      <header style={styles.topbar}>
        <div style={styles.topbrand}>
          ⚙️ <b>Smart<span style={{ opacity: 0.7 }}>Room</span></b>
        </div>
        <nav style={styles.topnav}>
          <span style={styles.toplink}>Home</span>
          <span style={styles.toplink}>About</span>
          <button style={styles.topbtn}>Register</button>
        </nav>
      </header>

      <div style={styles.body}>
        {/* ===== SIDEBAR ===== */}
        <aside style={styles.sidebar}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>🏢</div>
            <div>
              <b>SMART ROOM</b>
              <div style={{ fontSize: 12, opacity: 0.7 }}>User Dashboard</div>
            </div>
          </div>

          <button style={menuBtn(tab === "dashboard")} onClick={() => setTab("dashboard")}>
            📊 Dashboard
          </button>
          <button style={menuBtn(tab === "rooms")} onClick={() => setTab("rooms")}>
            🚪 Ruangan
          </button>
          <button style={menuBtn(tab === "booking")} onClick={() => setTab("booking")}>
            📅 Booking
          </button>
        </aside>

        {/* ===== MAIN ===== */}
        <main style={styles.main}>
          <h1 style={{ margin: 0 }}>Dashboard Monitoring</h1>
          <p style={{ opacity: 0.7 }}>
            Tampilan frontend sistem monitoring ruangan (UI Only)
          </p>

          {error && (
            <div style={styles.alert}>
              <b>Error:</b> {error}
            </div>
          )}

          {/* ===== STAT CARDS ===== */}
          <section style={styles.cards}>
            <Stat title="Total Ruangan" value={total} />
            <Stat title="Tersedia" value={available} color="#22c55e" />
            <Stat title="Full" value={full} color="#ef4444" />
          </section>

          {/* ===== DASHBOARD ===== */}
          {tab === "dashboard" && (
            <section style={styles.panel}>
              <h2>Ringkasan Sistem</h2>
              <p style={{ opacity: 0.7 }}>
                Data status ruangan akan ditampilkan secara realtime setelah
                terhubung dengan sensor Arduino & backend.
              </p>
            </section>
          )}

          {/* ===== ROOMS ===== */}
          {tab === "rooms" && (
            <section style={styles.panel}>
              <h2>Daftar Ruangan</h2>
              <p style={{ opacity: 0.6 }}>
                ⏳ Data ruangan belum tersedia (menunggu integrasi backend)
              </p>
            </section>
          )}

          {/* ===== BOOKING ===== */}
          {tab === "booking" && (
            <div style={styles.bookingGrid}>
              <section style={styles.panel}>
                <h2>Booking Ruangan</h2>

                <label style={styles.label}>Ruangan</label>
                <select style={styles.input} disabled>
                  <option>Belum ada data ruangan</option>
                </select>

                <label style={styles.label}>Start Time</label>
                <input
                  type="datetime-local"
                  style={styles.input}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />

                <label style={styles.label}>End Time</label>
                <input
                  type="datetime-local"
                  style={styles.input}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />

                <button style={styles.submitBtn} disabled>
                  Booking (Nonaktif)
                </button>
              </section>

              <section style={styles.panel}>
                <h2>History Booking</h2>
                <p style={{ opacity: 0.6 }}>
                  Belum ada data booking.
                </p>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/** ===== UI HELPERS ===== */
function Stat({ title, value, color = "#3b82f6" }: any) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `6px solid ${color}` }}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function menuBtn(active: boolean): React.CSSProperties {
  return {
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: active ? "#e0f2fe" : "transparent",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
  };
}

/** ===== STYLES ===== */
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eaf6ff" },
  topbar: {
    height: 64,
    background: "#183a4d",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 22px",
  },
  topbrand: { display: "flex", alignItems: "center", gap: 8, fontSize: 18 },
  topnav: { display: "flex", alignItems: "center", gap: 18 },
  toplink: { cursor: "pointer", opacity: 0.9 },
  topbtn: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "none",
    background: "#214b64",
    color: "#fff",
    fontWeight: 700,
  },
  body: { display: "grid", gridTemplateColumns: "260px 1fr" },
  sidebar: {
    background: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderRight: "1px solid #e5e7eb",
  },
  brandBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    background: "#e0f2fe",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#3b82f6",
    color: "#fff",
    display: "grid",
    placeItems: "center",
  },
  main: { padding: 24 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
  },
  panel: {
    marginTop: 24,
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
  },
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  label: { fontSize: 12, marginTop: 10, fontWeight: 700 },
  input: { width: "100%", padding: 10, borderRadius: 12, border: "1px solid #e5e7eb" },
  submitBtn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#9ca3af",
    color: "#fff",
    fontWeight: 800,
  },
};
