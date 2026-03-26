import { createServer } from "node:http";
import app from "./app.js";
import { initSocket } from "./socket/socket.js";
import { initRoomHandlers } from "./socket/room.handler.js";

const server = createServer(app);
const SERVER_URL = process.env.SERVER_URL ?? "http://localhost";
const PORT = process.env.PORT ?? 4000;

// Socket
const io = initSocket(server);
initRoomHandlers(io);

server.listen(PORT, () => {
  console.log(`Server is running at ${SERVER_URL}:${PORT}`);
});
