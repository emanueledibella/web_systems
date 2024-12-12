package com.web_systems.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web_systems.repository.UsersRepository;

@RequestMapping("user")
public class UserController {

    UsersRepository usersRepository = new UsersRepository();
    
    @PostMapping("/")
    public String createUser(
        @RequestParam(value = "name") String name,
        @RequestParam(value = "surname") String surname,
        @RequestParam(value = "gender") int gender,
        @RequestParam(value = "email") String email,
        @RequestParam(value = "password") String password
    ) {
        return this.usersRepository.createUser(name, surname, gender, email, password);
    }
    
}
