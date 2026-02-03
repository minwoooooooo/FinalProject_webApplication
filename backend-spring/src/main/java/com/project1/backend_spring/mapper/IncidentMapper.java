package com.project1.backend_spring.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.project1.backend_spring.dto.IncidentLogDTO;
import com.project1.backend_spring.dto.ReportDTO;
import java.util.List;
<<<<<<< HEAD
=======
// import java.util.Map; // ★ 삭제됨 (사용하지 않음)
>>>>>>> upstream/master

@Mapper
public interface IncidentMapper {
    // 1. 사고 로그 저장
    void insertIncident(IncidentLogDTO logDTO);

    // 2. 사고 로그 전체 조회
    List<IncidentLogDTO> findAllIncidents();
    
    // 3. 신고서 저장
    void insertReport(ReportDTO reportDTO);

<<<<<<< HEAD
    // [NEW] 4. 신고서 전체 조회 (관리자용)
    List<ReportDTO> findAllReports();

    // [NEW] 5. 특정 유저의 신고 내역 조회 (사용자용)
    List<ReportDTO> findReportsByUserId(int historyId);
=======
    // 4. 조회 및 관리
    List<ReportDTO> findAllReports();
    List<ReportDTO> findReportsByUserId(int historyId);
    
    // 5. 삭제 및 업데이트
    void deleteReportById(int reportId);
    void updateReportStatus(int reportId);
>>>>>>> upstream/master
}