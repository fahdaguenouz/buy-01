package com.buy01.user_service.models;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.buy01.user_service.enums.Role;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users") // Tells Spring to store this in a 'users' collection in MongoDB
public class User {

    @Id
    private String id; // MongoDB uses String for its ObjectIds

    @Indexed(unique = true)
    private String email;

    private String password; // This will be hashed via BCrypt later

    private String firstName;
    
    private String lastName;

    private Role role;

    // The Media Service handles the actual image file. 
    // The User Service just stores the ID reference.
    private String avatarMediaId; 

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}