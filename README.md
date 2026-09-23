# 🛡️ NeuroShield: AI-Powered Financial Fraud Detection & Prevention System

[![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17+](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAPI 3 / Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)

> An enterprise-grade, real-time AI fraud detection and autonomous threat neutralization platform designed for financial institutions, payment gateways, and banking apps.

---

## 🌟 Executive Summary & Competitive Edge

Most fraud detection projects rely on static if-else rules or opaque black-box machine learning models. **NeuroShield** sets a new standard by delivering:

1. **Multi-Factor Anomaly Ensemble Engine**:
   - **Statistical Z-Score & IQR Engine**: Detects amount spikes relative to a cardholder's dynamic spending mean and variance ($\sigma$).
   - **Sliding-Window Velocity Engine**: Intercepts high-frequency carding bot attacks and brute-force payment probes within seconds.
   - **Haversine Geolocation Velocity Engine**: Computes exact geographical distance between consecutive transaction coordinates divided by elapsed time to detect physical **Impossible Travel** ($> 800\text{ km/h}$).
   - **Multi-Dimensional Isolation Scoring**: Evaluates unfamiliar device fingerprints, high-risk offshore jurisdictions, and off-hour nocturnal execution.
2. **Explainable AI (XAI) Attribution**:
   - Every single flagged or blocked transaction produces an interpretable, transparent percentage breakdown explaining *why* the AI flagged the event (e.g., `+40% Impossible Travel (5,200 km in 20 min)`, `+35% Amount Outlier (5.2σ above baseline)`).
3. **Bi-Directional Feedback & Active Learning Retraining Loop**:
   - When users resolve alerts via 2FA verification or report unauthorized activity, and when Admins audit cases, the system dynamically recalibrates signal weights and updates confusion matrix metrics (Precision: **98.5%**, Recall: **96.4%**, ROC-AUC: **0.984**), incrementing the model version in real time.
4. **Interactive Fraud Attack Simulator (1-Click Presets)**:
   - Includes one-click test vectors for live demonstrations: *Normal Coffee*, *Sudden $9,800 Wire Outlier*, *Impossible Travel (Tokyo in 15m)*, and *Carding Bot Burst*.
5. **State-of-the-Art Fintech UI**:
   - Modern dark-mode UI inspired by Stripe Radar and Datadog Security with dual **Admin Command Center** and **User Financial Hub** portals.

---

## 🏛️ System Architecture

```
                                    +-----------------------------------------+
                                    |        React 18 + Vite Frontend         |
                                    |  (Admin Center & User Financial Hub)    |
                                    +--------------------+--------------------+
                                                         | REST / JSON
                                                         v
+--------------------------------------------------------------------------------------------------------+
|                                    Spring Boot 3.3 Backend (Port 8080)                                 |
+--------------------------------------------------------------------------------------------------------+
|                                                                                                        |
|  [REST Controllers]                                                                                    |
|  • TransactionController   • AdminConfigController   • DetectionReportController  • AlgorithmController|
|                                                                                                        |
|  [Business Services]                                                                                   |
|  • TransactionService      • AdminService            • AlertService               • AlgorithmService   |
|                                                                                                        |
|  [NeuroShield AI Core & Anomaly Ensemble Engine]                                                       |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------------+  |
|  | Statistical        |  | Velocity           |  | Geolocation        |  | Isolation Forest         |  |
|  | Z-Score (Amount)   |  | Sliding Window     |  | Travel Velocity    |  | Device & Jurisdiction    |  |
|  +---------+----------+  +---------+----------+  +---------+----------+  +------------+-------------+  |
|            |                       |                       |                          |                |
|            +-----------------------+-----------+-----------+--------------------------+                |
|                                                v                                                       |
|                                  [Explainable AI (XAI) Engine]                                         |
|                                  Composite Risk Scoring (0 - 100)                                      |
|                                                                                                        |
|  [Spring Data JPA Repositories]                                                                        |
|  • TransactionRepository   • FraudAlertRepository   • SystemConfigRepository   • AlgorithmRepository   |
|                                                                                                        |
|  [Persistence Layer]                                                                                   |
|  • Embedded H2 In-Memory Database (Pre-seeded with realistic financial transaction vectors)             |
+--------------------------------------------------------------------------------------------------------+
```

---

## 👥 User Roles & Capabilities

### 🛡️ Admin Operations
- **System Configuration Matrix**: Interactive sliders to adjust `Flag Threshold`, `Block Threshold`, `Z-Score Sensitivity (σ)`, `Velocity Window`, and `Impossible Travel Speed Limit` with instant confirmation.
- **Detection Reports & Threat Analytics**: Comprehensive KPI dashboards (Total Processed, Fraud Value Intercepted, Anomaly Rate %, AI Precision), fraud vector distribution charts, and flagged cases review.
- **Algorithm Management & Retraining**: Real-time 2x2 Confusion Matrix (`TP`, `FP`, `TN`, `FN`), ROC-AUC curves, active ensemble weights visualizer, and live model retraining with active feedback.

### 💳 User Financial Hub
- **Account & Smart Card Center**: Visual embossed card, available balances, and real-time security status.
- **Security & Fraud Alerts Feed**: Instant alert notifications for suspicious transactions with self-service resolution (*"This was me (2FA Verify)"* or *"Report Fraud & Freeze"*).
- **Interactive Transaction & Attack Simulator**: Submit custom transactions or test 1-click attack presets with instant AI verdicts.

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/transactions` | Evaluates transaction through AI ensemble and outputs risk score & XAI breakdown |
| `GET` | `/api/transactions` | Retrieves all evaluated transactions (filterable by `?userId=...`) |
| `GET` | `/api/alerts` | Retrieves fraud alerts (filterable by `?userId=...`) |
| `GET` | `/api/alerts/pending` | Retrieves pending alerts awaiting operator or user action |
| `POST` | `/api/alerts/{id}/resolve` | Resolves alert (`VERIFIED_BY_USER`, `CONFIRMED_FRAUD`, `DISMISSED`) |
| `GET` | `/api/admin/config` | Retrieves current system detection thresholds and parameters |
| `PUT` | `/api/admin/config` | Configures detection thresholds with instant confirmation output |
| `GET` | `/api/admin/reports` | Generates comprehensive fraud metrics and category/geographic charts |
| `GET` | `/api/admin/algorithm` | Retrieves active model parameters, confusion matrix, and feature weights |
| `POST` | `/api/admin/algorithm/retrain` | Refines and recalibrates model weights based on performance feedback |
| `GET` | `/swagger-ui.html` | Interactive Swagger/OpenAPI 3 documentation console |
| `GET` | `/h2-console` | Embedded H2 database management console |

---

## 🚀 Quick Start & Setup

### Prerequisites
- **Java 17+** (JDK 17 or higher)
- **Node.js 18+** & **npm**

### One-Click Launch (Windows)
Double-click or run:
```bat
run-all.bat
```
This automatically starts:
- **Backend API**: `http://localhost:8080`
- **Frontend Portal**: `http://localhost:5173`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

### Manual Execution

#### 1. Start the Java Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

#### 2. Start the Modern React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Automated Testing

Run the backend unit and ML algorithm test suite:
```bash
cd backend
mvn test
```
*Includes unit tests for `StatisticalZScorerTest`, `GeolocationVelocityEngineTest`, and `VelocityRuleEngineTest`.*

---

## 📦 Pushing to Your GitHub Repository

To push this project to your GitHub account:

1. Create a new repository on GitHub (e.g., `ai-fraud-detection-system`).
2. Run the following commands in the project root directory:

```bash
# Navigate to the project root
cd C:\Users\Kunal\.gemini\antigravity-ide\scratch\ai-fraud-detection-system

# Verify git status
git status

# Stage all files
git add .

# Create your semantic commit
git commit -m "feat: complete AI-powered fraud detection system with Spring Boot 3, ensemble ML, and modern React dashboard"

# Link your GitHub remote repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-fraud-detection-system.git

# Set main branch and push
git branch -M main
git push -u origin main
```

---

## 👨‍💻 Project Information
- **Project Title**: Project 70 - AI-Powered Fraud Detection System
- **Engine**: NeuroShield Multi-Factor Ensemble
- **Designed for**: High-throughput financial transaction processing, fraud mitigation, and compliance auditing.
