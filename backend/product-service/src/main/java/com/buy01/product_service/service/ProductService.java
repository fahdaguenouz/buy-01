package com.buy01.product_service.service;

import com.buy01.product_service.dto.ProductRequest;
import com.buy01.product_service.dto.ProductResponse;
import com.buy01.product_service.models.Product;
import com.buy01.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    // Inject the base URL for the Media Service from application.yml
    @Value("${media-service.base-url:http://localhost:8083/api/media/images/}")
    private String mediaServiceBaseUrl;

    public ProductResponse createProduct(ProductRequest request, String sellerId) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .category(request.category())
                .sellerId(sellerId) // Directly attach the user ID from the JWT
                .mediaIds(request.mediaIds())
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
        return mapToResponse(product);
    }

    public List<ProductResponse> getProductsBySeller(String sellerId) {
        return productRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Helper method to convert Entity to DTO
    private ProductResponse mapToResponse(Product product) {

        // Transform the raw media IDs (e.g., "img1.jpg") into full URLs
        List<String> mediaUrls = new ArrayList<>();
        if (product.getMediaIds() != null) {
            for (String mediaId : product.getMediaIds()) {
                mediaUrls.add(mediaServiceBaseUrl + mediaId);
            }
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .sellerId(product.getSellerId())
                // Pass the transformed URLs back to the client instead of raw IDs!
                .mediaIds(mediaUrls)
                .createdAt(product.getCreatedAt())
                .build();
    }
}