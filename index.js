require("dotenv").config();
const {
  app: { port },
} = require("./src/config/domain.config.js");
const { server } = require("./src/config/socket.config");
require("./src/server.js");
server.listen(port, () => {
  console.log("start");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("stop");
    process.exit(0);
  });
});
