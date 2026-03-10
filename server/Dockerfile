FROM openjdk:17-jdk-slim
WORKDIR /app
# 빌드된 JAR 파일을 app.jar라는 이름으로 복사합니다.
COPY api/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
