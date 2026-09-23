@echo off
set "MAVEN_CMD=C:\Users\Kunal\.tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist "%MAVEN_CMD%" (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "MAVEN_CMD=mvn"
    ) else (
        echo [ERROR] Maven not found. Please ensure Maven is installed.
        exit /b 1
    )
)

echo ============================================================
echo  Starting AI-Powered Fraud Detection Backend (Spring Boot)
echo ============================================================
call "%MAVEN_CMD%" spring-boot:run
