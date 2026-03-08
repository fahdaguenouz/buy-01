package com.buy01.product_service.service;

import com.buy01.product_service.dto.ProductRequest;
import com.buy01.product_service.dto.ProductResponse;
import com.buy01.product_service.event.ProductEventProducer; // <--- ADDED IMPORT
import com.buy01.product_service.models.Product;
import com.buy01.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // <--- ADDED IMPORT

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductEventProducer productEventProducer; // <--- INJECTED KAFKA PRODUCER

    @Value("${media-service.base-url:http://localhost:8083/api/media/images/}")
    private String mediaServiceBaseUrl;

    public ProductResponse createProduct(ProductRequest request, String sellerId) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .category(request.category())
                .sellerId(sellerId) 
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

    // ==========================================
    // NEW DELETION LOGIC WITH KAFKA AND SECURITY
    // ==========================================
    public void deleteProduct(String productId, String sellerId) {
        // 1. Find the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // 2. Security Check: Ensure the user requesting deletion is the actual owner
        if (!product.getSellerId().equals(sellerId)) {
            log.warn("Security Alert: User {} attempted to delete Product {} belonging to {}", 
                    sellerId, productId, product.getSellerId());
            throw new SecurityException("You do not have permission to delete this product.");
        }

        // 3. Save the media IDs before we delete the product
        List<String> mediaIdsToDelete = product.getMediaIds();

        // 4. Delete the product from the Product database
        productRepository.delete(product);
        log.info("Product {} successfully deleted from database.", productId);

        // 5. Fire Kafka events for the Media Service to clean up the hard drive
        if (mediaIdsToDelete != null && !mediaIdsToDelete.isEmpty()) {
            for (String mediaId : mediaIdsToDelete) {
                // Because mediaId might be saved as a full URL or just an ID, ensure we only send the ID
                // (Optional: if your DB saves full URLs, you might need to extract just the filename here)
                productEventProducer.publishProductDeletedEvent(mediaId);
            }
        }
    }

    private ProductResponse mapToResponse(Product product) {
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
                .mediaIds(mediaUrls)
                .createdAt(product.getCreatedAt())
                .build();
    }
}