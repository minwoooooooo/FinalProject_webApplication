package com.project1.backend_spring.dto;

import lombok.Data; // Lombok 사용 시

@Data
public class UserDTO {
    private int historyId;        // DB의 history_id
    private String userName;      // DB의 user_name
    private String userNumber;    // DB의 user_number
    private String email;
    private String loginSocialId; // DB의 login_social_id
    private String safetyPortalId;// DB의 safety_portal_id
    private String safetyPortalPw;// DB의 safety_portal_pw
}