package com.ainan.ecommforallbackend.repository;

import com.ainan.ecommforallbackend.dto.CategoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.ainan.ecommforallbackend.entity.Category;
@Repository
public interface CategoryRepository extends  JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    Optional<Category> findByNameIgnoreCase(String name);
    Page<Category> findByParentIsNull(Pageable pageable);
    @Modifying
    @Query("UPDATE Category c SET c.parent = null WHERE c.parent.id = :id")
    void setChildrenParentToNull(@Param("id") UUID id);
}
