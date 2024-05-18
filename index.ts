import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import basicAuth from "express-basic-auth";
import dotenv from "dotenv";
import { useSockets } from "./sockets";

dotenv.config();

const adminLogin = process.env['ADMIN_USERNAME'];
const adminPassword = process.env['ADMIN_PASSWORD'];

if (!adminLogin || !adminPassword) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set");
    process.exit(1);
}

const users = {
    [adminLogin]: adminPassword
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    path: "/ws"
});

useSockets(io);

app.use('/admin', basicAuth({
    users: users,
    challenge: true
}), express.static(path.join(__dirname, 'dist', 'admin')));
app.use('/', express.static(path.join(__dirname, 'dist', 'game')));

httpServer.listen(8080).on("listening", () => {
    console.log("Server is listening on port 8080");
});