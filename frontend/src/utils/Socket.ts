import { io, Socket } from "socket.io-client";

class SocketSingleton {
  private static instance: Socket | undefined;
  private static userID: string | undefined;
  private constructor() {}

  public static getInstance(userID: string): Socket {
    if (
      SocketSingleton.instance === undefined ||
      SocketSingleton.userID !== userID
    ) {
      if (SocketSingleton.instance) {
        SocketSingleton.instance.disconnect();
      }
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      SocketSingleton.userID = userID;
      SocketSingleton.instance = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          token: token,
        },
      });
      SocketSingleton.instance.on("connect", () => {
        console.log("Connected to Chat server");
        SocketSingleton.instance?.emit("subscribeToChats");

        SocketSingleton.instance?.on("disconnect", () => {
          console.log("Disconnected from Chat server");
          SocketSingleton.instance = undefined;
        });
        SocketSingleton.instance?.on("subscribed", (message) => {
          console.log(message);
        });
        SocketSingleton.instance?.on("error", (error) => {
          console.error("Chat server error:", error);
        });
      });
    }
    return SocketSingleton.instance;
  }
}

export default SocketSingleton;
