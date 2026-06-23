package com.example.Server.FiledWorker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Server.Email.EmailService;
import com.example.Server.enums.FwStatus;
import com.example.Server.jwt.JwtUtil;

@RestController
@RequestMapping("/api/fw")
public class FwControllers {

    @Autowired
    private FwRepository fwRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyFw(@RequestBody FwEntity fw) {

        Optional<FwEntity> existing = fwRepository.findByEmail(fw.getEmail());

        if (existing.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists");
        }

        fw.setStatus(FwStatus.PENDING);
        fw.setCategory("Field Work");

        FwEntity saved = fwRepository.save(fw);

        return ResponseEntity.ok(saved);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> loginFw(@RequestBody FwEntity fw) {

        Optional<FwEntity> existing = fwRepository.findBySpecialId(fw.getSpecialId());

        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Field Worker not found");
        }

        FwEntity current = existing.get();

        if (!current.getPassword().equals(fw.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        if (!current.getStatus().equals(FwStatus.APPROVED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not approved yet");
        }

        String token = JwtUtil.generateToken(current.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login Success");
        response.put("token", token);
        response.put("id", current.getSpecialId());

        return ResponseEntity.ok(response);
    }

    // ================= GET ALL FW =================
    @GetMapping("/all")
    public ResponseEntity<?> getAllFw() {
        List<FwEntity> list = fwRepository.findAll();
        return ResponseEntity.ok(list);
    }

    // ================= PROFILE (TOKEN) =================
    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7);
            String email = JwtUtil.extractEmail(token);

            Optional<FwEntity> fw = fwRepository.findByEmail(email);

            if (fw.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("FW not found");
            }

            return ResponseEntity.ok(fw.get());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }
    }

    // ================= STATUS UPDATE (ADMIN ACTION) =================
    @PatchMapping("/status_update")
    public ResponseEntity<?> updateStatus(@RequestBody FwEntity fwEntity) {

        Optional<FwEntity> optional = fwRepository.findByEmail(fwEntity.getEmail());

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("FW does not exist");
        }

        FwEntity existing = optional.get();

        FwStatus newStatus = fwEntity.getStatus();

        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status cannot be null");
        }

        existing.setStatus(newStatus);

        String subject;
        String message;

        switch (newStatus) {

            case APPROVED -> {
                String alpha = "1234567890";
                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < 10; i++) {
                    int index = (int) (Math.random() * alpha.length());
                    sb.append(alpha.charAt(index));
                }

                String generatedId = sb.toString();

                existing.setSpecialId(generatedId);
                existing.setPassword("123");

                subject = "FW Account Approved";
                message = "Your Field Worker account is approved. " +
                        "ID: " + generatedId +
                        " Password: 123";
            }

            case REJECTED -> {
                subject = "FW Account Rejected";
                message = "Sorry, your Field Worker request has been rejected.";
            }

            case LIVE -> {
                subject = "FW Activated";
                message = "Your Field Worker account is now LIVE.";
            }

            default -> {
                subject = "FW Status Updated";
                message = "Your status is now: " + newStatus;
            }
        }

        fwRepository.save(existing);
        emailService.sendMessage(existing.getEmail(), subject, message);

        return ResponseEntity.ok("FW status updated successfully");
    }

    @GetMapping("/my-reports")
    public ResponseEntity<?> getMyReports(@RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.substring(7);
            String email = JwtUtil.extractEmail(token);

            Optional<FwEntity> fwOpt = fwRepository.findByEmail(email);

            if (fwOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("FW not found");
            }

            FwEntity fw = fwOpt.get();

            return ResponseEntity.ok(fw.getReportsEntities());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }
    }
}