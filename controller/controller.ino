#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>
#include <WiFi.h>
#include <ThingSpeak.h>
#define GPIO_PIN_TOUCH 14

int CHECK_INTERVAL = 1000;

bool touchActive = false;
bool relayState = false;
unsigned long lastCheckTime = 0;

WiFiClient client;
Adafruit_BMP280 bmp;

#define DHTPIN 4         // Pin connected to the DHT22
#define DHTTYPE DHT22    // DHT sensor type

DHT dht(DHTPIN, DHTTYPE);     // Initialize the DHT sensor


// #define MQ_PIN 35        // Pin connected to the MQ135 sensor
// const int touchPin = 14;

int soilMoisturePin = 34;    // Pin connected to the soil moisture sensor
int counter = 0;

// WiFi credentials
const char* ssid = "realme 5i";
const char* password = "mohitraj01";
const int relay = 12;


// ThingSpeak details
unsigned long channelID = 2127677;
const char* apiKey = "6XNU8Z4P946NR7Q8";


void setup() {
 Serial.begin(115200);

 pinMode(relay, OUTPUT);
 pinMode(GPIO_PIN_TOUCH, INPUT);
 digitalWrite(relay, HIGH);

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


bool calculate_threshold(int soil_moisture_percentage, double temperature, double humidity) {
  double min_temperature = 20.0;
  double max_temperature = 30.0;
  double min_humidity = 40.0;
  double max_humidity = 80.0;
   // Normalize the values between 0 and 1
  double normalized_soil_moisture = soil_moisture_percentage / 100.0;
  double normalized_temperature = 1 - ((temperature - min_temperature) / (max_temperature - min_temperature));
  double normalized_humidity = (humidity - min_humidity) / (max_humidity - min_humidity);


  // Define threshold equation based on factors and their revised percentages of importance for tomato plants
  double thresholding_value = (0.65 * normalized_soil_moisture) + (0.10 * normalized_temperature) + (0.25 * normalized_humidity);
  return thresholding_value < 0.5;
}


void push_data(float temperature, float humidity, float pressure, float altitude, int moisturePercentage){
   // Send data to ThingSpeak
   ThingSpeak.setField(1, temperature);
   ThingSpeak.setField(2, humidity);
   ThingSpeak.setField(3, pressure);
   ThingSpeak.setField(4, altitude);
   ThingSpeak.setField(6, moisturePercentage);


   int httpCode = ThingSpeak.writeFields(channelID, apiKey);


   if (httpCode == 200) {
     Serial.println("Data sent to ThingSpeak successfully!");
   } else {
     Serial.println("Error sending data to ThingSpeak. HTTP code: " + String(httpCode));
   }
   Serial.println("");
}


// void loop() {
//   if (millis() - lastCheckTime >= CHECK_INTERVAL) {

//  float temperature = dht.readTemperature();    // Read temperature from DHT22
//  float humidity = dht.readHumidity();          // Read humidity from DHT22


//  float pressure = bmp.readPressure() / 100.0F; // Read pressure from BMP280 in hPa
//  float altitude = bmp.readAltitude();          // Read altitude from BMP280 in meters


//  int airQuality = analogRead(MQ_PIN);          // Read air quality value from MQ135


//  int soilMoisture = analogRead(soilMoisturePin); // Read soil moisture value from the sensor
//  int moisturePercentage;
//  if (soilMoisture < 1010){
//    moisturePercentage = 100;
//  }
//  else if (soilMoisture > 3000){
//    moisturePercentage = 0;
//  } else{
//     moisturePercentage = map(soilMoisture, 1010, 3000, 100, 0);
//  }

//  bool thresh = calculate_threshold(moisturePercentage,temperature,humidity);

//  Serial.print("Temperature: ");
//  Serial.print(temperature);
//  Serial.println(" °C");
//  Serial.print("Humidity: ");
//  Serial.print(humidity);
//  Serial.println(" %");
//  Serial.print("Pressure: ");
//  Serial.print(pressure);
//  Serial.println(" hPa");
//  Serial.print("Altitude: ");
//  Serial.print(altitude);
//  Serial.println(" m");
//  Serial.print("Air Quality: ");
//  Serial.println(airQuality);
//  Serial.print("Soil Moisture: ");
//  Serial.print(moisturePercentage);
//  Serial.println(" %");
//  Serial.print("\n");

//  if (thresh && counter < 8) {
//    activateStepUpModule();
//    counter++;
//    CHECK_INTERVAL = 1000;
//  } else if (thresh){
//     activateStepUpModule();
//     //push_data(temperature, humidity, pressure, altitude, airQuality, moisturePercentage);
//     counter = 0;
//     CHECK_INTERVAL = 1000;
//  } else {
//      deactivateStepUpModule();
//      counter = 0;
//      //push_data(temperature, humidity, pressure, altitude, airQuality, moisturePercentage);
//      CHECK_INTERVAL = 15000;
//  }
//  lastCheckTime = millis();
// }
//   int touchState = digitalRead(GPIO_PIN_TOUCH);
//     if (touchState == HIGH) {
//     touchActive = true;
//     activateStepUpModule();
//   } else if (!touchActive) {
//     if (relayState) {
//       activateStepUpModule();
//     } else {
//       deactivateStepUpModule();
//     }
//   }

//   // Reset the touchActive flag after releasing the touch sensor
//   if (touchActive && (touchState == LOW)) {
//     touchActive = false;
//   }
// }

void loop() {
  // Read touch sensor state
  int touchState = digitalRead(GPIO_PIN_TOUCH);

  if (touchState == HIGH) {
    // Touch sensor is active, activate relay and update relay state
    activateStepUpModule();
    relayState = true;
    touchActive = true;  // Set touchActive flag to indicate touch is active
  } else if (touchActive && (touchState == LOW)) {
    // Touch sensor was active and is now released, deactivate relay and update relay state
    deactivateStepUpModule();
    relayState = false;
    touchActive = false;  // Reset touchActive flag
  } else if (!touchActive) {
    // Touch sensor is not active, control relay based on threshold
    if (relayState) {
      activateStepUpModule();
    } else {
      deactivateStepUpModule();
    }
  }

  // Read sensor values and check threshold at regular intervals
  if (millis() - lastCheckTime >= CHECK_INTERVAL) {
    // Read sensor values
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    float pressure = bmp.readPressure() / 100.0F;
    float altitude = bmp.readAltitude();
    int soilMoisture = analogRead(soilMoisturePin);
    int moisturePercentage;

    // Calculate moisture percentage
    if (soilMoisture < 1010) {
      moisturePercentage = 100;
    } else if (soilMoisture > 3000) {
      moisturePercentage = 0;
    } else {
      moisturePercentage = map(soilMoisture, 1010, 3000, 100, 0);
    }

    // Check threshold and control relay
    bool thresholdExceeded = calculate_threshold(moisturePercentage, temperature, humidity);

    if (thresholdExceeded) {
      if (!touchActive) {
        activateStepUpModule();
        relayState = true;
      }
    } else {
      deactivateStepUpModule();
      relayState = false;
    }

    // Update last check time
    lastCheckTime = millis();

    // Print sensor values
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
    Serial.print("Soil Moisture: ");
    Serial.print(moisturePercentage);
    Serial.println(" %");
    Serial.println();

    push_data(temperature, humidity, pressure, altitude, moisturePercentage);

    if (thresholdExceeded && counter < 8) {
      activateStepUpModule();
      counter++;
      CHECK_INTERVAL = 1000;
    } else if (thresholdExceeded) {
      activateStepUpModule();
      counter = 0;
      CHECK_INTERVAL = 1000;
    } else {
      deactivateStepUpModule();
      counter = 0;
      CHECK_INTERVAL = 15000;
    }
}
}

void activateStepUpModule() {
  digitalWrite(relay, LOW);
}

void deactivateStepUpModule() {
  digitalWrite(relay, HIGH);
}