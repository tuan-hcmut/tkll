const initSockets = (io) => {
  let customer = [];
  let seller = [];

  io.on("connection", (socket) => {
    console.log(customer);
    socket.on("data-register", (data) => {
      if (customer.length === 0) customer.push(data);
      for (let i = 0; i < customer.length; i++) {
        if (customer[i].username === data.username) {
          socket.emit("error", { message: "username already exist!!", data: customer[i] });
          break;
        } else {
          customer.push(data);
          socket.emit("success", { message: "Add success!!!", data: data });
          break;
        }
      }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initSockets;
