package com.hubble;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.hubble")
@EntityScan(basePackages = "com.hubble") // User, BaseTimeEntity 모두 스캔 가능하도록 확장
@EnableJpaRepositories(basePackages = "com.hubble") // UserRepository 스캔
@EnableJpaAuditing // JPA Auditing 활성화 (생성/수정일 자동 기록)
public class ServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
