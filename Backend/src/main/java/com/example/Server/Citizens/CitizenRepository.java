package com.example.Server.Citizens;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitizenRepository extends JpaRepository<CitizenEntity, Long> {
    Optional<CitizenEntity> findByEmail(String email);

}
