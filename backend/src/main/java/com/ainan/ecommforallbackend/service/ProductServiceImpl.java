package com.ainan.ecommforallbackend.service;

import com.ainan.ecommforallbackend.dto.*;
import com.ainan.ecommforallbackend.entity.Brand;
import com.ainan.ecommforallbackend.entity.Category;
import com.ainan.ecommforallbackend.entity.Product;
import com.ainan.ecommforallbackend.entity.User;
import com.ainan.ecommforallbackend.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.mapper.ProductMapper;
import com.ainan.ecommforallbackend.repository.BrandRepository;
import com.ainan.ecommforallbackend.repository.CategoryRepository;
import com.ainan.ecommforallbackend.repository.ProductRepository;
import com.ainan.ecommforallbackend.repository.UserRepository;
import com.ainan.ecommforallbackend.specification.ProductSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductImageService productImageService;
    private final ProductVariantService productVariantService;
    private final VariantImageService variantImageService;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        entityManager.clear();
        Page<Product> products = productRepository.findAll(pageable);
        return addPrimaryImagesToProducts(products.map(productMapper::productToProductDto));
    }

    @Override
    public Page<ProductDto> getFilteredProducts(ProductFilterDto filter, Pageable pageable) {
        final Specification<Product> spec = ProductSpecification.getSpecification(filter);
        return addPrimaryImagesToProducts(productRepository.findAll(spec, pageable).map(productMapper::productToProductDto));
    }

    @Override
    public ProductDto getProductById(UUID id, List<String> includes) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        ProductDto productDto = productMapper.productToProductDto(product);
        if (includes != null && !includes.isEmpty()) {
            if (includes.contains("images")) {
                Page<ProductImageDto> imagesPage = productImageService.getImagesByProductId(id, Pageable.unpaged());
                productDto.setImages(imagesPage.getContent());
            }
            if (includes.contains("variants")) {
                Page<ProductVariantDto> variantsPage = productVariantService.getVariantsByProductId(id, Pageable.unpaged());
                productDto.setVariants(variantsPage.getContent());

                // load variant images if requested
                if (includes.contains("variantImages") && productDto.getVariants() != null) {
                    for (ProductVariantDto variant : productDto.getVariants()) {
                        Page<VariantImageDto> variantImagesPage = variantImageService.getImagesByVariantId(
                                variant.getId(), Pageable.unpaged());
                        variant.setImages(variantImagesPage.getContent());
                    }
                }
            }
        }
        return productDto;
    }

    @Override
    public ProductDto createProduct(ProductCreateDto productCreateDto) {
        Brand brand = brandRepository.findById(productCreateDto.getBrandId()).orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + productCreateDto.getBrandId()));
        Category category = categoryRepository.findById(productCreateDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productCreateDto.getCategoryId()));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
        User seller = userRepository.findByUsername(authenticatedUserName).orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + authenticatedUserName));
        Product product = productMapper.productCreateDtoToProduct(productCreateDto);
        checkAccessPermission(product);
        product.setSeller(seller);
        product.setBrand(brand);
        product.setCategory(category);
        product.setIsActive(true);
        product.setIsFeatured(false);
        product.setSku(generateProductSku(product));
        Product savedProduct = productRepository.save(product);
        return productMapper.productToProductDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(UUID id, ProductDto productDto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        checkAccessPermission(product);
        productMapper.productDtoToProduct(productDto, product);
        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId()).orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + productDto.getBrandId()));
            product.setBrand(brand);
        }
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }
        if (productDto.getSellerId() != null) {
            User seller = userRepository.findById(productDto.getSellerId()).orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + productDto.getSellerId()));
            product.setSeller(seller);
        }
        Product savedProduct = productRepository.save(product);
        return productMapper.productToProductDto(savedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        checkAccessPermission(product);
        productRepository.delete(product);
    }

    @Override
    public Page<ProductDto> getProductsByCategoryId(UUID categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        // First, try to get products from the specified category
        Page<Product> productsPage = productRepository.findByCategoryId(category.getId(), pageable);

        // If no products found, search through subcategories
        if (productsPage.isEmpty()) {
            // Find subcategories of this category
            List<Category> subcategories = categoryRepository.findByParentId(categoryId);

            if (!subcategories.isEmpty()) {
                // Collect all subcategory IDs
                List<UUID> subcategoryIds = new ArrayList<>();
                for (Category subcat : subcategories) {
                    subcategoryIds.add(subcat.getId());
                    // You could extend this to get deeper levels of subcategories if needed
                }

                // Find products from all subcategories
                productsPage = productRepository.findByCategoryIdIn(subcategoryIds, pageable);
            }
        }

        return addPrimaryImagesToProducts(productsPage.map(productMapper::productToProductDto));
    }

    @Override
    public Page<ProductDto> getProductsByBrandId(UUID brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId).orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));

        Page<ProductDto> productDtos = productRepository.findByBrandId(brand.getId(), pageable).map(productMapper::productToProductDto);
        return addPrimaryImagesToProducts(productDtos);
    }

    @Override
    public Page<ProductDto> getProductsBySellerId(UUID sellerId, Pageable pageable) {
        User seller = userRepository.findById(sellerId).orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        Page<ProductDto> productDtos = productRepository.findBySellerId(seller.getId(), pageable).map(productMapper::productToProductDto);
        return addPrimaryImagesToProducts(productDtos);
    }

    @Override
    public Page<ProductDto> getActiveProducts(Pageable pageable) {
        return addPrimaryImagesToProducts(productRepository.findByIsActive(true, pageable).map(productMapper::productToProductDto));
    }

    @Override
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return addPrimaryImagesToProducts(productRepository.findByIsFeatured(true, pageable).map(productMapper::productToProductDto));
    }

    ///  HELPER FUNCTIONS
    // Check if the authenticated user is the seller of the product
    public void checkAccessPermission(Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SELLER"));
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if ((!isSeller || !product.getSeller().getUsername().equals(authenticatedUserName)) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to access this product");
        }
    }

    // Format: {BrandPrefix}-{CategoryPrefix}-{ProductPrefix}-{RandomNumber}
    private String generateProductSku(Product product) {
        String brandPrefix = product.getBrand().getName().substring(0, Math.min(3, product.getBrand().getName().length())).toUpperCase();
        String categoryPrefix = product.getCategory().getName().substring(0, Math.min(3, product.getCategory().getName().length())).toUpperCase();
        String productPrefix = product.getName().substring(0, Math.min(3, product.getName().length())).toUpperCase();
        String randomPart = String.format("%04d", (int) (Math.random() * 10000));

        return String.format("%s-%s-%s-%s", brandPrefix, categoryPrefix, productPrefix, randomPart);
    }

    private Page<ProductDto> addPrimaryImagesToProducts(Page<ProductDto> productDtos) {
        productDtos.forEach(productDto -> {
            Page<ProductImageDto> primaryImages = productImageService.getImagesByProductId(
                    productDto.getId(),
                    PageRequest.of(0, 1)
            );

            if (!primaryImages.getContent().isEmpty()) {
                productDto.setPrimaryImage(primaryImages.getContent().get(0));
            }
            productDto.setImages(null);
            productDto.setVariants(null);
        });

        return productDtos;
    }
}
