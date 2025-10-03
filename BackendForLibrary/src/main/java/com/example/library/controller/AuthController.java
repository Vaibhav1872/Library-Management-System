package com.example.library.controller;

import com.example.library.model.User;
import com.example.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String passwordFromLogin = credentials.get("password");

        // --- Start of Debugging ---
        System.out.println("--- Login Attempt ---");
        System.out.println("Attempting login for user: '" + username + "'");
        System.out.println("Password received from frontend: '" + passwordFromLogin + "'");
        // --- End of Debugging ---

        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String passwordFromDB = user.getPassword();

            // --- More Debugging ---
            System.out.println("Password found in database: '" + passwordFromDB + "'");
            // --- End of Debugging ---

            if (passwordFromDB.equals(passwordFromLogin)) {
                System.out.println("Passwords MATCH. Login successful.");
                return ResponseEntity.ok(user);
            } else {
                System.out.println("Passwords DO NOT MATCH. Login failed.");
            }
        } else {
            System.out.println("User '" + username + "' not found in the database.");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}