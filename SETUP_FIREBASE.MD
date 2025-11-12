# Setup Firebase untuk Viridelis

## Langkah 1: Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project"
3. Nama project: **viridelis**
4. Ikuti wizard setup (bisa disable Google Analytics untuk development)

## Langkah 2: Setup Realtime Database

1. Di sidebar, klik **Realtime Database**
2. Klik **Create Database**
3. Pilih lokasi server (pilih yang terdekat, misal: Singapore)
4. Pilih **Start in test mode** untuk development
5. Klik **Enable**

## Langkah 3: Inisialisasi Database Structure

Di tab **Data** pada Realtime Database, buat struktur berikut:

```json
{
  "sensors": {
    "temperature": 0,
    "humidity": 0,
    "ph": 0,
    "waterLevel": 0,
    "lastUpdate": 0
  },
  "devices": {
    "fan": false,
    "light": false,
    "pump": false,
    "heater": false
  }
}
```

## Langkah 4: Dapatkan Firebase Config untuk Web App

1. Klik ⚙️ (Settings) > **Project settings**
2. Scroll ke bawah ke "Your apps"
3. Klik icon **</>** (Web)
4. Beri nickname: **viridelis-web**
5. Klik **Register app**
6. Copy config object yang muncul
7. Paste ke file `src/lib/firebase.ts`, ganti bagian `firebaseConfig`

Config akan terlihat seperti ini:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "viridelis-xxxx.firebaseapp.com",
  databaseURL: "https://viridelis-xxxx-default-rtdb.firebaseio.com",
  projectId: "viridelis-xxxx",
  storageBucket: "viridelis-xxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

## Langkah 5: Setup Arduino

### Install Library di Arduino IDE:

1. Buka Arduino IDE
2. Tools > Manage Libraries
3. Install library berikut:
   - **DHT sensor library** by Adafruit
   - **Adafruit Unified Sensor**
   - **Firebase Arduino WiFiNINA** by Mobizt
   - **WiFiS3** (built-in untuk R4 WiFi)

### Update Kode Arduino:

Buka file `arduino/viridelis_greenhouse.ino` dan update:

```cpp
// WiFi credentials
#define WIFI_SSID "NAMA_WIFI_ANDA"
#define WIFI_PASSWORD "PASSWORD_WIFI_ANDA"

// Firebase credentials
#define FIREBASE_HOST "viridelis-xxxx-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"
```

### Dapatkan Database Secret:

1. Di Firebase Console: Project Settings > Service accounts
2. Klik **Database secrets**
3. Copy secret yang ada (atau generate new)
4. Paste ke `FIREBASE_AUTH` di kode Arduino

## Langkah 6: Wiring Arduino

### Sensor Connections:
- **DHT11**:
  - VCC → 5V
  - GND → GND
  - DATA → Pin 2

- **pH Sensor**:
  - VCC → 5V
  - GND → GND
  - ANALOG OUT → A0

- **Water Level Sensor**:
  - VCC → 5V
  - GND → GND
  - ANALOG OUT → A1

### Relay Connections (untuk control):
- **Relay 1 (Fan)** → Pin 8
- **Relay 2 (Light)** → Pin 9
- **Relay 3 (Pump)** → Pin 10
- **Relay 4 (Heater)** → Pin 11

## Langkah 7: Upload & Test

1. Hubungkan Arduino Uno R4 WiFi ke komputer
2. Select Board: Tools > Board > Arduino UNO R4 WiFi
3. Select Port: Tools > Port > (pilih port Arduino)
4. Upload sketch
5. Buka Serial Monitor (115200 baud) untuk melihat status koneksi

## Langkah 8: Test Web App

1. Jalankan web app: `npm run dev`
2. Buka halaman Monitoring - lihat data sensor real-time
3. Buka halaman Control - toggle devices dan lihat perubahan di Serial Monitor Arduino

## Security Rules (Production)

Untuk production, ubah rules di Realtime Database:

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": true
    },
    "devices": {
      ".read": true,
      ".write": true
    }
  }
}
```

Untuk security lebih ketat, gunakan Firebase Authentication dan custom rules.

## Troubleshooting

### Arduino tidak connect ke WiFi
- Pastikan SSID dan password benar
- Cek jarak Arduino ke router
- Pastikan WiFi 2.4GHz (R4 WiFi tidak support 5GHz)

### Data tidak muncul di web app
- Cek Firebase config di `src/lib/firebase.ts`
- Buka console browser untuk lihat error
- Pastikan database rules allow read/write

### Device control tidak berfungsi
- Cek wiring relay
- Pastikan relay mendapat power supply yang cukup
- Cek Serial Monitor Arduino untuk debug

## Kalibrasi Sensor

### pH Sensor:
1. Siapkan buffer solution pH 4, 7, dan 10
2. Ukur nilai analog untuk tiap pH
3. Update formula di fungsi `readSensors()`

### Water Level:
1. Test sensor di air dengan level berbeda
2. Catat nilai analog min (kosong) dan max (penuh)
3. Update `map()` function dengan nilai actual