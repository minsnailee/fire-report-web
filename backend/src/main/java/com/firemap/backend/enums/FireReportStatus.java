package com.firemap.backend.enums;

public enum FireReportStatus  {
    REPORTED,            // 신고 접수됨
    DISPATCHED,          // 출동 지시됨
    EN_ROUTE,            // 진입 중
    SUPPRESSING,         // 진압 중
    REQUESTING_SUPPORT,  // 추가 지원 요청됨
    SUPPRESSED,          // 진압 완료
    RECOVERING,          // 현장 복구 중
    TERMINATED           // 종료
}
