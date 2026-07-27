package com.example.Server.Reports;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.Server.Citizens.CitizenEntity;
import com.example.Server.Citizens.CitizenRepository;
import com.example.Server.FiledWorker.FwEntity;
import com.example.Server.FiledWorker.FwRepository;
import com.example.Server.enums.ReportStatus;
import com.example.Server.jwt.JwtUtil;
import com.example.dto.CitizenDto;
import com.example.dto.FwDto;

@RestController
@RequestMapping("/api/reports")
public class ReportControllers {

    private final CitizenRepository citizenRepository;

    private final ReportsRepository reportsRepository;

    private final FwRepository fwRepository;

    ReportControllers(CitizenRepository citizenRepository, ReportsRepository reportsRepository,
            FwRepository fwRepository) {
        this.citizenRepository = citizenRepository;
        this.reportsRepository = reportsRepository;
        this.fwRepository = fwRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReport(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ReportRequest request) {

        String token = authHeader.substring(7);

        String email = JwtUtil.extractEmail(token);

        CitizenEntity citizen = citizenRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 4. Create report
        ReportsEntity report = new ReportsEntity();
        report.setDescription(request.getDescription());
        report.setReportStatus(ReportStatus.PENDING);
        report.setRiskLevel(request.getRiskLevel());
        report.setRiskPercentage(request.getRiskPercentage());
        report.setLat(request.getLat());
        report.setLng(request.getLng());
        report.setCitizenEntity(citizen);

        // 5. Add photos
        List<ReportPhotoEntity> photos = new ArrayList<>();

        for (String img : request.getImageUrls()) {

            ReportPhotoEntity photo = new ReportPhotoEntity();
            photo.setImageUrl(img);
            photo.setReportsEntity(report);

            photos.add(photo);
        }

        report.setReportPhotoEntities(photos);

        // 6. Save
        ReportsEntity saved = reportsRepository.save(report);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReportsEntity>> getAllReports() {

        return ResponseEntity.ok(reportsRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {

        ReportsEntity report = reportsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Report not found with id: " + id));

        Map<String, Object> response = new HashMap<>();
        response.put("report", report);

        if (report.getCitizenEntity() != null && report.getCitizenEntity().getId() != null) {
            CitizenEntity citizen = citizenRepository.findById(report.getCitizenEntity().getId()).get();
            CitizenDto citizenDto = new CitizenDto();
            citizenDto.setCitizenName(citizen.getCitizenName());
            citizenDto.setAge(citizen.getAge());
            citizenDto.setEmail(citizen.getEmail());
            response.put("citizen", citizenDto);
        } else {
            response.put("citizen", null);
        }

        if (report.getFwEntity() != null && report.getFwEntity().getId() != null) {
            FwEntity fwEntity = fwRepository.findById(report.getFwEntity().getId()).get();
            FwDto fwDto = new FwDto();
            fwDto.setName(fwEntity.getName());
            fwDto.setCategory(fwEntity.getCategory());
            fwDto.setPhone(fwDto.getPhone());
            response.put("fws", fwDto);
        } else {
            response.put("fws", null);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-reports")
    public ResponseEntity<?> getMyReports(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);

        CitizenEntity citizen = citizenRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<ReportsEntity> reports = reportsRepository.findByCitizenEntityId(citizen.getId());

        return ResponseEntity.ok(reports);
    }

}