package com.example.Server.Reports;

import java.util.List;

import com.example.Server.Citizens.CitizenEntity;
import com.example.Server.FiledWorker.FwEntity;
import com.example.Server.enums.ReportStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "reports")
@Data
public class ReportsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String description;

    private Integer riskPercentage;

    private String riskLevel;

    private Double lng;

    private Double lat;

    private ReportStatus reportStatus;

    private String category; // admin add kariba;
    private String FieldWorker; // admin add kariba;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    @JsonIgnore
    private CitizenEntity citizenEntity;

    @ManyToOne
    @JoinColumn(name = "fw_id")
    @JsonIgnore
    private FwEntity fwEntity;

    @OneToMany(mappedBy = "reportsEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportPhotoEntity> reportPhotoEntities;
}