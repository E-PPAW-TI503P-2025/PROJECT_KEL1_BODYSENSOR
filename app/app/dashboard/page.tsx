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
      {/* ✅ TOP BAR DIHAPUS — biar navbar tidak double (pakai navbar global/atas saja) */}

      <div style={styles.shell}>
        {/* ===== SIDEBAR ===== */}
        <aside style={styles.sidebar}>
          <div style={styles.brandBox}>
            <div style={styles.logo}>🏢</div>
            <div>
              <div style={styles.sideTitle}>SMART ROOM</div>
              <div style={styles.sideSub}>User Dashboard</div>
            </div>
          </div>

          <div style={styles.menuGroupLabel}>MENU</div>

          <button
            style={menuBtn(tab === "dashboard")}
            onClick={() => setTab("dashboard")}
          >
            <span style={styles.menuIcon}>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            style={menuBtn(tab === "rooms")}
            onClick={() => setTab("rooms")}
          >
            <span style={styles.menuIcon}>🚪</span>
            <span>Ruangan</span>
          </button>

          <button
            style={menuBtn(tab === "booking")}
            onClick={() => setTab("booking")}
          >
            <span style={styles.menuIcon}>📅</span>
            <span>Booking</span>
          </button>
        </aside>

        {/* ===== MAIN ===== */}
        <main style={styles.main}>
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.h1}>Dashboard Monitoring</h1>
              <p style={styles.lead}>
                Tampilan frontend sistem monitoring ruangan (UI only).
              </p>
            </div>

            {/* ✅ STATUS BADGE DIHAPUS */}
          </div>

          {error && (
            <div style={styles.alert}>
              <div style={{ fontWeight: 900 }}>Error</div>
              <div style={{ opacity: 0.95 }}>{error}</div>
            </div>
          )}

          {/* ===== STAT CARDS ===== */}
          <section style={styles.cards}>
            <Stat title="Total Ruangan" value={total} tone="info" />
            <Stat title="Tersedia" value={available} tone="success" />
            <Stat title="Full" value={full} tone="danger" />
          </section>

          {/* ===== CONTENT ===== */}
          {tab === "dashboard" && (
            <section style={styles.panel}>
              <PanelTitle
                title="Ringkasan Sistem"
                subtitle="Overview monitoring ruangan dan integrasi realtime."
              />
              <div style={styles.panelBody}>
                <EmptyState
                  title="Belum ada data realtime"
                  desc="Status ruangan akan tampil otomatis setelah terhubung dengan backend & sensor Arduino."
                />
              </div>
            </section>
          )}

          {tab === "rooms" && (
            <section style={styles.panel}>
              <PanelTitle
                title="Daftar Ruangan"
                subtitle="Informasi status dan device tiap ruangan."
              />
              <div style={styles.panelBody}>
                <EmptyState
                  title="Data ruangan belum tersedia"
                  desc="Menunggu integrasi endpoint ruangan."
                />
              </div>
            </section>
          )}

          {tab === "booking" && (
            <div style={styles.bookingGrid}>
              <section style={styles.panel}>
                <PanelTitle
                  title="Booking Ruangan"
                  subtitle="Form booking (nonaktif sampai data ruangan tersedia)."
                />

                <div style={styles.form}>
                  <Field label="Ruangan">
                    <select style={styles.input} disabled value="">
                      <option value="">Belum ada data ruangan</option>
                    </select>
                  </Field>

                  <div style={styles.form2col}>
                    <Field label="Start Time">
                      <input
                        type="datetime-local"
                        style={styles.input}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </Field>

                    <Field label="End Time">
                      <input
                        type="datetime-local"
                        style={styles.input}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </Field>
                  </div>

                  <button style={styles.submitBtn} disabled>
                    Booking (Nonaktif)
                  </button>

                  <div style={styles.note}>
                    💡 Aktifkan saat rooms sudah terisi dari backend.
                  </div>
                </div>
              </section>

              <section style={styles.panel}>
                <PanelTitle
                  title="History Booking"
                  subtitle="Riwayat pemesanan akan muncul di sini."
                />
                <div style={styles.panelBody}>
                  <EmptyState
                    title="Belum ada data booking"
                    desc="Riwayat booking akan tampil setelah integrasi backend."
                  />
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/** ===== SMALL COMPONENTS ===== */
function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={styles.panelHead}>
      <div>
        <div style={styles.h2}>{title}</div>
        {subtitle ? <div style={styles.subtle}>{subtitle}</div> : null}
      </div>
    </div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>⏳</div>
      <div>
        <div style={{ fontWeight: 900 }}>{title}</div>
        <div style={{ opacity: 0.75, marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

/** ===== UI HELPERS ===== */
function Stat({
  title,
  value,
  tone = "info",
}: {
  title: string;
  value: number;
  tone?: "info" | "success" | "danger";
}) {
  const toneMap = {
    info: { bar: TOKENS.primary, bg: "#ffffff" },
    success: { bar: TOKENS.success, bg: "#ffffff" },
    danger: { bar: TOKENS.danger, bg: "#ffffff" },
  } as const;

  const t = toneMap[tone];

  return (
    <div style={{ ...styles.statCard, background: t.bg }}>
      <div style={{ ...styles.statBar, background: t.bar }} />
      <div style={{ fontSize: 13, opacity: 0.75, fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6 }}>
        {value}
      </div>
    </div>
  );
}

function menuBtn(active: boolean): React.CSSProperties {
  return {
    ...styles.menuBtn,
    background: active ? "rgba(37, 99, 235, 0.10)" : "transparent",
    borderColor: active ? "rgba(37, 99, 235, 0.25)" : "transparent",
    color: active ? TOKENS.text : TOKENS.muted,
  };
}

/** ===== DESIGN TOKENS ===== */
const TOKENS = {
  bg: "#f4f7fb",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#475569",
  border: "rgba(15, 23, 42, 0.08)",
  shadow: "0 10px 30px rgba(2, 6, 23, 0.08)",
  radius: 16,
  primary: "#2563eb",
  success: "#16a34a",
  danger: "#ef4444",
};

/** ===== STYLES ===== */
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: TOKENS.bg, color: TOKENS.text },

  shell: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    alignItems: "start",
  },

  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    background: TOKENS.card,
    padding: 16,
    borderRight: `1px solid ${TOKENS.border}`,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  brandBox: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: TOKENS.radius,
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(14,165,233,0.08))",
    border: `1px solid ${TOKENS.border}`,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    background: TOKENS.primary,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 12px 18px rgba(37,99,235,0.25)",
  },
  sideTitle: { fontWeight: 900, letterSpacing: -0.3 },
  sideSub: { fontSize: 12, opacity: 0.7 },

  menuGroupLabel: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: 900,
    opacity: 0.55,
    marginTop: 6,
    marginBottom: 2,
  },

  menuBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 900,
    textAlign: "left",
    transition: "all 120ms ease",
    background: "transparent",
  },
  menuIcon: { width: 24, textAlign: "center" as const },

  main: {
    padding: 22,
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
  },

  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  h1: { margin: 0, fontSize: 26, letterSpacing: -0.6 },
  lead: { marginTop: 6, marginBottom: 0, opacity: 0.7 },

  alert: {
    marginTop: 16,
    padding: 14,
    borderRadius: TOKENS.radius,
    background: "rgba(239, 68, 68, 0.10)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  },

  statCard: {
    position: "relative",
    background: TOKENS.card,
    padding: 16,
    borderRadius: TOKENS.radius,
    border: `1px solid ${TOKENS.border}`,
    boxShadow: "0 10px 20px rgba(2,6,23,0.06)",
    overflow: "hidden",
  },
  statBar: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 8,
    height: "100%",
    opacity: 0.95,
  },

  panel: {
    marginTop: 14,
    background: TOKENS.card,
    padding: 16,
    borderRadius: TOKENS.radius,
    border: `1px solid ${TOKENS.border}`,
    boxShadow: TOKENS.shadow,
  },
  panelHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 12,
    borderBottom: `1px solid ${TOKENS.border}`,
  },
  panelBody: { paddingTop: 14 },

  h2: { fontSize: 16, fontWeight: 900, letterSpacing: -0.2 },
  subtle: { fontSize: 13, opacity: 0.7, marginTop: 4 },

  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  },

  form: { paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 },
  form2col: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 900, opacity: 0.8 },

  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 14,
    border: `1px solid ${TOKENS.border}`,
    outline: "none",
    background: "#fff",
    fontSize: 14,
  },

  submitBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(15, 23, 42, 0.10)",
    background: "rgba(148, 163, 184, 0.65)",
    color: "#0b1220",
    fontWeight: 900,
    cursor: "not-allowed",
  },

  note: { fontSize: 12, opacity: 0.75 },

  empty: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: TOKENS.radius,
    border: `1px dashed rgba(15, 23, 42, 0.18)`,
    background: "rgba(15, 23, 42, 0.02)",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "rgba(37,99,235,0.10)",
    border: "1px solid rgba(37,99,235,0.20)",
  },
};
