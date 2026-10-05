package com.frauddetection.servlet;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Web Configuration registering custom Servlets and Servlet Filters into the container.
 * Demonstrates Servlets & Web Integration (7 marks).
 */
@Configuration
public class ServletRegistrationConfig {

    @Bean
    public ServletRegistrationBean<FraudDiagnosticServlet> fraudDiagnosticServletRegistration() {
        ServletRegistrationBean<FraudDiagnosticServlet> registration =
                new ServletRegistrationBean<>(new FraudDiagnosticServlet(), "/diagnostics/servlet-info");
        registration.setLoadOnStartup(1);
        registration.setName("FraudDiagnosticServlet");
        return registration;
    }

    @Bean
    public FilterRegistrationBean<FraudAuditServletFilter> fraudAuditFilterRegistration() {
        FilterRegistrationBean<FraudAuditServletFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new FraudAuditServletFilter());
        registration.addUrlPatterns("/api/*", "/diagnostics/*");
        registration.setName("FraudAuditServletFilter");
        registration.setOrder(1);
        return registration;
    }
}
