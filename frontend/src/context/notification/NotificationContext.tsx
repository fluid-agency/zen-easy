import React, { createContext, useState, useContext, useCallback, useMemo, useRef, type ReactNode } from 'react';
import './Notification.scss';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; 
}

interface NotificationContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  clearNotification: (id: string) => void;
}


export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);


export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationIdCounter = useRef(0); 

  // Function to add a new notification
  const addNotification = useCallback((message: string, type: Notification['type'], duration: number = 3000) => {
    const id = `notification-${notificationIdCounter.current++}`;
    const newNotification: Notification = { id, message, type, duration };

    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    // Auto-clear after duration
    if (duration > 0) {
      setTimeout(() => {
        clearNotification(id);
      }, duration);
    }
  }, []);

  // Function to clear a specific notification
  const clearNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  }, []);

  // Helper functions
  const showSuccess = useCallback((message: string, duration?: number) => addNotification(message, 'success', duration), [addNotification]);
  const showError = useCallback((message: string, duration?: number) => addNotification(message, 'error', duration), [addNotification]);
  const showInfo = useCallback((message: string, duration?: number) => addNotification(message, 'info', duration), [addNotification]);
  const showWarning = useCallback((message: string, duration?: number) => addNotification(message, 'warning', duration), [addNotification]);

  const contextValue = useMemo(() => ({
    showSuccess,
    showError,
    showInfo,
    showWarning,
    clearNotification,
  }), [showSuccess, showError, showInfo, showWarning, clearNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onDismiss={clearNotification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      default: return '';
    }
  };

  return (
    <div className={`notification-item notification-item--${notification.type}`}>
      <span className="notification-icon">{getIcon(notification.type)}</span>
      <p className="notification-message">{notification.message}</p>
      <button className="notification-dismiss" onClick={() => onDismiss(notification.id)}>&times;</button>
    </div>
  );
};