# Frontend API 연동 문서

> 마지막 업데이트: 2026-02-06
> Base URL: `VITE_API_BASE_URL` = `http://localhost:8000/api/v1`

---

## 1. 현재 연동된 API

| 기능명 | Method | Endpoint | 파일 | 비고 |
|--------|--------|----------|------|------|
| 감지 목록 조회 | GET | `/detections/` | `App.tsx` | 정상 동작 |
| 감지 통계 | GET | `/detections/statistics/` | `App.tsx` | 정상 동작 (대시보드 통계 카드) |
| 알림 이력 조회 | GET | `/notifications/` | `NotificationCenter.tsx` | 정상 동작 (서버 알림 이력 + 실시간 FCM) |
| 감지 삭제 | DELETE | `/detections/{id}/` | `App.tsx` | 백엔드 미지원 (ReadOnly) |
| 감지 상태 업데이트 | PATCH | `/detections/{id}/` | `ViolationDetails.tsx` | 백엔드 미지원 (ReadOnly) |
| FCM 토큰 등록 | POST | `/vehicles/register-fcm/` | `FCMNotification.tsx` | `plate_number` 필수 문제 |

---

## 2. 백엔드에 이미 있지만 프론트에서 미연동인 API

| 기능명 | Method | Endpoint | 용도 |
|--------|--------|----------|------|
| 감지 상세 조회 | GET | `/detections/{id}/` | 상세 페이지에서 서버 최신 데이터 조회 |
| 대기중 감지 목록 | GET | `/detections/pending/` | 처리 대기 목록 필터링 |
| ~~감지 통계~~ | ~~GET~~ | ~~`/detections/statistics/`~~ | ~~연동 완료~~ |
| 차량 목록 조회 | GET | `/vehicles/` | 차량 관리 페이지 |
| 차량 등록 | POST | `/vehicles/` | 차량 신규 등록 |
| 차량 상세 조회 | GET | `/vehicles/{id}/` | 차량 상세 정보 |
| 차량 수정 | PUT/PATCH | `/vehicles/{id}/` | 차량 정보 수정 |
| 차량 삭제 | DELETE | `/vehicles/{id}/` | 차량 정보 삭제 |
| FCM 토큰 업데이트 | PATCH | `/vehicles/{id}/fcm-token/` | 특정 차량 FCM 토큰 갱신 |
| ~~알림 목록 조회~~ | ~~GET~~ | ~~`/notifications/`~~ | ~~연동 완료~~ |
| 알림 상세 조회 | GET | `/notifications/{id}/` | 알림 상세 확인 |

---

## 3. 백엔드에 새로 만들어야 하는 API

### 3-1. 감지 삭제 API

- **Endpoint**: `DELETE /api/v1/detections/{id}/`
- **필요 이유**: 프론트엔드 대시보드에서 위반 기록 삭제 기능 사용 중
- **현재 상태**: `DetectionViewSet`이 `ReadOnlyModelViewSet`이라 DELETE 미지원
- **해결 방안**: `ReadOnlyModelViewSet` → `ModelViewSet` 변경, 또는 `DestroyModelMixin` 추가

### 3-2. 감지 상태 업데이트 API

- **Endpoint**: `PATCH /api/v1/detections/{id}/`
- **요청 Body**: `{ "status": "completed" | "pending" }`
- **필요 이유**: 프론트엔드에서 확인 처리 토글(체크/미체크) 기능 사용 중
- **현재 상태**: `DetectionViewSet`이 `ReadOnlyModelViewSet`이라 PATCH 미지원
- **해결 방안**: 커스텀 액션 `@action(detail=True, methods=["patch"])` 추가, 또는 `UpdateModelMixin` 추가

### 3-3. 대시보드 FCM 토큰 등록 API

- **Endpoint**: `POST /api/v1/notifications/register-dashboard-fcm/` (제안)
- **요청 Body**: `{ "fcm_token": "string" }`
- **필요 이유**: 대시보드 웹앱에서 푸시 알림 수신을 위해 FCM 토큰을 등록해야 함
- **현재 상태**: 기존 `/vehicles/register-fcm/`은 `plate_number`가 필수이므로 대시보드용으로 부적합
- **해결 방안**: 대시보드 전용 FCM 등록 엔드포인트 신설, 또는 `plate_number` 옵셔널 처리
