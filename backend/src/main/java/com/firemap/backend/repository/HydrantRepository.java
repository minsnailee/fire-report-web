package com.firemap.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.firemap.backend.entity.HydrantEntity;

public interface HydrantRepository extends JpaRepository<HydrantEntity, Long> {
}
