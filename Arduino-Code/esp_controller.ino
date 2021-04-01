
// Include other modules
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <PubSubClient.h>


//Variable:
const char* ssid = ""; // Host Wifi
const char* pw = ""; // Password Wifi
const char* mqtt_server="broker.netpie.io"; // URL Server MQTT
const int mqtt_port=1883; // Port Server MQTT
const char* mqtt_Client=""; // Client ID
const char* mqtt_username=""; // Token
const char* mqtt_password=""; // Secert
const String your_ip = ""; //IP API GET Send data


// Defined function
WiFiClient espClient;
PubSubClient client(espClient);

// Variable for loop
char msg[1500]; // Reserveh area for msg 1500 words
float _thisThermocouple_C; // Receieve from Thermocouple C.
float _thisThermocouple_F; // Receieve from Thermocouple F.
float _thisThermistor_Negative; // Receieve from Thermistor Negative.
float _thisThermistor_Positive; // Receieve from Thermistor Positive.
int _thisLDR; //
int _isLED_state; //State light
const int _min_light_in_room = 100; // Min value to led auto work
String _place_Name = "Room1"; // Room name

//Reconnnect Function
void reconnect(){
  while (!client.connected()) {
    Serial.println("Attemping MQTT connection..");
    if (client.connect(mqtt_Client,mqtt_username,mqtt_password)) {
      Serial.println("MQTT : Connected");
    } else {
      Serial.print("failed : rc=");
      Serial.print(client.state());
      Serial.println("Try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Arduino ESP8266 : State ON!");
  WiFi.begin(ssid,pw);
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print("..");
  }
  Serial.println("");
  Serial.print("Now arudiono connected! wifi : ");
  Serial.print("IP : " );
  Serial.println(WiFi.localIP());

  //MQTT Connect Server
  client.setServer(mqtt_server,mqtt_port);
}

void loop() {
  // put your main code here, to run repeatedly:
  // This code check when have some log on monitor:
  if (Serial.available() > 0) { 
    Serial.println("Receive");
    if (Serial.find("Thermocouple (C): ") == true) {
      _thisThermocouple_C = Serial.parseFloat();
      if (Serial.find("Thermocouple (F): ") == true) {
        _thisThermocouple_F = Serial.parseFloat();
        if (Serial.find("Thermistor Negative (V): ") == true) {
          _thisThermistor_Negative = Serial.parseFloat();
          if (Serial.find("Thermistor Positive (V): ") == true) {
            _thisThermistor_Positive = Serial.parseFloat();
            if (Serial.find("Light Dependent : ") == true) {
              _thisLDR = Serial.parseInt();
              if (_thisLDR < _min_light_in_room) {
                _isLED_state = 1;
              } else {
                _isLED_state = 0;
              }

              //Condition check client is connecting
              if (!client.connected()) {
                reconnect();
              }

              //client loop mqtt
              client.loop();
          
              // This is a Variable to change String to Array and send to Netpie
              String data = "{\"data\": {\"Thermocouple (C)\":" + String(_thisThermocouple_C) +
              ", \"Thermocouple (F)\":" + String(_thisThermocouple_F) +
              ", \"Thermistor Negative (V)\":" + String(_thisThermistor_Negative) + 
              ", \"Thermistor Positive (V)\":" + String(_thisThermistor_Positive) + 
              ", \"Light Dependent Resist\":" +  String(_thisLDR) +
              ", \"LED Status\":" +  String(_isLED_state) +
              ", \"Room\":\""+ String(_place_Name) +
              "\"}}";

              //Debug Data
              Serial.println(data);

              //Transform string data to array data
              data.toCharArray(msg,(data.length() + 1));

              //Publishing to netpie to shadow topic
              client.publish("@shadow/data/update",msg);


              //xJoez - API >> Logger
              if (WiFi.status() == WL_CONNECTED) {
                  HTTPClient http;
                  String url_xjoez = "http://"+your_ip+"/add/a/"+String(_thisThermocouple_C)+"/"+String(_thisThermocouple_F)+"/"+String(_thisThermistor_Negative)+"/"+String(_thisThermistor_Positive)+"/"+String(_thisLDR)+"/"+String(_isLED_state) +"/"+String(_place_Name);
                  http.begin(url_xjoez);
                  int httpCode = http.GET();
    
                  if (httpCode > 0) {
                     String content = http.getString();
                     Serial.println(url_xjoez);
                     Serial.println("API-xJoez : " + content + " HTTP Code : " + httpCode);
                  }
    
                  http.end();
              }
            
              
              //delay send data
              delay(60000);
            }
          }
        }
      }
    }
  }
  delay(500);
}
