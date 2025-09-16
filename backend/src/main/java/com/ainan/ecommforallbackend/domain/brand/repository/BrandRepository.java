package com.ainan.ecommforallbackend.domain.brand.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ainan.ecommforallbackend.domain.brand.entity.Brand;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID> {
    Page<Brand> findByIsActiveTrue(Pageable pageable);
    Optional<Brand> findByNameIgnoreCase(String name);
}
