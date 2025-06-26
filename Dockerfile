# Step 1: Build the jar using Maven inside the container
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven wrapper files
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd ./
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the project using Maven wrapper
RUN ./mvnw clean package -DskipTests

# Step 2: Run the app with Eclipse Temurin JDK
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Environment variables for Spring profiles and JVM options
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Expose port 8080 (default Spring Boot port)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
