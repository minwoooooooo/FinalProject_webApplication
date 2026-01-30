package com.project1.backend_spring.dto;

import lombok.Data;

@Data
public class ReportDTO {
    private int reportId;      // PK
    private int historyId;     // FK
    private int incidentLog;   // FK
    private String serialNo;   // FK
    private String isSubmitted; // TinyInt(1)은 boolean으로 받음
}