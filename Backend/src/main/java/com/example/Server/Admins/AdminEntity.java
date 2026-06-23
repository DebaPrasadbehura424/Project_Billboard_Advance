package com.example.Server.Admins;

import com.example.Server.enums.AdminStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "admins")
@Data
public class AdminEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @Column(unique = true)
    private String email;
    private String document;
    private String name;
    private String phone;

    private String specialId;
    private String password;
    private String category;

    @Enumerated(EnumType.STRING)
    private AdminStatus status;

}
