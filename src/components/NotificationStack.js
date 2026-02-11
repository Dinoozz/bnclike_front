// NotificationStack.js
// Affiche des notifications empilées en haut de l'écran
import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';

let notifId = 0;

const NotificationStack = forwardRef((_, ref) => {
  const [notifications, setNotifications] = useState([]);

  const push = useCallback((message, type = 'info') => {
    const id = ++notifId;
    setNotifications(prev => [...prev, { id, message, type, removing: false }]);

    // Auto-remove après 4s
    setTimeout(() => {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, removing: true } : n))
      );
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 300);
    }, 4000);
  }, []);

  useImperativeHandle(ref, () => ({ push }), [push]);

  const bgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-1 pointer-events-none w-full max-w-sm px-2">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`pointer-events-auto px-3 py-1 rounded shadow-lg text-white text-xs font-medium select-none transition-all duration-300 ${bgColor(n.type)} ${
            n.removing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
});

NotificationStack.displayName = 'NotificationStack';

export default NotificationStack;
