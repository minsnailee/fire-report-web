# 화재 대응 위치 기반 신고 시스템 (개인 MVP 테스트 버전)

> 이 저장소는 팀 프로젝트를 준비하기 위해 **개인적으로 실험하고 MVP 기능을 테스트한 버전**입니다.
> 정식 프로젝트는 팀원들과의 협의를 바탕으로 백로그 기반 설계와 함께 새롭게 구성될 예정입니다.

- --

## ✅ 목적

- 팀 프로젝트 시작 전, 핵심 기능들을 미리 실험하여 개발 흐름을 파악하고자 했습니다.
- 이후 팀 프로젝트에서 빠른 개발 시작과 역할 분담에 도움이 되도록 구조를 테스트한 버전입니다.
- --

## ⚙️ 구현된 주요 기능 (MVP 수준)

### 📍 신고자 페이지

- 현재 위치 기반 지도 띄우기 (카카오 지도 API)
- 마커 클릭을 통한 화재 발생 위치 지정
- 위치 정보(위도, 경도)를 주소로 변환 (지오코딩)
- 선택된 위치 DB 저장 처리 연동
- 이후 챗봇 응답 페이지로 연동 가능

### 🧯 소방서 페이지

- 소방서 위치 등록 및 마커 표시
- 화재 위치 기준 소방서까지 최단 거리 경로 표시
- 반경 500m 소화전 위치 표시

### 🧑‍🚒 대시보드(관제센터)

- 신고 URL 생성 기능 구현 (기초 UI)
- --

## 📁 폴더 구조 (backend)

```
backend
 ┣ config
 ┃ ┣ FireStationDataLoader.java
 ┃ ┗ HydrantDataLoader.java
 ┣ controller
 ┃ ┣ ChatLogController.java
 ┃ ┣ DispatchLogController.java
 ┃ ┣ FireDispatchController.java
 ┃ ┣ FireReportController.java
 ┃ ┣ FireReportTokenController.java
 ┃ ┣ FireStationController.java
 ┃ ┣ HydrantController.java
 ┃ ┣ MainController.java
 ┃ ┗ UserController.java
 ┣ dto
 ┃ ┣ ChatLogDto.java
 ┃ ┣ DispatchLogDto.java
 ┃ ┣ FireDispatchDto.java
 ┃ ┣ FireReportDto.java
 ┃ ┣ FireReportRequest.java
 ┃ ┣ FireStationDto.java
 ┃ ┣ HydrantDto.java
 ┃ ┗ UserDto.java
 ┣ entity
 ┃ ┣ ChatLogEntity.java
 ┃ ┣ DispatchLogEntity.java
 ┃ ┣ FireDispatchEntity.java
 ┃ ┣ FireReportEntity.java
 ┃ ┣ FireReportTokenEntity.java
 ┃ ┣ FireStationEntity.java
 ┃ ┣ HydrantEntity.java
 ┃ ┗ UserEntity.java
 ┣ enums
 ┃ ┗ FireReportStatus.java
 ┣ repository
 ┃ ┣ ChatLogRepository.java
 ┃ ┣ DispatchLogRepository.java
 ┃ ┣ FireDispatchRepository.java
 ┃ ┣ FireReportRepository.java
 ┃ ┣ FireReportTokenRepository.java
 ┃ ┣ FireStationRepository.java
 ┃ ┣ HydrantRepository.java
 ┃ ┗ UserRepository.java
 ┣ service
 ┃ ┣ ChatLogService.java
 ┃ ┣ DispatchLogService.java
 ┃ ┣ FireDispatchService.java
 ┃ ┣ FireReportService.java
 ┃ ┣ FireReportTokenService.java
 ┃ ┣ FireStationService.java
 ┃ ┣ HydrantService.java
 ┃ ┗ UserService.java
 ┗ BackendApplication.java
```

## 📁 폴더 구조 (frontend)

```
src
 ┣ assets
 ┃ ┗ react.svg
 ┣ components
 ┃ ┣ ChatBotBox.jsx
 ┃ ┗ FireMap.jsx
 ┣ pages
 ┃ ┣ DashboardPage.jsx
 ┃ ┣ FirefighterPage.jsx
 ┃ ┗ ReportPage.jsx
 ┣ App.css
 ┣ App.jsx
 ┗ main.jsx
```

- --

## 📌 사용 기술 스택

- Frontend: React (Vite)
- 지도: Kakao Map API
- Backend: Spring Boot, JPA, MySQL *(연동은 테스트 구조 기준)*
- 챗봇: GPT API 연동 (계획 중)
- --

## ❗ 주의

- 본 프로젝트는 정식 팀 저장소가 아닙니다.
- 공식 팀 저장소에서는 기능, 코드 구조, API 설계 등이 모두 **팀의 합의에 따라 재구성**될 예정입니다.
- 이 저장소의 코드는 **기초 뼈대이자 참고용**입니다.
