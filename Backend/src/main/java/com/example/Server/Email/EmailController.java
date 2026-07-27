package com.example.Server.Email;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/mail")
public class EmailController {

    private final EmailService emailService;

    EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/sent")
    public ResponseEntity<?> sentMessage(@RequestBody EmailRequest email) {
        if (email.getTo().isEmpty() || email.getSubject().isEmpty() || email.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something is missing");
        }
        int res = emailService.sendMessage(email.getTo(), email.getSubject(), email.getBody());
        if (res == 404) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something might be wrong");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Email sent successfully");
    }

}
