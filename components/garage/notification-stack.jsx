"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

let notifId = 0;

const NotificationStack = forwardRef(function NotificationStack(_, ref) {
  const [notifications, setNotifications] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = ++notifId;

    setNotifications((current) => [
      ...current,
      { id, message, type, removing: false },
    ]);

    window.setTimeout(() => {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, removing: true }
            : notification,
        ),
      );

      window.setTimeout(() => {
        setNotifications((current) =>
          current.filter((notification) => notification.id !== id),
        );
      }, 300);
    }, 4000);
  }, []);

  useImperativeHandle(ref, () => ({ push }), [push]);

  const bgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="pointer-events-none fixed top-14 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center space-y-1 px-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto rounded px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-300 select-none ${bgColor(
            notification.type,
          )} ${
            notification.removing
              ? "-translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
});

export default NotificationStack;
