"use client";
import React, { useState, useEffect, useMemo } from "react";  
import { useRouter } from "next/navigation";

/** ===== CONFIG ===== */
const BASE_URL = "http://localhost:8000";

/** ===== TYPES ===== */
type Room = {
  id: number;
  name: string;
  capacity: number;
  deviceId: string;
  isOccupied: boolean;
  lastMotion: string | null;
  bookings: any[];
};

type Booking = {
  id: number;
  userId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  room?: { name: string };
};

export default function DashboardPage() {
  const router = useRouter();
  
  /** ===== STATE ===== */
  const [activeTab, setActiveTab] = useState<"monitoring" | "booking">("monitoring");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Booking State
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  /** ===== FETCH DATA ===== */
  const fetchData = async (userId: number) => {
    try {
      const [resRooms, resBookings] = await Promise.all([
        fetch(`${BASE_URL}/api/rooms`),
        fetch(`${BASE_URL}/api/bookings?userId=${userId}`)
      ]);

      if (!resRooms.ok) throw new Error("Gagal mengambil data ruangan");
      
      const dataRooms = await resRooms.json();
      const dataBookings = await resBookings.json();

      setRooms(dataRooms);
      setBookings(dataBookings.bookings || []);
      setError(null);
    } catch (err: any) {
      setError("Gagal sinkronisasi data. Pastikan Backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  /** ===== PROTEKSI HALAMAN (SECURITY GUARD) ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUserId(userData.id);
        
        fetchData(userData.id);
        
        // Set interval untuk update realtime tiap 5 detik
        const interval = setInterval(() => {
          fetchData(userData.id);
        }, 5000);

        return () => clearInterval(interval);
      } catch (e) {
        // Jika data di localStorage korup, hapus dan pindah ke login
        localStorage.clear();
        router.push("/login");
      }
    }
  }, [router]);

  /** ===== SUBMIT BOOKING ===== */
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !startTime || !endTime || !currentUserId) return alert("Mohon lengkapi semua data!");

    try {
      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          roomId: Number(selectedRoomId),
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal membuat booking");

      alert("Booking Berhasil!");
      setSelectedRoomId("");
      setStartTime("");
      setEndTime("");
      fetchData(currentUserId);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  /** ===== LOGOUT FUNCTION ===== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); 
  };

  /** ===== UI LOGIC ===== */
  const stats = useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => !r.isOccupied).length,
    occupied: rooms.filter(r => r.isOccupied).length
  }), [rooms]);

  // Tampilan Loading sederhana saat mengecek sesi
  if (loading && !rooms.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-grey font-sans text-brand-dark">
        <p className="animate-pulse font-bold text-xl">Memverifikasi akses anda...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <nav style={styles.sidebar}>
        <div style={styles.brand}>🏢 SMART ROOM</div>
        <div style={styles.menuList}>
          <button 
            style={activeTab === "monitoring" ? styles.menuBtnActive : styles.menuBtn} 
            onClick={() => setActiveTab("monitoring")}
          >
            📊 Monitoring
          </button>
          <button 
            style={activeTab === "booking" ? styles.menuBtnActive : styles.menuBtn} 
            onClick={() => setActiveTab("booking")}
          >
            📅 Reservasi
          </button>
        </div>

        <div style={{marginTop: 'auto'}}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Dashboard User</h1>
          <p>Status Ruangan Real-Time dari IoT Kelompok 1</p>
        </header>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <section style={styles.statsGrid}>
          <Card title="Total Ruangan" value={stats.total} color="#2563eb" />
          <Card title="Tersedia" value={stats.available} color="#16a34a" />
          <Card title="Terisi" value={stats.occupied} color="#ef4444" />
        </section>

        {activeTab === "monitoring" && (
          <div style={styles.panel}>
            <h3>Monitoring Sensor</h3>
            <div style={styles.roomGrid}>
              {rooms.map(room => (
                <div key={room.id} style={roomCardStyle(room.isOccupied)}>
                  <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{room.name}</div>
                  <div style={{fontSize: '0.8rem', color: '#64748b'}}>ID Device: {room.deviceId}</div>
                  <div style={{
                    marginTop: 10, 
                    fontWeight: 'bold', 
                    color: room.isOccupied ? '#ef4444' : '#16a34a'
                  }}>
                    {room.isOccupied ? "🔴 Terdeteksi Orang" : "🟢 Ruangan Kosong"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div style={styles.bookingContainer}>
            <div style={styles.panel}>
              <h3>Reservasi Baru</h3>
              <form onSubmit={handleBooking} style={styles.form}>
                <label style={styles.label}>Pilih Ruang</label>
                <select 
                  style={styles.input} 
                  value={selectedRoomId} 
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                >
                  <option value="">-- Pilih --</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <div style={styles.row}>
                  <div style={{flex: 1}}>
                    <label style={styles.label}>Mulai</label>
                    <input type="datetime-local" style={styles.input} value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={styles.label}>Selesai</label>
                    <input type="datetime-local" style={styles.input} value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>
                <button type="submit" style={styles.submitBtn}>Booking Ruangan</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper components dan styles (seperti kode sebelumnya)
function Card({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div style={{...styles.statCard, borderTop: `4px solid ${color}`}}>
      <div style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>{title}</div>
      <div style={{fontSize: '1.8rem', fontWeight: 'bold', marginTop: 5}}>{value}</div>
    </div>
  );
}

const roomCardStyle = (isOccupied: boolean): React.CSSProperties => ({
  padding: '20px',
  borderRadius: '12px',
  background: isOccupied ? '#fff1f2' : '#ffffff',
  border: `1px solid ${isOccupied ? '#fecaca' : '#e2e8f0'}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
});

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1e293b', color: '#fff', padding: '24px', display: 'flex', flexDirection: 'column' },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '40px', color: '#38bdf8' },
  menuList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  menuBtn: { padding: '12px', textAlign: 'left', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' },
  menuBtnActive: { padding: '12px', textAlign: 'left', background: '#334155', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' },
  logoutBtn: { width: '100%', padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' },
  main: { flex: 1, padding: '32px', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  errorAlert: { padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  statCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  panel: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  roomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' },
  bookingContainer: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' },
  label: { fontSize: '0.85rem', fontWeight: '600' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' },
  row: { display: 'flex', gap: '12px' },
  submitBtn: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
};