package com.project1.backend_spring.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.project1.backend_spring.dto.IncidentLogDTO;
import com.project1.backend_spring.dto.ReportDTO;
import java.util.List;

@Mapper
public interface IncidentMapper {
    // 1. 사고 로그 저장
    void insertIncident(IncidentLogDTO logDTO);

    // 2. 사고 로그 전체 조회
    List<IncidentLogDTO> findAllIncidents();
    
    // 3. 신고서 저장
    void insertReport(ReportDTO reportDTO);

    // [NEW] 4. 신고서 전체 조회 (관리자용)
    List<ReportDTO> findAllReports();

    // [NEW] 5. 특정 유저의 신고 내역 조회 (사용자용)
    List<ReportDTO> findReportsByUserId(int historyId);
}