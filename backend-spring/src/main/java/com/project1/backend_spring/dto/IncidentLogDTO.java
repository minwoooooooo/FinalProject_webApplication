package com.project1.backend_spring.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class IncidentLogDTO {
    private int incidentLog;      // PK (컬럼명이 테이블명과 같음)
    private String serialNo;      // FK
    private String videoUrl;
    private LocalDateTime time;   
    private String locationGps;

}