/*
 * Viridelis - Greenhouse Monitoring & Control System
 * Board: Arduino Uno R4 WiFi
 * 
 * Sensors:
 * - DHT11: Temperature & Humidity
 * - pH Sensor: Water pH level
 * - Water Level Sensor
 * 
 * Devices:
 * - Fan (Relay)
 * - Grow Light (Relay)
 * - Water Pump (Relay)
 * - Heater (Relay)
 */

#include <WiFiS3.h>
#include <Firebase_Arduino_WiFiNINA.h>
#include <DHT.h>

// WiFi credentials
#define WIFI_SSID "404 Gateaway"
#define WIFI_PASSWORD "12345678"

// Firebase credentials
#define FIREBASE_HOST "viridelis-dw-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "xKqEq9fnBuQQMcaJwsk4ZfEEJCH939VOgOg39rzC"

// DHT11 Sensor
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Sensor Pins
#define PH_PIN A0
#define WATER_LEVEL_PIN A1

// Relay Pins (Devices)
#define FAN_PIN 8
#define LIGHT_PIN 9
#define PUMP_PIN 10
#define HEATER_PIN 11

// Firebase
FirebaseData firebaseData;
String path = "/";

// Variables
float temperature = 0;
float humidity = 0;
float phValue = 0;
int waterLevel = 0;

bool fanState = false;
bool lightState = false;
bool pumpState = false;
bool heaterState = false;

unsigned long lastSensorUpdate = 0;
unsigned long lastDeviceCheck = 0;
const unsigned long SENSOR_INTERVAL = 2000; // Update sensors every 2 seconds
const unsigned long DEVICE_INTERVAL = 500;  // Check device commands every 0.5 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize DHT
  dht.begin();
  
  // Initialize relay pins
  pinMode(FAN_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(HEATER_PIN, OUTPUT);
  
  // Turn off all relays initially
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(HEATER_PIN, LOW);
  
  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  // Connect to Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH, WIFI_SSID, WIFI_PASSWORD);
  Firebase.reconnectWiFi(true);
  
  Serial.println("Firebase Connected!");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Read and update sensors
  if (currentMillis - lastSensorUpdate >= SENSOR_INTERVAL) {
    lastSensorUpdate = currentMillis;
    readSensors();
    updateFirebaseSensors();
  }
  
  // Check device commands from Firebase
  if (currentMillis - lastDeviceCheck >= DEVICE_INTERVAL) {
    lastDeviceCheck = currentMillis;
    checkDeviceCommands();
  }
}

void readSensors() {
  // Read DHT11
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    temperature = 0;
    humidity = 0;
  }
  
  // Read pH sensor (calibration needed)
  int phRaw = analogRead(PH_PIN);
  phValue = map(phRaw, 0, 1023, 0, 1400) / 100.0; // Basic conversion, needs calibration
  
  // Read water level sensor
  int waterRaw = analogRead(WATER_LEVEL_PIN);
  waterLevel = map(waterRaw, 0, 1023, 0, 100); // Convert to percentage
  
  // Debug output
  Serial.println("--- Sensor Readings ---");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println("°C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");
  Serial.print("pH: "); Serial.println(phValue);
  Serial.print("Water Level: "); Serial.print(waterLevel); Serial.println("%");
}

void updateFirebaseSensors() {
  // Update temperature
  Firebase.setFloat(firebaseData, "/sensors/temperature", temperature);
  
  // Update humidity
  Firebase.setFloat(firebaseData, "/sensors/humidity", humidity);
  
  // Update pH
  Firebase.setFloat(firebaseData, "/sensors/ph", phValue);
  
  // Update water level
  Firebase.setInt(firebaseData, "/sensors/waterLevel", waterLevel);
  
  // Update timestamp
  Firebase.setInt(firebaseData, "/sensors/lastUpdate", millis());
  
  Serial.println("Sensors updated to Firebase");
}

void checkDeviceCommands() {
  // Check fan state
  if (Firebase.getBool(firebaseData, "/devices/fan")) {
    bool newState = firebaseData.boolData();
    if (newState != fanState) {
      fanState = newState;
      digitalWrite(FAN_PIN, fanState ? HIGH : LOW);
      Serial.print("Fan: "); Serial.println(fanState ? "ON" : "OFF");
    }
  }
  
  // Check light state
  if (Firebase.getBool(firebaseData, "/devices/light")) {
    bool newState = firebaseData.boolData();
    if (newState != lightState) {
      lightState = newState;
      digitalWrite(LIGHT_PIN, lightState ? HIGH : LOW);
      Serial.print("Light: "); Serial.println(lightState ? "ON" : "OFF");
    }
  }
  
  // Check pump state
  if (Firebase.getBool(firebaseData, "/devices/pump")) {
    bool newState = firebaseData.boolData();
    if (newState != pumpState) {
      pumpState = newState;
      digitalWrite(PUMP_PIN, pumpState ? HIGH : LOW);
      Serial.print("Pump: "); Serial.println(pumpState ? "ON" : "OFF");
    }
  }
  
  // Check heater state
  if (Firebase.getBool(firebaseData, "/devices/heater")) {
    bool newState = firebaseData.boolData();
    if (newState != heaterState) {
      heaterState = newState;
      digitalWrite(HEATER_PIN, heaterState ? HIGH : LOW);
      Serial.print("Heater: "); Serial.println(heaterState ? "ON" : "OFF");
    }
  }
}