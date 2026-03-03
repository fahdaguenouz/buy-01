#!/bin/bash

echo "🚀 Starting Buy 01 Microservices Ecosystem..."

# Clean up old logs from previous runs
echo "🧹 Clearing old log files..."
rm -rf logs
mkdir -p logs

# Function to catch Ctrl+C and shut down everything cleanly
cleanup() {
    echo ""
    echo "🛑 Shutting down all microservices..."
    # pkill -P $$ kills all child processes started by this specific script
    pkill -P $$
    echo "✅ All services stopped safely."
    exit 0
}

# Trap the Ctrl+C signal and route it to the cleanup function
trap cleanup SIGINT

# 1. Start Eureka First (It needs to be up before the others try to register)
echo "📡 Starting discovery-server..."
cd backend/discovery-server
./mvnw spring-boot:run > ../../logs/discovery-server.log 2>&1 &
cd ../..

echo "⏳ Waiting 15 seconds for Eureka to initialize..."
sleep 15

# 2. Start the remaining services
SERVICES=("api-gateway" "user-service" "product-service" "media-service")

for SERVICE in "${SERVICES[@]}"; do
    echo "⚙️ Starting $SERVICE..."
    cd "backend/$SERVICE"
   ./mvnw clean spring-boot:run > "../../logs/$SERVICE.log" 2>&1 &
    cd ../..
done

echo ""
echo "✅ All services are booting up in the background!"
echo "📊 Eureka Dashboard: http://localhost:8761"
echo "📄 To view live logs for a service, open a new terminal and run:"
echo "   tail -f logs/user-service.log"
echo ""
echo "🛑 Press [Ctrl+C] in this terminal to stop all services."

# Wait indefinitely so the script stays alive to catch the Ctrl+C
wait