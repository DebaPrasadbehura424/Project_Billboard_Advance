package com.example.Server.Citizens;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.Server.jwt.JwtUtil;

@RestController
@RequestMapping("/api/citizens")
public class CitizenControllers {

        @Autowired
        private CitizenRepository citizenRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        // LOGIN
        @PostMapping("/login")
        public ResponseEntity<?> citizenLogin(
                        @RequestBody CitizenEntity citizen) {

                Optional<CitizenEntity> existingCitizen = citizenRepository.findByEmail(
                                citizen.getEmail());

                // Email Check
                if (!existingCitizen.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email doesn't exist");
                }

                CitizenEntity dbCitizen = existingCitizen.get();

                // Password Match
                boolean match = passwordEncoder.matches(
                                citizen.getPassword(),
                                dbCitizen.getPassword());
                System.out.println(match);

                if (!match) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Password mismatch");
                }

                // Generate JWT Token
                String token = JwtUtil.generateToken(
                                dbCitizen.getEmail());

                // Response
                Map<String, Object> response = new HashMap<>();

                response.put("message", "Login Success");
                response.put("token", token);
                response.put("id", dbCitizen.getId());

                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        // REGISTER
        @PostMapping("/register")
        public ResponseEntity<?> citizenRegister(
                        @RequestBody CitizenEntity citizen) {

                Optional<CitizenEntity> existingCitizen = citizenRepository.findByEmail(
                                citizen.getEmail());

                // Email Exists Check
                if (existingCitizen.isPresent()) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email already exists");
                }

                // Encrypt Password
                citizen.setPassword(
                                passwordEncoder.encode(
                                                citizen.getPassword()));

                citizen.setRole("CITIZEN");

                // Save Citizen
                CitizenEntity savedCitizen = citizenRepository.save(citizen);

                return ResponseEntity.ok(savedCitizen);
        }

        @GetMapping("/MyDeatils")
        public ResponseEntity<?> citizenDetails(@RequestHeader("Authorization") String authHeader) {
                String token = authHeader.substring(7);
                String email = JwtUtil.extractEmail(token);
                CitizenEntity currentCitizen = new CitizenEntity();

                Optional<CitizenEntity> existingCitizen = citizenRepository.findByEmail(
                                email);

                // Email Check
                if (!existingCitizen.isPresent()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email doesn't exist");
                }
                CitizenEntity inputCitizen = existingCitizen.get();
                currentCitizen.setEmail(inputCitizen.getEmail());
                currentCitizen.setCitizenName(inputCitizen.getCitizenName());
                currentCitizen.setAge(inputCitizen.getAge());
                currentCitizen.setRole(inputCitizen.getRole());

                return ResponseEntity.status(HttpStatus.ACCEPTED).body(currentCitizen);

        }
}