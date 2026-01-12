"use client";
import React, { useState } from "react";

/** ===== Type Data (REAL DATA NANTI DARI BACKEND / ARDUINO) ===== */
type Room = {
  id: number;
  name: string;
  status: "FULL" | "TERSEDIA";
};

export default function DashboardUI() {
  /** 🔥 DATA KOSONG DULU */
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tab, setTab] = useState<"dashboard" | "rooms">("dashboard");

  /** 🔢 Statistik (AMAN walau data kosong) */
  const total = rooms.length;
  const full = rooms.filter((r) => r.status === "FULL").length;
  const available = total - full;

  return (
    <div style={styles.page}>
      {/* ===== Sidebar ===== */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
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

        <div style={{ flex: 1 }} />

        <button style={styles.logout}>⏏ Logout</button>
      </aside>

      {/* ===== Main ===== */}
      <main style={styles.main}>
        <h1 style={{ margin: 0 }}>Dashboard Monitoring</h1>
        <p style={{ opacity: 0.7 }}>
          Status ruangan akan update otomatis dari sensor (Arduino)
        </p>

        {/* ===== Cards ===== */}
        <section style={styles.cards}>
          <Stat title="Total Ruangan" value={total} />
          <Stat title="Tersedia" value={available} color="#22c55e" />
          <Stat title="Full" value={full} color="#ef4444" />
        </section>

        {/* ===== Content ===== */}
        {tab === "rooms" && (
          <section style={styles.panel}>
            <h2>Daftar Ruangan</h2>

            {rooms.length === 0 ? (
              <p style={{ opacity: 0.6 }}>
                ⏳ Menunggu data dari sistem monitoring ruangan...
              </p>
            ) : (
              <div style={styles.roomGrid}>
                {rooms.map((room) => (
                  <div key={room.id} style={styles.roomCard}>
                    <b>{room.name}</b>
                    <span style={badge(room.status)}>{room.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

/** ===== Components ===== */
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

function badge(status: "FULL" | "TERSEDIA"): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: status === "FULL" ? "#fee2e2" : "#dcfce7",
    color: status === "FULL" ? "#991b1b" : "#166534",
    marginTop: 8,
    display: "inline-block",
  };
}

/** ===== Styles ===== */
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    minHeight: "100vh",
    background: "#f0f9ff",
  },
  sidebar: {
    background: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderRight: "1px solid #e5e7eb",
  },
  brand: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    background: "#e0f2fe",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    display: "grid",
    placeItems: "center",
  },
  logout: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
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
  roomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  roomCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "#f8fafc",
  },
};
