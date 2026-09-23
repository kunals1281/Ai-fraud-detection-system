package com.frauddetection.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AI-Powered Fraud Detection System API")
                        .version("1.0.0")
                        .description("Enterprise REST API for real-time machine learning fraud detection, transaction monitoring, Explainable AI (XAI) risk analysis, and dynamic algorithm calibration.")
                        .contact(new Contact()
                                .name("FinTech Fraud Defense Engineering Team")
                                .email("fraud-defense@fintech.enterprise.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}
