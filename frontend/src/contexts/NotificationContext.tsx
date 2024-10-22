import { createContext, ReactNode, useCallback, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

interface NotificationContextType {
  showNotification: (content: NotificationContent) => void;
  hideNotification: () => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export interface NotificationContent {
  message: string | string[];
  severity: "success" | "error" | "info";
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationContent | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);

  const showNotification = useCallback((content: NotificationContent) => {
    setNotification(content);
    setOpen(true);
  }, []);

  const hideNotification = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {notification && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={hideNotification}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ marginTop: "60px" }}
        >
          <Alert
            onClose={hideNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {Array.isArray(notification.message) ? (
              <ul>
                {notification.message.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              notification.message
            )}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};
