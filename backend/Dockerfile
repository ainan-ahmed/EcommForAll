# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven build file, the source code, and the Maven Wrapper
COPY pom.xml .
COPY ecommforall-ai-key.json .
COPY .env.ai .
COPY .env.aws .
COPY src ./src
COPY .mvn .mvn
COPY mvnw .

# Grant execute permissions to the Maven Wrapper
RUN chmod +x mvnw

# Package the application
RUN ./mvnw package -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/ecommforall-ai-key.json
# Expose the port the application runs on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
