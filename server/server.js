const dotenv = require("dotenv");
const mongoose = require("mongoose");
const mqtt = require("mqtt");
dotenv.config({ path: "./config.env" });

let users = [];
let isActive = false;
let currentUser = {
  account: "",
  role: "",
  energyRemaining: 0,
  ethRemaining: 0,
};

const app = require("./app");

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("DB connected!!");
  });

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Listen on port 127.0.0.1:${port}`);
});

////// socket /////////////////

const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("socket connected");
  const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`, {
    clientId: process.env.MQTT_CLIENTID,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME.toString(),
    password: process.env.MQTT_PASSWORD.toString(),
    reconnectPeriod: 1000,
  });

  client.subscribe(process.env.MQTT_TOPIC1.toString(), () => {
    console.log(`Subscribe to topic '${process.env.MQTT_TOPIC1?.toString()}'`);
  });
  client.subscribe(process.env.MQTT_TOPIC2.toString(), () => {
    console.log(`Subscribe to topic '${process.env.MQTT_TOPIC2?.toString()}'`);
  });
  client.subscribe(process.env.MQTT_TOPIC3.toString(), () => {
    console.log(`Subscribe to topic '${process.env.MQTT_TOPIC3?.toString()}'`);
  });
  socket.on("data-register", (data) => {
    if (data === undefined) return;
    if (users.length === 0) {
      users.push(data);
      currentUser = data;
    } else {
      let temp = false;
      for (let i = 0; i < users.length; i++) {
        if (users[i].account === data.account) {
          currentUser = users[i];
          temp = true;
          break;
        }
      }
      if (temp === false) {
        users.push(data);
        currentUser = data;
      }
    }
    socket.emit("current-user", currentUser);
  });
  socket.on("disconnect", () => {
    client.unsubscribe(process.env.MQTT_TOPIC1.toString(), () => {
      console.log(`unsubscribe to topic '${process.env.MQTT_TOPIC1?.toString()}'`);
    });
    client.unsubscribe(process.env.MQTT_TOPIC2.toString(), () => {
      console.log(`unsubscribe to topic '${process.env.MQTT_TOPIC2?.toString()}'`);
    });
    client.unsubscribe(process.env.MQTT_TOPIC3.toString(), () => {
      console.log(`unsubscribe to topic '${process.env.MQTT_TOPIC3?.toString()}'`);
    });
    // client.end(true);
  });

  /////////////// connect to broker //////////////////

  const handleUpdate = (energyRemaining, payload, account) => {
    let temp = energyRemaining - payload;

    for (let i = 0; i < users.length; i++) {
      if (users[i].account === account) {
        users[i].energyRemaining = temp <= 0 ? 0 : temp;
        break;
      }
    }
  };

  const handleTransferData = () => {
    client.on("message", (topic, payload) => {
      if (topic.toString() === "energyUsed" && isActive) {
        handleUpdate(currentUser.energyRemaining, parseInt(payload.toString("utf8")), currentUser.account);
        console.log("energyUsed", currentUser.energyRemaining);

        client.publish("energyAvailable", currentUser.energyRemaining.toString(), { qos: 0, retain: false }, (error) => {
          if (error) {
            console.log(error);
          }
        });

        socket.emit("current-user", currentUser);
        console.log("energy used: " + parseInt(payload.toString("utf8")));
      }

      if (topic.toString() === "connection" && !isActive) {
        isActive = true;
        console.log("connection");
        handleUpdate(currentUser.energyRemaining, parseInt(payload.toString("utf8")), currentUser.account);

        socket.emit("current-user", currentUser);
        client.publish("energyAvailable", currentUser.energyRemaining.toString(), { qos: 0, retain: false }, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });
  };

  handleTransferData();
  socket.on("buy-more-energy", (data) => {
    const eth = (parseInt(data.eth) / 1000000000000000000).toFixed(2);
    for (let i = 0; i < users.length; i++) {
      if (users[i].account === data.account) {
        users[i].energyRemaining = users[i].energyRemaining + data.energy;
        users[i].ethRemaining = users[i].ethRemaining - eth;
        socket.emit("current-user", users[i]);
        break;
      }
    }

    console.log(currentUser);
    isActive = false;
  });
});
