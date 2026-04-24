/*
 * Viridelis - Greenhouse Monitoring System
 * Board: NodeMCU ESP8266
 *
 * Sensors:
 * - DHT22: Temperature & Humidity
 * - Soil Moisture Sensor
 */

#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>

// WiFi credentials
#define WIFI_SSID "404 Gateaway"
#define WIFI_PASSWORD "12345678"

// Firebase credentials
#define FIREBASE_HOST "viridelis-dw-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "xKqEq9fnBuQQMcaJwsk4ZfEEJCH939VOgOg39rzC"

// DHT22 Sensor
#define DHTPIN D4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Soil moisture sensor pin
#define SOIL_MOISTURE_PIN A0

FirebaseData firebaseData;

float temperature = 0;
float humidity = 0;
int soilMoisture = 0;

unsigned long lastSensorUpdate = 0;
const unsigned long SENSOR_INTERVAL = 5000;

void setup() {
  Serial.begin(115200);
  delay(10);

  dht.begin();

  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.print("WiFi connected, IP: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized");
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - lastSensorUpdate >= SENSOR_INTERVAL) {
    lastSensorUpdate = currentMillis;
    readSensors();
    updateFirebaseSensors();
  }
}

void readSensors() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT22 sensor!");
    temperature = 0;
    humidity = 0;
  } else {
    temperature = t;
    humidity = h;
  }

  int rawValue = analogRead(SOIL_MOISTURE_PIN);
  soilMoisture = map(rawValue, 1023, 0, 0, 100);
  soilMoisture = constrain(soilMoisture, 0, 100);

  Serial.println("--- Sensor Readings ---");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println("°C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println("%");
  Serial.print("Soil Moisture: "); Serial.print(soilMoisture); Serial.println("%");
  Serial.print("Analog Value: "); Serial.println(rawValue);
}

void updateFirebaseSensors() {
  Firebase.setFloat(firebaseData, "/sensors/temperature", temperature);
  Firebase.setFloat(firebaseData, "/sensors/humidity", humidity);
  Firebase.setInt(firebaseData, "/sensors/soilMoisture", soilMoisture);
  Firebase.setInt(firebaseData, "/sensors/lastUpdate", millis());

  if (firebaseData.httpCode() != 200) {
    Serial.printf("Firebase update failed: %s\n", firebaseData.errorReason().c_str());
  } else {
    Serial.println("Sensors updated to Firebase");
  }
}
