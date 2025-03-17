package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID> {
    Page<Brand> findByIsActiveTrue(Pageable pageable);
    Optional<Brand> findByNameIgnoreCase(String name);
}
