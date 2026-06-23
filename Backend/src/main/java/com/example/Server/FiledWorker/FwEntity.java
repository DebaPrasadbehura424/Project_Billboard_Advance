package com.example.Server.FiledWorker;

import java.util.List;

import com.example.Server.Reports.ReportsEntity;
import com.example.Server.enums.FwStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "fws")
@Data
public class FwEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String document;

    private String specialId;
    private String password;
    private String name;
    private String phone;
    private String category;

    @Enumerated(EnumType.STRING)
    private FwStatus status;

    @OneToMany(mappedBy = "fwEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportsEntity> reportsEntities;

}
