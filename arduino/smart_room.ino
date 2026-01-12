#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- KONFIGURASI WIFI ---
const char* ssid = "Diva";
const char* password = "00000000";

// --- KONFIGURASI API ---
// Ganti 192.168.1.XX dengan IP Laptop kamu (cek di cmd: ipconfig)
const char* serverName = "http://192.168.1.XX:3001/api/motion"; 

// --- KONFIGURASI DEVICE ---
const char* deviceId = "ESP32-LAB-01"; // Harus sama dengan deviceId di database
const int pirPin = 13;                 // Pin sensor PIR
bool lastStatus = false;

void setup() {
  Serial.begin(115200);
  pinMode(pirPin, INPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

void loop() {
  bool currentStatus = digitalRead(pirPin); // Baca sensor

  // Kirim data hanya jika ada perubahan gerakan
  if (currentStatus != lastStatus) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      // Bungkus data ke JSON
      StaticJsonDocument<200> doc;
      doc["deviceId"] = deviceId;
      doc["status"] = currentStatus;

      String requestBody;
      serializeJson(doc, requestBody);

      int httpResponseCode = http.POST(requestBody);
      
      if (httpResponseCode > 0) {
        Serial.print("Status Sent: ");
        Serial.println(currentStatus ? "Ada Orang" : "Kosong");
      } else {
        Serial.print("Error: ");
        Serial.println(httpResponseCode);
      }
      http.end();
      lastStatus = currentStatus;
    }
  }
  delay(1000); // Scan setiap 1 detik
}