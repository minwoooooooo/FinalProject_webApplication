package com.project1.backend_spring.controller;

import com.project1.backend_spring.dto.UserDTO;
import com.project1.backend_spring.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class TestController {

    @Autowired
    private UserMapper userMapper; // MyBatis 매퍼 주입

    @GetMapping("/test/users")
    public List<UserDTO> getAllUsers() {
        // DB에서 유저 목록을 가져와서 브라우저에 뿌려줍니다
        return userMapper.findAllUsers();
    }
}