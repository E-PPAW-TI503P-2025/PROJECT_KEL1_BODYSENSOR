"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity, Users, AlertCircle, BatteryCharging,
  RefreshCcw, WifiOff, Plus, Trash2, Edit, X, Save
} from "lucide-react";

// --- KONFIGURASI API ---
const API_BASE = "http://localhost:8000/api";
const ADMIN_URL = `${API_BASE}/admin`; // POST/PUT/DELETE go to /api/admin/rooms
const ROOMS_URL = `${API_BASE}/rooms`; // GET list of rooms

// 1. DEFINISI TIPE DATA
interface Sensor {
  id: string;               // unique id used by frontend (prefer room numeric id as string)
  roomId?: number;          // numeric DB id
  deviceId?: string;        // device identifier (ESP32 id)
  location: string;         // maps to Room.name
  status: string;           // "Active" | "Inactive"
  motionDetected: boolean;  // maps to Room.isOccupied
  battery: number;          // client-side only, persisted in localStorage per device
  capacity?: number;
  lastUpdate: string;       // ISO String, maps to Room.lastMotion
}

export default function AdminDashboardPage() {
  // --- STATE UTAMA ---
  const [sensorData, setSensorData] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE CRUD (MODAL & FORM) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Penanda sedang mode Edit atau Create

  // State untuk form input
  const [formData, setFormData] = useState<Partial<Sensor>>({
    id: "",
    roomId: undefined,
    deviceId: "",
    location: "",
    status: "Inactive",
    motionDetected: false,
    battery: 100,
    capacity: 1
  });

  // 2. FUNGSI FETCH DATA (GET)
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(ROOMS_URL);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();

      // helper to read battery levels from localStorage per device
      const batteryStore = JSON.parse(localStorage.getItem('batteryLevels') || '{}');

      // Map backend Room model to our Sensor interface
      const mapped: Sensor[] = data.map((r: any) => ({
        id: String(r.id),
        roomId: r.id,
        deviceId: r.deviceId ?? String(r.id),
        location: r.name,
        status: r.isOccupied ? 'Active' : 'Inactive',
        motionDetected: !!r.isOccupied,
        battery: batteryStore[r.deviceId ?? String(r.id)] ?? 100,
        capacity: r.capacity ?? 1,
        lastUpdate: r.lastMotion ? new Date(r.lastMotion).toISOString() : new Date().toISOString()
      }));

      setSensorData(mapped);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Gagal terhubung ke Backend. Pastikan port 8000 menyala.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. FUNGSI SUBMIT (CREATE & UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Persiapkan payload sesuai schema backend (Room)
      const payload: any = {
        name: formData.location,
        deviceId: formData.deviceId ?? formData.id,
        // capacity is required on create; default ke 1 jika tidak diisi
        capacity: (formData as any).capacity ?? 1
      };

      let url = `${ADMIN_URL}/rooms`;
      let method: 'POST' | 'PUT' = 'POST';

      // Untuk update, backend membutuhkan numeric room ID di path
      if (isEditing) {
        const roomId = formData.roomId ?? parseInt(String(formData.id));
        url = `${ADMIN_URL}/rooms/${roomId}`;
        method = 'PUT';
        // allow updating occupation state too
        payload.isOccupied = !!formData.motionDetected;
        payload.lastMotion = new Date().toISOString();
      }

      // Validate capacity
      if (!payload.capacity || payload.capacity < 1) payload.capacity = 1;

      // include occupancy info derived from status/motion selection
      payload.isOccupied = (formData.status === 'Active') || !!formData.motionDetected;
      if (payload.isOccupied) payload.lastMotion = new Date().toISOString();

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errBody: any = {};
        try { errBody = await response.json(); } catch (e) { /* ignore */ }
        const msg = errBody?.error || errBody?.message || `Server Error: ${response.status}`;
        throw new Error(msg);
      }

      // Persist battery for this device in localStorage
      const deviceKey = formData.deviceId ?? formData.id;
      if (deviceKey) {
        const batteryStore = JSON.parse(localStorage.getItem('batteryLevels') || '{}');
        batteryStore[deviceKey] = formData.battery ?? 100;
        localStorage.setItem('batteryLevels', JSON.stringify(batteryStore));
      }

      // Sukses
      await fetchData(); // Refresh data
      setIsModalOpen(false); // Tutup modal
      alert(isEditing ? "Data berhasil diupdate!" : "Sensor baru berhasil ditambahkan!");

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Error: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. FUNGSI DELETE
  const handleDelete = async (sensor: Sensor) => {
    if (!confirm("Yakin ingin menghapus sensor ini?")) return;

    try {
      const roomId = sensor.roomId ?? parseInt(sensor.id);
      const response = await fetch(`${ADMIN_URL}/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Gagal menghapus");

      // Remove battery store if any
      const deviceKey = sensor.deviceId ?? sensor.id;
      if (deviceKey) {
        const batteryStore = JSON.parse(localStorage.getItem('batteryLevels') || '{}');
        delete batteryStore[deviceKey];
        localStorage.setItem('batteryLevels', JSON.stringify(batteryStore));
      }

      await fetchData(); // Refresh list
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Gagal menghapus sensor: " + msg);
    }
  };

  // --- HELPER UNTUK MEMBUKA MODAL ---
  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      roomId: undefined,
      deviceId: "",
      location: "",
      status: "Inactive",
      motionDetected: false,
      battery: 100,
      capacity: 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sensor: Sensor) => {
    setIsEditing(true);
    // Ensure status and motionDetected are consistent when loading into form
    setFormData({
      ...sensor,
      status: sensor.status ?? (sensor.motionDetected ? 'Active' : 'Inactive'),
      motionDetected: sensor.status === 'Active' ? true : !!sensor.motionDetected
    });
    setIsModalOpen(true);
  };

  // 5. EFFECT: Auto Refresh
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    try {
      return new Date(isoString).toLocaleTimeString("id-ID", {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) { return "-" }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Monitoring</h1>
            <p className="text-slate-500 mt-1">Status Real-time & CRUD System</p>
          </div>

          <div className="flex gap-3">
            {/* Tombol Tambah */}
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Sensor
            </button>

            {/* Tombol Refresh */}
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-sm font-medium text-sm disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* --- ERROR ALERT --- */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* --- STATISTIK RINGKASAN (Sama seperti sebelumnya) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sensor Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800">{sensorData.filter(s => s.status === "Active").length} / {sensorData.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Terdeteksi Gerakan</p>
              <h3 className="text-2xl font-bold text-slate-800">{sensorData.filter(s => s.motionDetected).length} Ruangan</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg"><AlertCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sensor Offline</p>
              <h3 className="text-2xl font-bold text-slate-800">{sensorData.filter(s => s.status === "Inactive").length} Unit</h3>
            </div>
          </div>
        </div>

        {/* --- GRID STATUS SENSOR --- */}
        {isLoading && sensorData.length === 0 ? (
          <div className="text-center py-10 text-slate-400 animate-pulse">Sedang memuat data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensorData.map((sensor) => (
              <div key={sensor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">

                {/* Header Card dengan Tombol Edit & Delete (Muncul saat Hover) */}
                <div className="relative p-5 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 leading-tight">{sensor.location}</h3>
                      <span className="text-xs text-slate-400 font-mono mt-1 block">ID: {sensor.roomId} {sensor.deviceId ? `• ${sensor.deviceId}` : ''}</span>
                    </div>
                    {/* Badge Status */}
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${sensor.status === 'Inactive' ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : sensor.motionDetected ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                      {sensor.status === 'Inactive' ? 'OFFLINE' : (sensor.motionDetected ? 'ADA ORANG' : 'KOSONG')}
                    </span>
                  </div>

                  {/* Action Buttons (Absolute Top Right) */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                    <button onClick={() => openEditModal(sensor)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(sensor)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="px-5 py-3">
                  <div className="h-px bg-slate-100 mb-3"></div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <BatteryCharging className={`w-4 h-4 ${sensor.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className={sensor.battery < 20 ? 'text-red-600 font-bold' : ''}>{sensor.battery}%</span>
                    </div>
                    <div className="text-slate-400 text-xs">Updated: {formatTime(sensor.lastUpdate)}</div>
                  </div>
                </div>

                {/* Color Bar Indikator */}
                <div className={`h-1.5 w-full ${sensor.status === 'Inactive' ? 'bg-slate-300' :
                  sensor.motionDetected ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* --- MODAL (CREATE & EDIT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? `Edit Sensor: ${formData.deviceId ?? formData.id ?? formData.roomId}` : "Tambah Sensor Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Input ID (Hanya bisa diedit saat Create) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Sensor (Device ID)</label>
                <input
                  type="text" required
                  disabled={isEditing}
                  placeholder="Cth: ESP32_001"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  value={formData.deviceId ?? formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value, deviceId: e.target.value })}
                />
              </div>

              {/* Input Lokasi */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                <input
                  type="text" required
                  placeholder="Cth: Gudang Utama"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Capacity (required by backend) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                <input
                  type="number" min={1} required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.capacity ?? 1}
                  onChange={(e) => setFormData({ ...formData, capacity: Math.max(1, parseInt(e.target.value || '1')) })}
                />
              </div>

              {/* Slider Baterai */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Level Baterai</label>
                  <span className="text-sm font-bold text-blue-600">{formData.battery}%</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  value={formData.battery}
                  onChange={(e) => setFormData({ ...formData, battery: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                  {isSubmitting ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}