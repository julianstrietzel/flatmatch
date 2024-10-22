import { Server as SocketIOServer, Socket } from "socket.io";
import { isValidObjectId } from "mongoose";
import { authCheckSocket } from "../middleware/authCheck";

function handleConnection(socket: Socket) {
  const userId = socket.data.userId;

  socket.on("subscribeToChats", () => {
    if (!isValidObjectId(userId)) {
      socket.emit("error", "Invalid user id");
      return;
    }

    socket.join(`user-${userId}`);
    socket.emit("subscribed", `Subscribed to chats for user ${userId}`);
  });

  socket.on("disconnect", () => {
    if (userId) {
      socket.leave(`user-${userId}`);
    }
  });
}

export function socketIoSetup(io: SocketIOServer) {
  io.use(authCheckSocket);
  io.on("connection", handleConnection);
}
