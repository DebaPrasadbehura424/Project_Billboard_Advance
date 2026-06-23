package com.example.Server.Reports;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportsRepository extends JpaRepository<ReportsEntity, Long> {

    List<ReportsEntity> findByCitizenEntityId(Long id);
    

}
