FROM node:22-alpine AS frontend-builder
WORKDIR /build/frontend

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS backend-builder
WORKDIR /build

COPY pom.xml ./
COPY src ./src
COPY --from=frontend-builder /build/frontend/dist ./src/main/resources/static

RUN mvn --no-transfer-progress -DskipTests -Djooq.codegen.skip=true package

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

RUN mkdir -p /data

COPY --from=backend-builder /build/target/booking-app-1.0-SNAPSHOT.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
