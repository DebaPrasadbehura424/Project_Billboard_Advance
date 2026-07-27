package com.example.Server.FiledWorker;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FwRepository extends JpaRepository<FwEntity, Long> {

    Optional<FwEntity> findByEmail(String email);

    Optional<FwEntity> findBySpecialId(String specialId);

}
