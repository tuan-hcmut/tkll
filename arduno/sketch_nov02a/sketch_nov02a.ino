#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "Hshopvn_Pzem004t_V2.h"
#define ssid "Tuan"  //Thay bằng wifi nhà bạn
#define password "123456789"
// Thông tin về MQTT Broker
#define mqtt_server "energy-blockchain1.cloud.shiftr.io" // Thay bằng thông tin của bạn
#define mqtt_user "energy-blockchain1"    //Thay bằng user va pass của bạn
#define mqtt_pwd "yVwXeYpknWzjWWgz"
const uint16_t mqtt_port = 1883; //Port của CloudMQTT


#define RX_PZEM     D2
#define TX_PZEM     D1

// Using with SoftwareSerial.
Hshopvn_Pzem004t_V2 pzem1(TX_PZEM, RX_PZEM);
WiFiClient espClient;
PubSubClient client(espClient);

int energyAvailable = 0;

void setup() {
  pinMode(D0, OUTPUT);
  Serial.begin(9600);
  // hàm thực hiện chức năng kết nối Wifi và in ra địa chỉ IP của ESP8266
  setup_wifi();
  // cài đặt server là broker.mqtt-dashboard.com và lắng nghe client ở port 1883
  client.setServer(mqtt_server, mqtt_port);
  // gọi hàm callback để thực hiện các chức năng publish/subcribe
  client.setCallback(callback);
  // gọi hàm reconnect() để thực hiện kết nối lại với server khi bị mất kết nối
  reconnect();
  // init module
  pzem1.begin();
  pzem1.setTimeout(100);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  // kết nối đến mạng Wifi
  WiFi.begin(ssid, password);
  // in ra dấu . nếu chưa kết nối được đến mạng Wifi
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // in ra thông báo đã kết nối và địa chỉ IP của ESP8266
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void callback(char* topic, byte* payload, unsigned int length) {
  //in ra tên của topic và nội dung nhận được từ kênh MQTT lens đã publish
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("] ");
  payload[length] = '\0';
  String rev_payload = String((char*) payload);
  Serial.print("Message: ");
  Serial.println(rev_payload);
    if(rev_payload.toInt() <= 0)
    {
      Serial.println("no energy");
      energyAvailable = 0;  
    }
    else 
      energyAvailable = 1;
}
void reconnect() {
  // lặp cho đến khi được kết nối trở lại
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266", mqtt_user, mqtt_pwd)) {
      Serial.println("connected");
      // publish gói tin "Connected!" đến topic ESP8266/connection/board
      client.publish("connection", "0");
      // đăng kí nhận gói tin tại topic ESP8266/LED_GPIO2/status
      //client.subscribe("mqtt/remainingEnergy");
      client.subscribe("energyAvailable");
    } else {
      // in ra màn hình trạng thái của client khi không kết nối được với MQTT broker
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // delay 5s trước khi thử lại
      delay(5000);
    }
  }
}
char msg[100];
float total_energy = 0;
float energy = 0;
void loop() {
  // kiểm tra nếu ESP8266 chưa kết nối được thì sẽ thực hiện kết nối lại
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  //Serial.print("Energy: ");
  //Serial.println(energyAvailable);
  //Get data from your PZEM004T V2
  pzem_info pzemData = pzem1.getData();
  client.publish("connection","0");
  Serial.println(energyAvailable);
  if (energyAvailable)
  {
    int power = pzemData.power;
    power *= 3;
    //Serial.print(power);
    Serial.print("W: ");
    Serial.println(power);
    sprintf(msg, "%d", power);
    client.publish("energyUsed", msg);
    //Serial.println("Led on");
    digitalWrite(D0,HIGH);    
    Serial.print("total energy: ");
    Serial.println(total_energy);
    // if(total_energy >= 1000)
    // {
    //   energyAvailable = 0;      
    // }
  }
  else
  {
    client.publish("energyUsed", "0");
    digitalWrite(D0,LOW);    
  }
  delay(3000); 
}
