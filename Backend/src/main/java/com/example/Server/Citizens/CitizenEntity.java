package com.example.Server.Citizens;

import java.util.List;

import com.example.Server.Reports.ReportsEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "citizens")
@Data
public class CitizenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String citizenName;
    private Integer age;
    private String password;
    private String role;

    @OneToMany(mappedBy = "citizenEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReportsEntity> reportsEntities;

}
