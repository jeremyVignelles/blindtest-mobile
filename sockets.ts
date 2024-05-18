import type { Server } from "socket.io";

export function useSockets(io: Server) {
    io.on("connection", (socket) => {
        console.log("Socket.IO connection established");
    });
}