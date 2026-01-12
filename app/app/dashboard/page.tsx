"use client";
import React, { useEffect, useMemo, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type Room = {
  id: number;
  name: string;
  deviceId: string | null;
  isOccupied: boolean;       // true=FULL, false=TERSEDIA
  lastMotion: string | null; // ISO
};

type Booking = {
  id: number;
  roomId: number;
  userId: number;
  startTime: string;
  endTime: string;
  room?: { id: number; name: string };
};

type Tab = "rooms" | "booking";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fullCount = useMemo(() => rooms.filter(r => r.isOccupied).length, [rooms]);
  const tersediaCount = Math.max(rooms.length - fullCount, 0);

  const loadRooms = async () => {
    try {
      const data = await http<Room[]>("/rooms");
      setRooms(data);
      if (selectedRoomId === "" && data.length) setSelectedRoomId(data[0].id);
    } catch (e: any) {
      setError(e?.message ?? "Gagal load rooms");
    }
  };

  const loadBookings = async () => {
    try {
      const data = await http<Booking[]>("/bookings?me=true");
      setBookings(data);
    } catch (e: any) {
      setError(e?.message ?? "Gagal load bookings");
    }
  };

  useEffect(() => {
    loadRooms();
    loadBookings();
    const id = setInterval(loadRooms, 5000); // polling realtime status
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitBooking = async () => {
    setError(null);
    if (selectedRoomId === "") return setError("Pilih ruangan dulu.");
    if (!startTime || !endTime) return setError("Start & End wajib diisi.");

    const s = new Date(startTime);
    const e = new Date(endTime);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return setError("Format tanggal tidak valid.");
    if (e <= s) return setError("End harus lebih besar dari Start.");

    try {
      await http("/bookings", {
        method: "POST",
        body: JSON.stringify({ roomId: Number(selectedRoomId), startTime: s.toISOString(), endTime: e.toISOString() }),
      });
      alert("Booking berhasil!");
      setStartTime("");
      setEndTime("");
      setTab("booking");
      loadBookings();
      loadRooms();
    } catch (e: any) {
      setError(e?.message ?? "Booking gagal");
    }
  };

  return (
    <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>Dashboard User - Smart Room Occupancy</h1>
      <p style={{ opacity: 0.75, marginTop: 6 }}>
        Status: <b>TERSEDIA</b> / <b>FULL</b> (update tiap 5 detik)
      </p>

      {error && (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 12, border: "1px solid #ffb3b3", background: "#fff2f2" }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <span style={chip}>Total: {rooms.length}</span>
        <span style={chip}>TERSEDIA: {tersediaCount}</span>
        <span style={chip}>FULL: {fullCount}</span>
        <button style={btnGhost} onClick={() => { loadRooms(); loadBookings(); }}>Refresh</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button style={tabBtn(tab === "rooms")} onClick={() => setTab("rooms")}>Daftar Ruangan</button>
        <button style={tabBtn(tab === "booking")} onClick={() => setTab("booking")}>Booking & History</button>
      </div>

      {tab === "rooms" && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Daftar Ruangan</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {rooms.map((r) => (
              <div key={r.id} style={roomCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>Device: <b>{r.deviceId ?? "-"}</b></div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      Last motion: <b>{r.lastMotion ? new Date(r.lastMotion).toLocaleString() : "-"}</b>
                    </div>
                  </div>
                  <span style={badge(r.isOccupied)}>{r.isOccupied ? "FULL" : "TERSEDIA"}</span>
                </div>
                <button
                  style={btnPrimary}
                  disabled={r.isOccupied}
                  onClick={() => { setSelectedRoomId(r.id); setTab("booking"); }}
                >
                  {r.isOccupied ? "FULL (Tidak bisa booking)" : "Booking"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "booking" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Booking Ruangan</h2>
            <label style={label}>Ruangan (hanya TERSEDIA)</label>
            <select style={input} value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="" disabled>Pilih ruangan</option>
              {rooms.filter(r => !r.isOccupied).map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <label style={label}>Start Time</label>
            <input style={input} type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

            <label style={label}>End Time</label>
            <input style={input} type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <button style={btnPrimary} onClick={submitBooking}>Buat Booking</button>
          </div>

          <div style={card}>
            <h2 style={{ marginTop: 0 }}>History Booking</h2>
            {bookings.length === 0 ? (
              <div style={{ opacity: 0.7 }}>Belum ada booking.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Room</th>
                      <th style={th}>Start</th>
                      <th style={th}>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice().sort((a,b)=>a.startTime<b.startTime?1:-1).map(b => (
                      <tr key={b.id}>
                        <td style={td}>{b.room?.name ?? `Room #${b.roomId}`}</td>
                        <td style={td}>{new Date(b.startTime).toLocaleString()}</td>
                        <td style={td}>{new Date(b.endTime).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** ===== simple styles ===== */
const card: React.CSSProperties = { marginTop: 12, border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, background: "#fff" };
const roomCard: React.CSSProperties = { border: "1px solid #e5e5e5", borderRadius: 16, padding: 14, background: "#fff", display: "grid", gap: 10 };
const chip: React.CSSProperties = { padding: "6px 10px", borderRadius: 999, border: "1px solid #ddd", background: "#f6f6f6", fontSize: 12 };
const btnGhost: React.CSSProperties = { padding: "8px 12px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const btnPrimary: React.CSSProperties = { padding: "10px 12px", borderRadius: 12, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" };
const label: React.CSSProperties = { display: "block", fontSize: 12, opacity: 0.8, marginTop: 10, marginBottom: 6 };
const input: React.CSSProperties = { width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" };
const th: React.CSSProperties = { textAlign: "left", padding: 10, borderBottom: "1px solid #eee", fontSize: 13, opacity: 0.8 };
const td: React.CSSProperties = { padding: 10, borderBottom: "1px solid #f2f2f2", fontSize: 14 };

function tabBtn(active: boolean): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#111",
    cursor: "pointer",
  };
}

function badge(full: boolean): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #ddd",
    background: full ? "#fff2f2" : "#eaffea",
    height: "fit-content",
  };
}
