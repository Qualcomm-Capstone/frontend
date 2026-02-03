import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { onMessage } from 'firebase/messaging';
import { messaging } from "../firebase";

interface Notification {
  id: number;
  message: string;
  type: 'violation';
  timestamp: string;
  read: boolean;
  plateNumber: string;
  speed: number;
  location: string;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const data = payload.data || {};
      const newNotification: Notification = {
        id: Number(data.id) || Date.now(),
        message: payload.notification?.body || '새로운 과속 감지',
        type: 'violation',
        timestamp: new Date(data.timestamp || Date.now()).toLocaleString(),
        read: false,
        plateNumber: data.car_number || '미확인 차량',
        speed: Number(data.car_speed) || 0,
        location: data.location || 'Seoul',
      };
      setNotifications(prev => [newNotification, ...prev]);
    });
    return () => { unsubscribe(); };
  }, []);

  const handleNotificationClick = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all ${
          unreadCount > 0
            ? 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20'
            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
        }`}
      >
        <Bell className={`w-4.5 h-4.5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl border border-white/10 bg-[#0c0e16]/95 backdrop-blur-xl z-50 max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white">알림 센터</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-4 h-4 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600">새로운 알림이 없습니다.</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer ${
                    !notification.read ? 'bg-cyan-500/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      !notification.read ? 'bg-cyan-400' : 'bg-gray-700'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-white truncate">{notification.plateNumber}</p>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">{notification.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-red-400 font-medium">{notification.speed} km/h</span>
                        <span className="text-gray-600">{notification.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
