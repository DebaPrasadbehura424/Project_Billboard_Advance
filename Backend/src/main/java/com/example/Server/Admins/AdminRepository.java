package com.example.Server.Admins;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminEntity, Long> {

    Optional<AdminEntity> findByEmail(String email);

    Optional<AdminEntity> findBySpecialId(String specialId);

}
