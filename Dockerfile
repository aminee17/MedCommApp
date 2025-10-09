# Step 1: Build the jar using Maven inside the container
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven wrapper files and pom.xml
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd .
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy all source code (this ensures all Java files, including the updated ones, are in the build context)
COPY src ./src

# Build the project using Maven wrapper
RUN ./mvnw clean package -DskipTests

# Step 2: Run the app with Eclipse Temurin JDK
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Create directories for uploads and audio files
RUN mkdir -p /app/encrypted-uploads /app/audio-messages && \
    chown -R appuser:appgroup /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

# Environment variables for Spring profiles and JVM options
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx1024m -Xms512m -XX:+UseG1GC -XX:+UseContainerSupport"
ENV SERVER_PORT=8080

# Expose port 8080
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Switch to non-root user
USER appuser

# Run the jar file
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
