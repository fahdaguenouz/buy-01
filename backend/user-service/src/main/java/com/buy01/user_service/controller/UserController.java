package com.buy01.user_service.controller;

import com.buy01.user_service.dto.UpdateProfileRequest;
import com.buy01.user_service.dto.UserProfileResponse;
import com.buy01.user_service.models.User;
import com.buy01.user_service.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // GET /users/me - Fetch my own profile
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(mapToResponse(currentUser));
    }

    // PUT /users/me - Update my own profile
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {

        // Update the fields
        currentUser.setFirstName(request.firstName());
        currentUser.setLastName(request.lastName());
        
        if (request.avatarMediaId() != null) {
            currentUser.setAvatarMediaId(request.avatarMediaId());
        }

        // Save back to MongoDB
        User updatedUser = userRepository.save(currentUser);

        return ResponseEntity.ok(mapToResponse(updatedUser));
    }

    // Helper method to convert the User entity to a safe DTO
    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .avatarMediaId(user.getAvatarMediaId())
                .build();
    }
}