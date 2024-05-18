import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    path: "/ws"
});

io.on("connection", (socket) => {
    console.log("Socket.IO connection established");
});

app.use('/admin', express.static(path.join(__dirname, 'dist', 'admin')));
app.use('/', express.static(path.join(__dirname, 'dist', 'game')));

httpServer.listen(8080).on("listening", () => {
    console.log("Server is listening on port 8080");
});