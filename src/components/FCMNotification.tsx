import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../firebase";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FCMNotification = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        // 1. 알림 권한 요청
        const permission = await Notification.requestPermission();
        console.log("알림 권한 상태:", permission);

        if (permission === "granted") {
          // 2. FCM 토큰 요청
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });

          if (currentToken) {
            setToken(currentToken);
            console.log("FCM 토큰:", currentToken);

            // 3. 백엔드에 토큰 등록
            // 대시보드 FCM 등록: plate_number="DASHBOARD"로 등록하면 서버에서 자동으로 dashboard_alerts 토픽에 구독됨
            try {
              await axios.post(`${API_BASE_URL}/vehicles/register-fcm/`, {
                fcm_token: currentToken,
                plate_number: "DASHBOARD",
              });
              console.log("FCM 토큰이 성공적으로 등록되었습니다.");
            } catch (error) {
              console.error("토큰 등록 실패:", error);
            }
          } else {
            console.log("FCM 토큰을 가져올 수 없습니다.");
          }
        } else {
          console.log("알림 권한이 거부되었습니다.");
        }
      } catch (error) {
        console.error("알림 설정 중 오류 발생:", error);
      }
    };

    // 4. 포그라운드 메시지 핸들러


    // 5. 초기 권한 요청
    requestNotificationPermission();

    // 6. 컴포넌트 언마운트 시 정리

  }, []);

  return null;
};

export default FCMNotification;
