# Use official OpenJDK 17 image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Make mvnw executable and build the application
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/medical_mobile_app-0.0.1-SNAPSHOT.jar"]