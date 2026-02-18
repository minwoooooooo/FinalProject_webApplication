package com.project1.backend_spring.dto;

import lombok.Data;

@Data
public class AutoReportRequestDTO {
    // 1. 로그인 정보 (User 테이블)
    private String portalId;      // 안전신문고 아이디
    private String portalPw;      // 안전신문고 비번
    private String userName;      // 신고자 이름
    private String userPhone;     // 신고자 폰번호 (Report 테이블 phone_number)
    
    // 2. 신고 내용 (DB 매핑 수정됨)
    private String title;         // 신고 제목 (Incident_log 테이블 violation_type)
    private String content;       // 신고 내용 (Report 테이블 description)
    private String carNum;        // 차량 번호 (Incident_log 테이블 plate_no)
    private String videoUrl;      // 영상 주소
    
    // ★ 추가됨: 위반 장소 (Incident_log 테이블 location)
    private String location;      
    
    // 3. 날짜 시간
    private String occurDate;     // 위반 날짜 (YYYY-MM-DD)
    private String occurTimeHh;   // 시 (HH)
    private String occurTimeMm;   // 분 (MM)
}