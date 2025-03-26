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
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.Console;
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

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(productMapper::productToProductDto);
    }

    @Override
    public ProductDto getProductById(UUID id, List<String> includes) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        ProductDto productDto = productMapper.productToProductDto(product);
        if (includes != null && !includes.isEmpty()) {
            if(includes.contains("images"))
            {
                Page<ProductImageDto> imagesPage = productImageService.getImagesByProductId(id, Pageable.unpaged());
                productDto.setImages(imagesPage.getContent());
            }
            if (includes.contains("variants")) {
                // Convert Page to List
                Page<ProductVariantDto> variantsPage = productVariantService.getVariantsByProductId(id, Pageable.unpaged());
                productDto.setVariants(variantsPage.getContent());

                // Optionally load variant images if requested
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
        Category category =  categoryRepository.findById(productCreateDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productCreateDto.getCategoryId()));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
//        String authenticatedUserRole = authentication.getAuthorities().toString();
//        System.out.println(authenticatedUserRole);
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SELLER"));

        if (!isSeller) {
            throw new AccessDeniedException("Only sellers can create products");
        }
        User seller = userRepository.findByUsername(authenticatedUserName).orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + authenticatedUserName));
        Product product = productMapper.productCreateDtoToProduct(productCreateDto);
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
        if(productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId()).orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + productDto.getBrandId()));
            product.setBrand(brand);
        }
        if(productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }
        if(productDto.getSellerId() != null) {
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
        return productRepository.findByCategoryId(category.getId(), pageable).map(productMapper::productToProductDto);
    }

    @Override
    public Page<ProductDto> getProductsByBrandId(UUID brandId, Pageable pageable) {
        Brand brand = brandRepository.findById(brandId).orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
        return productRepository.findByBrandId(brand.getId(), pageable).map(productMapper::productToProductDto);
    }

    @Override
    public Page<ProductDto> getProductsBySellerId(UUID sellerId, Pageable pageable) {
        User seller = userRepository.findById(sellerId).orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));
        return productRepository.findBySellerId(seller.getId(), pageable).map(productMapper::productToProductDto);
    }

    @Override
    public Page<ProductDto> getActiveProducts(Pageable pageable) {
        return productRepository.findByIsActive(true, pageable).map(productMapper::productToProductDto);
    }

    @Override
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeatured(true, pageable).map(productMapper::productToProductDto);
    }

    ///  HELPER FUNCTIONS
    // Check if the authenticated user is the seller of the product
    public void checkAccessPermission(Product product) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserName = authentication.getName();
        boolean isSeller = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SELLER"));
        if (!isSeller || !product.getSeller().getUsername().equals(authenticatedUserName)) {
            throw new AccessDeniedException("You do not have permission to access this product");
        }
    }
    // Format: {BrandPrefix}-{CategoryPrefix}-{ProductPrefix}-{RandomNumber}
    private String generateProductSku(Product product) {
        String brandPrefix = product.getBrand().getName().substring(0, Math.min(3, product.getBrand().getName().length())).toUpperCase();
        String categoryPrefix = product.getCategory().getName().substring(0, Math.min(3, product.getCategory().getName().length())).toUpperCase();
        String productPrefix = product.getName().substring(0, Math.min(3, product.getName().length())).toUpperCase();
        String randomPart = String.format("%04d", (int)(Math.random() * 10000));

        return String.format("%s-%s-%s-%s", brandPrefix, categoryPrefix, productPrefix, randomPart);
    }
}
