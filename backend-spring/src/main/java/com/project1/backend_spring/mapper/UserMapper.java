package com.project1.backend_spring.mapper;

import org.apache.ibatis.annotations.Mapper;
import com.project1.backend_spring.dto.UserDTO;
import com.project1.backend_spring.dto.DeviceDTO;
import java.util.List;

@Mapper
public interface UserMapper {
    // [User 테이블 관련]
    void insertUser(UserDTO userDTO);           // 회원가입
    List<UserDTO> findAllUsers();               // 회원 전체 조회
    UserDTO findUserById(int historyId);        // 특정 회원 조회 (PK로 검색)

    // [Device 테이블 관련]
    void insertDevice(DeviceDTO deviceDTO);             // 기기 등록
    List<DeviceDTO> findDevicesByUserId(int historyId); // 내 기기 목록 조회
}