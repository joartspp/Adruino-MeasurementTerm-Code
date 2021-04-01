#include <max6675.h>

// Global Variables:
const int _digiPin_led = 7;
const int _digiPin_thermoSO = 8;
const int _digiPin_thermoCS = 9;
const int _digiPin_thermoSCK = 10;

const int _anaPin_thermistor_negative = A0;
const int _anaPin_thermistor_positive = A1;
const int _anaPin_ldr_resist = A2;

const float _voltage_Board = 5.0;
const float _max_bits_sensor = 1023.0;
const int _min_light_in_room = 100;

const float _resistance_ldr_external = 1000.0;

bool _isLightOn = false;


// Imports Max6675 thermocouple module
MAX6675 thermocouple(_digiPin_thermoSCK,_digiPin_thermoCS,_digiPin_thermoSO);

//Main Arduino

// Function Setup working when uploaded to board
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Arduino UNO : Working!!");
  Serial.println("Board Status : 200");

  pinMode(_digiPin_led,OUTPUT);
  // MAX Chip to stabilize:
  delay(500);
}

// Thread loop board working everything in function (while - loop):
void loop() {
  //Thermocouple Code is here
  Serial.print("Thermocouple (C): ");
  Serial.println(thermocouple.readCelsius());
  Serial.print("Thermocouple (F): ");
  Serial.println(thermocouple.readFahrenheit());

  //Thermistor:
  int _sensor_bits_negative = analogRead(_anaPin_thermistor_negative);
  int _sensor_bits_positive = analogRead(_anaPin_thermistor_positive);
  float _result_voltage_negative = _sensor_bits_negative * (_voltage_Board / _max_bits_sensor);
  float _result_voltage_positive = _sensor_bits_positive * (_voltage_Board / _max_bits_sensor);
  Serial.print("Thermistor Negative (V): ");
  Serial.println(_result_voltage_negative);
  Serial.print("Thermistor Positive (V): ");
  Serial.println(_result_voltage_positive);

  //Light Dependent Resistor:
  int _sensor_bits_ldr = analogRead(_anaPin_ldr_resist);
  Serial.print("Light Dependent : ");
  Serial.println(_sensor_bits_ldr);

  //LED
  if (_sensor_bits_ldr < _min_light_in_room || (thermocouple.readCelsius() < 25)) {
    if (_isLightOn == false) {
      _isLightOn = true;
      if (thermocouple.readCelsius() < 25) {
        Serial.println("LED Turn on : This room is cold!"); 
      } else {
        Serial.println("LED Turn on : This room is dark!"); 
      }
    }
    digitalWrite(_digiPin_led,HIGH);
  } else {
    if (_isLightOn == true) {
      _isLightOn = false; 
      Serial.println("LED Turn off : This room is normal!"); 
    }
    digitalWrite(_digiPin_led,LOW);
  }

  // Delay
  delay(1000);

  
}
