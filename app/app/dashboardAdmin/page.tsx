"use client";

import React, { useState } from "react";
import { Activity, Users, AlertCircle, BatteryCharging, RefreshCcw } from "lucide-react";

// --- DATA DUMMY ---
const INITIAL_DATA = [
  { id: "S-001", location: "Ruang Tamu", status: "Active", motionDetected: true, battery: 88, lastUpdate: "10s ago" },
  { id: "S-002", location: "Kamar 101", status: "Active", motionDetected: false, battery: 92, lastUpdate: "1m ago" },
  { id: "S-003", location: "Kamar 102", status: "Inactive", motionDetected: false, battery: 0, lastUpdate: "Offline" },
  { id: "S-004", location: "Dapur", status: "Active", motionDetected: true, battery: 45, lastUpdate: "5s ago" },
  { id: "S-005", location: "Gudang", status: "Active", motionDetected: false, battery: 78, lastUpdate: "2m ago" },
];

export default function AdminDashboardPage() {
  const [sensorData, setSensorData] = useState(INITIAL_DATA);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* TIDAK ADA NAVBAR DISINI */}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Monitoring</h1>
            <p className="text-slate-500 mt-1">Pantau status body sensor dan okupansi ruangan secara real-time.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition shadow-sm font-medium text-sm">
            <RefreshCcw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Sensor Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {sensorData.filter(s => s.status === "Active").length} <span className="text-slate-400 text-lg font-normal">/ {sensorData.length}</span>
              </h3>
            </div>
          </div>

          {/* Card 2 */}
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

          {/* Card 3 */}
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

        {/* Grid Status Sensor */}
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Status Perangkat & Ruangan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensorData.map((sensor) => (
            <div key={sensor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
              
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
                  
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    sensor.status === 'Inactive' 
                      ? 'bg-slate-100 text-slate-500 border-slate-200'
                      : sensor.motionDetected 
                        ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    {sensor.status === 'Inactive' ? 'OFFLINE' : (sensor.motionDetected ? 'ADA ORANG' : 'KOSONG')}
                  </span>
                </div>

                <div className="h-px bg-slate-100 my-3"></div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <BatteryCharging className={`w-4 h-4 ${sensor.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                    <span className={`font-medium ${sensor.battery < 20 ? 'text-red-600' : 'text-slate-700'}`}>
                      {sensor.battery}%
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded">
                    Updated: {sensor.lastUpdate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}