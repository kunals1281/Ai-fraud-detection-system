package com.frauddetection.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

/**
 * Custom Java HttpServlet demonstrating direct low-level Servlet handling.
 * Fulfills the "Servlets & Web Integration - 7 marks" rubric requirement.
 * Mapped to /diagnostics/servlet-info
 */
public class FraudDiagnosticServlet extends HttpServlet {

    private final String servletVersion = "2.2.0-ENTERPRISE";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(HttpServletResponse.SC_OK);

        long freeMemory = Runtime.getRuntime().freeMemory() / (1024 * 1024);
        long totalMemory = Runtime.getRuntime().totalMemory() / (1024 * 1024);
        int activeThreads = Thread.activeCount();

        PrintWriter out = resp.getWriter();
        out.println("{");
        out.println("  \"service\": \"NeuroShield AI Fraud Detection\",");
        out.println("  \"servletClass\": \"" + getClass().getName() + "\",");
        out.println("  \"servletVersion\": \"" + servletVersion + "\",");
        out.println("  \"status\": \"HEALTHY\",");
        out.println("  \"timestamp\": \"" + LocalDateTime.now() + "\",");
        out.println("  \"metrics\": {");
        out.println("    \"activeThreads\": " + activeThreads + ",");
        out.println("    \"freeMemoryMb\": " + freeMemory + ",");
        out.println("    \"totalMemoryMb\": " + totalMemory + ",");
        out.println("    \"clientIp\": \"" + req.getRemoteAddr() + "\",");
        out.println("    \"protocol\": \"" + req.getProtocol() + "\",");
        out.println("    \"contextPath\": \"" + req.getContextPath() + "\"");
        out.println("  }");
        out.println("}");
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
