import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "../types/User";
import SocketSingleton from "../utils/Socket.ts";
import { useNotification } from "../hooks/useNotification.ts";
import { getUnreadMessageCount } from "../services/chatService.ts";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  newMessageCount: number;
  setNewMessageCount: React.Dispatch<React.SetStateAction<number>>;
  logout: () => void;
  authLoading: boolean;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [newMessageCount, setNewMessageCount] = useState<number>(0);
  const [permission, setPermission] = useState(
    Notification.permission === "granted"
  );
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();
  const [updated, setUpdated] = useState<boolean>(false);
  const logout = useCallback(() => {
    setUser(null);

    // Remove token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("formData");
    localStorage.removeItem("searchDatacreate");
    localStorage.removeItem("searchDataedit");
  }, []);

  const handleChatUpdated = useCallback(
    (chat: { messages: { content: string; unread: boolean }[] }) => {
      const newMessage = chat.messages[chat.messages.length - 1];
      if (newMessage && newMessage.unread) {
        if (permission)
          new Notification("New message", {
            body: newMessage.content,
          });
        setNewMessageCount((prevCount) => prevCount + 1);
      }
    },
    [permission]
  );

  const handleChatCreated = useCallback(() => {
    if (permission)
      new Notification("New chat", {
        body: "You have a new chat",
      });
  }, [permission]);

  const checkAuth = useCallback(async () => {
    if (user && user.accountType && user.id) {
      localStorage.setItem("user", JSON.stringify(user));

      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
            setPermission(true);
          } else {
            console.log("Permission to show notifications denied.");
            setPermission(false);
          }
        });
      }

      // Get a socket connection
      const socket = SocketSingleton.getInstance(user.id);
      socket.on("chatUpdated", handleChatUpdated);
      socket.on("chatCreated", handleChatCreated);

      getUnreadMessageCount(user.accountType)
        .then((response) => {
          setNewMessageCount(response.unreadCount);
        })
        .catch((error) => {
          showNotification({
            message:
              "Sorry, there was an error authenticating you. Please reload or try to logout and login again.",
            severity: "error",
          });
          console.error(error);
        });

      return () => {
        socket.off("chatUpdated", handleChatUpdated);
        socket.off("chatCreated", handleChatCreated);
      };
    } else {
      localStorage.removeItem("user");
      setNewMessageCount(0);
    }
  }, [user, showNotification, logout, handleChatUpdated, handleChatCreated]);

  useEffect(() => {
    checkAuth().then(() => setAuthLoading(false));
  }, [user, checkAuth, updated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        newMessageCount,
        setNewMessageCount,
        logout,
        authLoading,
        setUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
