package com.project1.backend_spring.dto;

import lombok.Data;

@Data
public class DeviceDTO {
    private String serialNo;  // PK
    private int historyId;    // FK (User)
}