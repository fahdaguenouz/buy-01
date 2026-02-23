#!/bin/bash

ROOT="buy-01"

echo "🚀 Bootstrapping the $ROOT structure with actual projects..."

# 1. Create root directory
mkdir -p "$ROOT"
cd "$ROOT"

# 2. Create global config files
touch .env docker-compose.yml setup.sh README.md
chmod +x setup.sh

# 3. Generate the actual Angular App
echo "📦 Generating Angular Frontend (this might take a minute)..."
# Using npx to run the latest Angular CLI. 
# --defaults skips interactive prompts. --skip-git prevents nested git repositories.
npx @angular/cli new frontend --routing --style=scss --defaults --skip-git

# 4. Generate the Spring Boot Microservices
echo "☕ Generating Spring Boot Microservices via Spring Initializr..."
mkdir -p backend
cd backend

# Helper function to call the Spring Initializr API
generate_spring_boot() {
    APP_NAME=$1
    DEPS=$2
    echo "   -> Scaffolding $APP_NAME with dependencies: $DEPS"
    
    curl -s -G "https://start.spring.io/starter.zip" \
        -d type=maven-project \
        -d language=java \
        -d baseDir="$APP_NAME" \
        -d groupId=com.buy01 \
        -d artifactId="$APP_NAME" \
        -d name="$APP_NAME" \
        -d dependencies="$DEPS" \
        -o "$APP_NAME.zip"
    
    unzip -q "$APP_NAME.zip"
    rm "$APP_NAME.zip"
}

# 4a. Discovery Server (Netflix Eureka)
generate_spring_boot "discovery-server" "cloud-eureka-server"

# 4b. API Gateway (Spring Cloud Gateway)
generate_spring_boot "api-gateway" "cloud-gateway,cloud-eureka"

# 4c. User Service (Auth, MongoDB, Security)
generate_spring_boot "user-service" "web,data-mongodb,security,cloud-eureka,kafka,validation,lombok"

# 4d. Product Service (Products CRUD, MongoDB, Security)
generate_spring_boot "product-service" "web,data-mongodb,security,cloud-eureka,kafka,validation,lombok"

# 4e. Media Service (File Uploads, MongoDB, Security)
generate_spring_boot "media-service" "web,data-mongodb,security,cloud-eureka,kafka,validation,lombok"

cd ../..

echo "✅ Boom! Ecosystem successfully generated in ./$ROOT/"
echo "Run 'cd $ROOT' to get started."