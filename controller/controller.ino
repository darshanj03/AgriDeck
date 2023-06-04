#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>
#include <WiFi.h>
#include <ThingSpeak.h>

#define DHTPIN 4         // Pin connected to the DHT22
#define DHTTYPE DHT22    // DHT sensor type

DHT dht(DHTPIN, DHTTYPE);     // Initialize the DHT sensor

#define MQ_PIN 35        // Pin connected to the MQ135 sensor

int soilMoisturePin = 34;    // Pin connected to the soil moisture sensor

// WiFi credentials
const char* ssid = "Galaxy M30s6E75";
const char* password = "anirudhatm";

// ThingSpeak details
unsigned long channelID = 2127677;
const char* apiKey = "6XNU8Z4P946NR7Q8";

WiFiClient client;

Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(115200);

  dht.begin();
  bmp.begin(0x76); // Use 0x77 if your BMP280 module has a different I2C address

  pinMode(soilMoisturePin, INPUT);

  WiFi.begin(ssid, password);
  ThingSpeak.begin(client);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void loop() {
  float temperature = dht.readTemperature();    // Read temperature from DHT22
  float humidity = dht.readHumidity();          // Read humidity from DHT22

  float pressure = bmp.readPressure() / 100.0F; // Read pressure from BMP280 in hPa
  float altitude = bmp.readAltitude();          // Read altitude from BMP280 in meters

  int airQuality = analogRead(MQ_PIN);          // Read air quality value from MQ135

  int soilMoisture = analogRead(soilMoisturePin); // Read soil moisture value from the sensor
  int moisturePercentage = map(soilMoisture, 0, 4095, 0, 100);

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");
  Serial.print("Altitude: ");
  Serial.print(altitude);
  Serial.println(" m");
  Serial.print("Air Quality: ");
  Serial.println(airQuality);
  Serial.print("Soil Moisture: ");
  Serial.print(moisturePercentage);
  Serial.println(" %");

  // Send data to ThingSpeak
  ThingSpeak.setField(1, temperature);
  ThingSpeak.setField(2, humidity);
  ThingSpeak.setField(3, pressure);
  ThingSpeak.setField(4, altitude);
  ThingSpeak.setField(5, airQuality);
  ThingSpeak.setField(6, moisturePercentage);

  int httpCode = ThingSpeak.writeFields(channelID, apiKey);

  if (httpCode == 200) {
    Serial.println("Data sent to ThingSpeak successfully!");
  } else {
    Serial.println("Error sending data to ThingSpeak. HTTP code: " + String(httpCode));
  }
  Serial.println("");

  delay(15000); // Delay for 5 seconds before collecting and sending the next set of data
}
