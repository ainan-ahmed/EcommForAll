package com.ainan.ecommforallbackend.domain.product.service;

import com.ainan.ecommforallbackend.core.exception.ResourceNotFoundException;
import com.ainan.ecommforallbackend.core.specification.ProductSpecification;
import com.ainan.ecommforallbackend.domain.brand.entity.Brand;
import com.ainan.ecommforallbackend.domain.brand.repository.BrandRepository;
import com.ainan.ecommforallbackend.domain.category.entity.Category;
import com.ainan.ecommforallbackend.domain.category.repository.CategoryRepository;
import com.ainan.ecommforallbackend.domain.product.dto.ProductCreateDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductFilterDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductImageDto;
import com.ainan.ecommforallbackend.domain.product.dto.ProductVariantDto;
import com.ainan.ecommforallbackend.domain.product.dto.VariantImageDto;
import com.ainan.ecommforallbackend.domain.product.entity.Product;
import com.ainan.ecommforallbackend.domain.product.mapper.ProductMapper;
import com.ainan.ecommforallbackend.domain.product.repository.ProductRepository;
import com.ainan.ecommforallbackend.domain.user.entity.User;
import com.ainan.ecommforallbackend.domain.user.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
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
    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        entityManager.clear();
        Page<Product> products = productRepository.findAll(pageable);
        return addPrimaryImagesToProducts(products.map(productMapper::productToProductDto));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getFilteredProducts(ProductFilterDto filter, Pageable pageable) {
        final Specification<Product> spec = ProductSpecification.getSpecification(filter);
        return addPrimaryImagesToProducts(
                productRepository.findAll(spec, pageable).map(productMapper::productToProductDto));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProductById(UUID id, List<String> includes) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        ProductDto productDto = productMapper.productToProductDto(product);

        if (includes != null && !includes.isEmpty()) {
            if (includes.contains("images")) {
                Page<ProductImageDto> imagesPage = productImageService.getImagesByProductId(id, Pageable.unpaged());
                productDto.setImages(imagesPage.getContent());
            }

            if (includes.contains("variants")) {
                Page<ProductVariantDto> variantsPage = productVariantService.getVariantsByProductId(id,
                        Pageable.unpaged());
                productDto.setVariants(variantsPage.getContent());

                // Load variant images if requested
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
    @Transactional
    public ProductDto createProduct(ProductCreateDto productCreateDto) {
        // Validate required fields for products without variants
        validateProductCreation(productCreateDto);

        // Fetch related entities
        Brand brand = brandRepository.findById(productCreateDto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Brand not found with id: " + productCreateDto.getBrandId()));

        Category category = categoryRepository.findById(productCreateDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + productCreateDto.getCategoryId()));

        // Get authenticated seller
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
        User seller = userRepository.findByUsername(authenticatedUserName)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found with username: " + authenticatedUserName));

        // Create product entity
        Product product = productMapper.productCreateDtoToProduct(productCreateDto);
        checkAccessPermission(product);

        // Set relationships and defaults
        product.setSeller(seller);
        product.setBrand(brand);
        product.setCategory(category);
        product.setIsActive(true);
        product.setIsFeatured(false);
        product.setSku(generateProductSku(product));

        // Validate stock and price for non-variant products
        if (product.getPrice() != null && product.getStock() == null) {
            throw new IllegalArgumentException("Stock quantity is required when price is specified");
        }

        Product savedProduct = productRepository.save(product);
        log.info("Created product: {} with ID: {}", savedProduct.getName(), savedProduct.getId());

        return productMapper.productToProductDto(savedProduct);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(UUID id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        checkAccessPermission(product);

        // Validate update for products without variants
        validateProductUpdate(product, productDto);

        // Update basic fields
        productMapper.productDtoToProduct(productDto, product);

        // Update relationships if provided
        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Brand not found with id: " + productDto.getBrandId()));
            product.setBrand(brand);
        }

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        if (productDto.getSellerId() != null) {
            User seller = userRepository.findById(productDto.getSellerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Seller not found with id: " + productDto.getSellerId()));
            product.setSeller(seller);
        }

        Product savedProduct = productRepository.save(product);
        log.info("Updated product: {} with ID: {}", savedProduct.getName(), savedProduct.getId());

        return productMapper.productToProductDto(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        checkAccessPermission(product);
        productRepository.delete(product);
        log.info("Deleted product with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByCategoryId(UUID categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        // First, try to get products from the specified category
        Page<Product> productsPage = productRepository.findByCategoryId(category.getId(), pageable);

        // If no products found, search through subcategories
        if (productsPage.isEmpty()) {
            List<Category> subcategories = categoryRepository.findByParentId(categoryId);

            if (!subcategories.isEmpty()) {
                List<UUID> subcategoryIds = new ArrayList<>();
                for (Category subcat : subcategories) {
                    subcategoryIds.add(subcat.getId());
                }
                productsPage = productRepository.findByCategoryIdIn(subcategoryIds, pageable);
            }
        }

        return addPrimaryImagesToProducts(productsPage.map(productMapper::productToProductDto));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByBrandId(UUID brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));

        Page<ProductDto> productDtos = productRepository.findByBrandId(brand.getId(), pageable)
                .map(productMapper::productToProductDto);
        return addPrimaryImagesToProducts(productDtos);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsBySellerId(UUID sellerId, Pageable pageable) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        Page<ProductDto> productDtos = productRepository.findBySellerId(seller.getId(), pageable)
                .map(productMapper::productToProductDto);
        return addPrimaryImagesToProducts(productDtos);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getActiveProducts(Pageable pageable) {
        return addPrimaryImagesToProducts(productRepository.findByIsActive(true, pageable)
                .map(productMapper::productToProductDto));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return addPrimaryImagesToProducts(productRepository.findByIsFeatured(true, pageable)
                .map(productMapper::productToProductDto));
    }

    // New method to check if product has stock available
    @Override
    @Transactional(readOnly = true)
    public boolean isProductInStock(UUID productId, Integer requiredQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.hasVariants()) {
            // Check if any variant has sufficient stock
            return product.getVariants().stream()
                    .anyMatch(variant -> variant.getStock() != null &&
                            variant.getStock() >= requiredQuantity);
        } else {
            // Check product's own stock
            return product.getStock() != null && product.getStock() >= requiredQuantity;
        }
    }

    // New method to reduce stock quantity
    @Override
    @Transactional
    public void reduceProductStock(UUID productId, UUID variantId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (variantId != null) {
            // Reduce variant stock
            product.getVariants().stream()
                    .filter(variant -> variant.getId().equals(variantId))
                    .findFirst()
                    .ifPresent(variant -> {
                        if (variant.getStock() < quantity) {
                            throw new IllegalStateException("Insufficient stock for variant");
                        }
                        variant.setStock(variant.getStock() - quantity);
                    });
        } else {
            // Reduce product stock
            if (product.getStock() == null || product.getStock() < quantity) {
                throw new IllegalStateException("Insufficient stock for product");
            }
            product.setStock(product.getStock() - quantity);
        }

        productRepository.save(product);
        log.info("Reduced stock for product {} by {}", productId, quantity);
    }

    /// HELPER FUNCTIONS
    private void validateProductCreation(ProductCreateDto productCreateDto) {
        // For products without variants, price and stock are required
        if (productCreateDto.getPrice() != null) {
            if (productCreateDto.getStock() == null) {
                throw new IllegalArgumentException("Stock quantity is required when price is specified");
            }
            if (productCreateDto.getStock() < 0) {
                throw new IllegalArgumentException("Stock quantity cannot be negative");
            }
        }
    }

    private void validateProductUpdate(Product existingProduct, ProductDto productDto) {
        // If product doesn't have variants and we're updating price, ensure stock is
        // valid
        if (!existingProduct.hasVariants()) {
            if (productDto.getPrice() != null && productDto.getStock() == null) {
                throw new IllegalArgumentException(
                        "Stock quantity is required when updating price for products without variants");
            }
            if (productDto.getStock() != null && productDto.getStock() < 0) {
                throw new IllegalArgumentException("Stock quantity cannot be negative");
            }
        }
    }

    // Check if the authenticated user is the seller of the product
    public void checkAccessPermission(Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SELLER"));
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if ((!isSeller
                || (product.getSeller() != null && !product.getSeller().getUsername().equals(authenticatedUserName)))
                && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to access this product");
        }
    }

    // Format: {BrandPrefix}-{CategoryPrefix}-{ProductPrefix}-{RandomNumber}
    private String generateProductSku(Product product) {
        String brandPrefix = product.getBrand().getName()
                .substring(0, Math.min(3, product.getBrand().getName().length())).toUpperCase();
        String categoryPrefix = product.getCategory().getName()
                .substring(0, Math.min(3, product.getCategory().getName().length())).toUpperCase();
        String productPrefix = product.getName().substring(0, Math.min(3, product.getName().length())).toUpperCase();
        String randomPart = "%04d".formatted((int) (ThreadLocalRandom.current().nextDouble() * 10000));

        return "%s-%s-%s-%s".formatted(brandPrefix, categoryPrefix, productPrefix, randomPart);
    }

    private Page<ProductDto> addPrimaryImagesToProducts(Page<ProductDto> productDtos) {
        productDtos.forEach(productDto -> {
            try {
                Page<ProductImageDto> primaryImages = productImageService.getImagesByProductId(
                        productDto.getId(),
                        PageRequest.of(0, 1));

                if (!primaryImages.getContent().isEmpty()) {
                    productDto.setPrimaryImage(primaryImages.getContent().getFirst());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch primary image for product {}: {}", productDto.getId(), e.getMessage());
            }

            // Clear detailed data for list views
            productDto.setImages(null);
            productDto.setVariants(null);
        });

        return productDtos;
    }
}
