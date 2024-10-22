import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext.tsx";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
