package com.project1.backend_spring.controller;

import com.project1.backend_spring.dto.ReportDTO;
import com.project1.backend_spring.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports") // ★ 리액트가 요청하는 주소
@CrossOrigin(origins = "*")     // 리액트 접속 허용
public class ReportController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ReportDTO>> getMyReports(@PathVariable int userId) {
        System.out.println("📂 [ReportController] 신고 내역 조회 요청 (User ID: " + userId + ")");
        
        // UserMapper가 DB에서 데이터를 싹 긁어옴
        List<ReportDTO> reports = userMapper.findReportsByUserId(userId);
        
        return ResponseEntity.ok(reports);
    }
}
