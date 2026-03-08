package com.buy01.media_service.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaEventConsumer {

    // Replace with your actual upload directory path if different
    private final String uploadDir = "uploads/";

    // Listen to the exact same topic the Product Service publishes to!
    @KafkaListener(topics = "product-deletion-topic", groupId = "media-group")
    public void consumeProductDeletedEvent(String mediaId) {
        log.info("📥 Received Kafka event! Attempting to clean up orphaned media ID: {}", mediaId);
        
        try {
            // 1. Delete the physical file from the hard drive
            // Assuming files are saved as <mediaId>.jpg, .png, etc.
            // You might need to query your Media database first to get the exact filename/extension
            Path filePath = Paths.get(uploadDir + mediaId); 
            
            File fileToDelete = filePath.toFile();
            if (fileToDelete.exists()) {
                if (fileToDelete.delete()) {
                    log.info("✅ Successfully deleted physical file for media ID: {}", mediaId);
                } else {
                    log.warn("⚠️ File exists but could not be deleted: {}", filePath);
                }
            } else {
                log.info("ℹ️ Physical file not found (might have been deleted already): {}", filePath);
            }

            // 2. Delete the record from the Media Service MongoDB
            // mediaRepository.deleteById(mediaId);
            log.info("✅ Database record removed for media ID: {}", mediaId);
            
        } catch (Exception e) {
            log.error("❌ Failed to process deletion for media ID: {}", mediaId, e);
        }
    }
}