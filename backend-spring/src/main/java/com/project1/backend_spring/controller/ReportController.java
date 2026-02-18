package com.project1.backend_spring.controller;

import com.project1.backend_spring.dto.ReportDTO;
import com.project1.backend_spring.dto.AutoReportRequestDTO; // ★ 추가됨: 데이터를 담을 그릇
import com.project1.backend_spring.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate; // ★ 추가됨: 파이썬과 통신하는 도구

import java.util.List;

@RestController
@RequestMapping("/api/reports") // 리액트가 요청하는 기본 주소
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 리액트 접속 허용
public class ReportController {

    @Autowired
    private UserMapper userMapper;

    // ★ 추가됨: 파이썬 AI 서버 주소 (도커 내부 통신용 이름 'ai-service' 사용)
    private static final String PYTHON_SERVER_URL = "http://ai-service:8000/api/auto-report";

    // 1. 기존 기능: 내 신고 내역 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<ReportDTO>> getMyReports(@PathVariable int userId) {
        System.out.println("📂 [ReportController] 신고 내역 조회 요청 (User ID: " + userId + ")");
        
        List<ReportDTO> reports = userMapper.findReportsByUserId(userId);
        
        return ResponseEntity.ok(reports);
    }

    // 2. ★ 신규 기능: 안전신문고 자동 신고 요청 처리 ★
    // 리액트에서 이 주소(/api/reports/{id}/auto-report)로 POST 요청을 보냄
    @PostMapping("/{reportId}/auto-report")
    public ResponseEntity<?> requestAutoReport(@PathVariable int reportId) {
        System.out.println("🤖 [ReportController] 자동 신고 봇 실행 요청 (Report ID: " + reportId + ")");

        try {
            // A. DB에서 크롤링에 필요한 모든 데이터(ID, PW, 차번호, 영상주소 등)를 한방에 조회
            // (UserMapper.xml에 getAutoReportData 쿼리가 있어야 함)
            AutoReportRequestDTO requestData = userMapper.getAutoReportData(reportId);
            
            if (requestData == null) {
                return ResponseEntity.status(404).body("해당 신고 데이터를 찾을 수 없습니다.");
            }
            
            // B. 안전신문고 아이디/비번이 있는지 검사
            if (requestData.getPortalId() == null || requestData.getPortalId().isEmpty()) {
                return ResponseEntity.status(400).body("안전신문고 ID가 설정되지 않았습니다. 마이페이지에서 먼저 설정해주세요.");
            }

            // C. 파이썬 서버(FastAPI)로 데이터를 던져서 크롤링 시작시킴
            RestTemplate restTemplate = new RestTemplate();
            String result = restTemplate.postForObject(PYTHON_SERVER_URL, requestData, String.class);
            
            System.out.println("✅ [ReportController] 파이썬 응답: " + result);
            return ResponseEntity.ok("자동 신고 프로세스가 시작되었습니다. 결과는 잠시 후 확인하세요.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("자동 신고 요청 실패 (서버 에러): " + e.getMessage());
        }
    }
}