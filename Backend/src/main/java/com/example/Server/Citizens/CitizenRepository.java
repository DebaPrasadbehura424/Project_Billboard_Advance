package com.example.Server.Citizens;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CitizenRepository extends JpaRepository<CitizenEntity, Long> {
    Optional<CitizenEntity> findByEmail(String email);

}
