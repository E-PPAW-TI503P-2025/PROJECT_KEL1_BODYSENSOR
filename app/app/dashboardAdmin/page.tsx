"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Activity, Users, AlertCircle, BatteryCharging, RefreshCcw, WifiOff } from "lucide-react";

// 1. DEFINISI TIPE DATA (Wajib agar TypeScript tidak marah)
interface Sensor {
  id: string;
  location: string;
  status: string;       // "Active" | "Inactive"
  motionDetected: boolean;
  battery: number;
  lastUpdate: string;   // ISO String dari Database
}

export default function AdminDashboardPage() {
  // State Management yang lebih lengkap
  const [sensorData, setSensorData] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. FUNGSI FETCH DATA (Ke Backend Elysia Port 8000)
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // GANTI URL INI JIKA SUDAH DEPLOY. Saat dev pakai localhost:8080
      const response = await fetch('http://localhost:8000/rooom'); 
      
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSensorData(data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal terhubung ke Backend (Port 8000). Pastikan backend menyala.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. EFFECT: Jalankan saat load & Auto Refresh tiap 5 detik
  useEffect(() => {
    fetchData(); // Load pertama

    const intervalId = setInterval(() => {
      fetchData(); // Load berulang (polling)
    }, 5000); // 5000ms = 5 detik

    return () => clearInterval(intervalId); // Bersihkan interval saat pindah halaman
  }, [fetchData]);

  // --- HELPER: Format Tanggal ---
  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Monitoring</h1>
            <p className="text-slate-500 mt-1">
              Status Real-time &bull; Auto-refresh setiap 5 detik
            </p>
          </div>
          
          <button 
            onClick={fetchData} 
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-sm font-medium text-sm disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Memuat...' : 'Refresh Manual'}
          </button>
        </div>

        {/* --- ERROR ALERT (Jika Backend Mati) --- */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* --- STATISTIK RINGKASAN --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Aktif */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sensor Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {sensorData.filter(s => s.status === "Active").length} 
                <span className="text-slate-400 text-lg font-normal"> / {sensorData.length || 0}</span>
              </h3>
            </div>
          </div>

          {/* Card 2: Terdeteksi Gerakan */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Terdeteksi Gerakan</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {sensorData.filter(s => s.motionDetected).length} <span className="text-sm font-normal text-slate-500">Ruangan</span>
              </h3>
            </div>
          </div>

          {/* Card 3: Offline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sensor Offline</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {sensorData.filter(s => s.status === "Inactive").length} <span className="text-sm font-normal text-slate-500">Unit</span>
              </h3>
            </div>
          </div>
        </div>

        {/* --- GRID STATUS SENSOR --- */}
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Status Perangkat & Ruangan
        </h2>
        
        {/* Loading Skeleton jika data kosong saat pertama load */}
        {isLoading && sensorData.length === 0 ? (
          <div className="text-center py-10 text-slate-400 animate-pulse">Sedang menghubungkan ke sensor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sensorData.map((sensor) => (
              <div key={sensor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
                
                {/* Indikator Warna Header Card */}
                <div className={`h-1.5 w-full ${
                  sensor.status === 'Inactive' ? 'bg-slate-300' : 
                  sensor.motionDetected ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 leading-tight">{sensor.location}</h3>
                      <span className="text-xs text-slate-400 font-mono mt-1 block">ID: {sensor.id}</span>
                    </div>
                    
                    {/* Badge Status */}
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                      sensor.status === 'Inactive' 
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : sensor.motionDetected 
                          ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' // Efek kedip
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      {sensor.status === 'Inactive' ? 'OFFLINE' : (sensor.motionDetected ? 'ADA ORANG' : 'KOSONG')}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 my-3"></div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-2" title={`Baterai: ${sensor.battery}%`}>
                      <BatteryCharging className={`w-4 h-4 ${sensor.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className={`font-medium ${sensor.battery < 20 ? 'text-red-600' : 'text-slate-700'}`}>
                        {sensor.battery}%
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded">
                      Update: {formatTime(sensor.lastUpdate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Tampilan jika data kosong tapi tidak error */}
        {!isLoading && !error && sensorData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
            Belum ada data sensor yang masuk ke database.
          </div>
        )}

      </main>
    </div>
  );
}