@echo off
title AI-Powered Fraud Detection System (NeuroShield)
echo =========================================================================
echo       NEUROSHIELD AI - ENTERPRISE FRAUD DETECTION & DEFENSE SYSTEM
echo =========================================================================
echo.
echo [1/2] Launching Java Spring Boot Backend on http://localhost:8080 ...
start "NeuroShield Backend (Spring Boot 3)" cmd /c "cd /d "%~dp0backend" && run-backend.bat"

echo [2/2] Launching Modern React Frontend on http://localhost:5173 ...
start "NeuroShield Frontend (React + Vite)" cmd /c "cd /d "%~dp0frontend" && run-frontend.bat"

echo.
echo =========================================================================
echo  Both services have been initiated in separate terminal windows!
echo.
echo  - Frontend Portal:  http://localhost:5173
echo  - Backend REST API: http://localhost:8080
echo  - Swagger UI Docs:  http://localhost:8080/swagger-ui.html
echo  - H2 Database:      http://localhost:8080/h2-console
echo =========================================================================
echo.
pause
