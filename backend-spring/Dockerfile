# [Stage 1] 빌드 단계: Gradle로 소스를 컴파일해서 jar 파일 생성
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
# 실행 권한 부여 및 빌드 (테스트 건너뛰고 jar 생성)
RUN chmod +x gradlew
RUN ./gradlew bootJar -x test

# [Stage 2] 실행 단계: 생성된 jar 파일만 가벼운 이미지로 가져와서 실행
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# 위 builder 단계에서 만든 jar 파일을 복사해옴
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]