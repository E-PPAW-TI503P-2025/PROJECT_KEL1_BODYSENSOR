#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- KONFIGURASI WIFI & SERVER ---
const char* ssid = "HSC_12312";
const char* password = "1118kali";
// GANTI DENGAN IP LAPTOP LU (Cek via ipconfig)
const char* serverUrl = "http://10.37.149.231:8000/api/motion"; 

// --- KONFIGURASI HARDWARE ---
const int pirPin = 13;      // Pin sensor PIR
const char* deviceId = "ESP32-ROOM-001"; // ID Unik Ruangan

bool currentStatus = false;
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
  Serial.println("\nConnected to WiFi!");
}

void sendData(bool status) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Buat JSON payload
    StaticJsonDocument<200> doc;
    doc["deviceId"] = deviceId;
    doc["status"] = status;

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      Serial.print("Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

void loop() {
  // Baca sensor PIR (HIGH = ada gerakan, LOW = sepi)
  currentStatus = digitalRead(pirPin);

  // Cek kalau ada perubahan status
  if (currentStatus != lastStatus) {
    Serial.print("Status changed to: ");
    Serial.println(currentStatus ? "OCCUPIED" : "EMPTY");
    
    sendData(currentStatus);
    
    lastStatus = currentStatus;
  }

  delay(200); // Debounce kecil
}