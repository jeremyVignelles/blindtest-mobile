import type { Server } from "socket.io";

export function useSockets(io: Server) {
  useAdminSocket(io);
  useGameSocket(io);
}

function useAdminSocket(io: Server) {
  io.of("/admin").on("connection", (socket) => {
    console.log("admin connected");
  });
}

function useGameSocket(io: Server) {
  io.of("/").on("connection", (socket) => {
    console.log("game connected");
  });
}
