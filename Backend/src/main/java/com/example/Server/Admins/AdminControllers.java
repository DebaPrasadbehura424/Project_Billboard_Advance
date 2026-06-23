package com.example.Server.Admins;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Server.Email.EmailService;
import com.example.Server.enums.AdminStatus;
import com.example.Server.jwt.JwtUtil;

@RestController
@RequestMapping("/api/admins")
public class AdminControllers {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;

    // ================= REGISTER =================

    @PostMapping("/apply")
    public ResponseEntity<?> adminRegister(
            @RequestBody AdminEntity admin) {

        Optional<AdminEntity> existingAdmin = adminRepository.findByEmail(admin.getEmail());

        if (existingAdmin.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists");
        }

        admin.setStatus(AdminStatus.PENDING);
        admin.setCategory("Admin");

        AdminEntity savedAdmin = adminRepository.save(admin);

        return ResponseEntity.ok(savedAdmin);
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(
            @RequestBody AdminEntity admin) {

        Optional<AdminEntity> existingAdmin = adminRepository.findBySpecialId(admin.getSpecialId());

        // Admin not found
        if (!existingAdmin.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Admin not found");
        }

        AdminEntity currentUser = existingAdmin.get();

        // Password check
        if (!currentUser.getPassword().equals(admin.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        if (currentUser.getStatus().equals(AdminStatus.SUPER_ADMIN)) {

            return ResponseEntity.ok(currentUser.getSpecialId());
        }

        // Approval check
        if (!currentUser.getStatus().equals(AdminStatus.APPROVED)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not approved authority");
        }

        // Generate token
        String token = JwtUtil.generateToken(currentUser.getEmail());
        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login Success");
        response.put("token", token);
        response.put("id", currentUser.getSpecialId());

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAdminAll() {
        List<AdminEntity> adminAll = adminRepository.findAll();
        return ResponseEntity.ok().body(adminAll);
    }

    // ================= GET ADMIN DETAILS USING TOKEN =================
    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(
            @RequestHeader("Authorization") String authHeader) {

        try {

            // Remove Bearer
            String token = authHeader.substring(7);

            // Extract email from token
            String email = JwtUtil.extractEmail(token);

            // Find admin
            Optional<AdminEntity> admin = adminRepository.findByEmail(email);

            if (!admin.isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Admin not found");
            }

            return ResponseEntity.ok(admin.get());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Token");
        }
    }

    @PatchMapping("/status_update")
    public ResponseEntity<?> updateStatus(@RequestBody AdminEntity adminEntity) {

        Optional<AdminEntity> optionalAdmin = adminRepository.findByEmail(adminEntity.getEmail());

        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Admin does not exist");
        }

        AdminEntity existingAdmin = optionalAdmin.get();

        AdminStatus newStatus = adminEntity.getStatus();

        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status cannot be null");
        }

        existingAdmin.setStatus(newStatus);

        String subject;
        String message;

        switch (newStatus) {

            case APPROVED -> {

                String alpha = "1234567890";
                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < 10; i++) {
                    int randomIndex = (int) (Math.random() * alpha.length());
                    sb.append(alpha.charAt(randomIndex));
                }

                String generatedId = sb.toString();
                existingAdmin.setSpecialId(generatedId);
                existingAdmin.setPassword("123");

                subject = "Account Approved";
                message = "Congratulations! Your admin account has been approved. " +
                        "Your ID = " + generatedId +
                        " and password = 123";
            }

            case REJECTED -> {
                subject = "Account Rejected";
                message = "Sorry, your admin request has been rejected.";
            }

            case SUPER_ADMIN -> {
                subject = "Super Admin Access Granted";
                message = "You now have SUPER ADMIN privileges.";
            }

            case LIVE -> {
                subject = "Account Activated";
                message = "Your account is now LIVE and active.";
            }

            default -> {
                subject = "Status Updated";
                message = "Your account status is now: " + newStatus;
            }
        }

        adminRepository.save(existingAdmin);
        emailService.sendMessage(existingAdmin.getEmail(), subject, message);

        return ResponseEntity.ok("Status updated successfully");
    }
}