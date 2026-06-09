<div align="center">

# 🎮 Tetris — DevSecOps End-to-End Project

<img src="https://img.shields.io/badge/DevSecOps-End--to--End-blueviolet?style=for-the-badge&logo=shield&logoColor=white"/>
<img src="https://img.shields.io/badge/Jenkins-Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Kubernetes-GitOps-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/ArgoCD-CD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white"/>
<img src="https://img.shields.io/badge/Trivy-Security-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white"/>
<img src="https://img.shields.io/badge/SonarQube-Quality-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus&logoColor=white"/>
<img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana&logoColor=white"/>
<img src="https://img.shields.io/badge/Loki-Log%20Aggregation-F5A623?style=for-the-badge&logo=grafana&logoColor=white"/>

<br/>
<br/>

> **A production-grade DevSecOps pipeline** that automates the full software delivery lifecycle of a Tetris web application — from source code to a secure, monitored Kubernetes deployment — with security baked in at every stage.

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [🔐 Security (DevSec)](#-security-devsec)
- [☸️ Kubernetes & GitOps](#️-kubernetes--gitops)
- [📈 Monitoring Stack](#-monitoring-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🌍 Environments](#-environments)
- [📊 Reports & Artifacts](#-reports--artifacts)

---

## 🎯 Overview

This project implements a **complete DevSecOps pipeline** for a Tetris web application built with **Node.js**. It demonstrates industry best practices for:

| Pillar | Implementation |
|--------|---------------|
| 🔄 **Continuous Integration** | Jenkins pipeline triggered on every GitHub push |
| 🔐 **Security Shift-Left** | Trivy FS scan + SonarQube SAST + Docker image scanning |
| 📦 **Artifact Management** | Docker images versioned by Git tag / commit SHA |
| 🚢 **Continuous Delivery** | GitOps with ArgoCD — Staging auto-deploy, Prod manual approval |
| ☸️ **Orchestration** | Kubernetes with Kustomize overlays (base / staging / prod) |
| 📋 **SBOM Generation** | CycloneDX Software Bill of Materials per image build |
| 📈 **Monitoring** | Prometheus + Grafana (metrics) + Loki (log aggregation) — deployed via ArgoCD |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER WORKFLOW                              │
│                                                                          │
│   git push ──► GitHub ──► Webhook ──► Jenkins Pipeline                  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       JENKINS CI/CD          │
                    │                              │
                    │  ✅ Checkout & Tag Image     │
                    │  ✅ Install Dependencies     │
                    │  ✅ Lint + Unit Tests        │
                    │  🔬 Trivy FS Scan            │
                    │  📊 SonarQube Analysis       │
                    │  🚦 Quality Gate             │
                    │  🔨 npm build                │
                    │  🐳 Docker Build             │
                    │  🔬 Trivy Image Scan + SBOM  │
                    │  📤 Push to DockerHub        │
                    │  🔄 Update Staging Manifest  │
                    │  ✋ Manual Approval (Prod)   │
                    │  🔄 Update Prod Manifest     │
                    └──────┬────────────┬──────────┘
                           │            │
               ┌───────────▼──┐    ┌────▼────────────┐
               │   DockerHub  │    │   GitHub Repo    │
               │  (Registry)  │    │ (GitOps Source)  │
               └──────────────┘    └────────┬─────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │         ArgoCD            │
                               │  (Watches manifests repo) │
                               └──┬──────────┬────────┬───┘
                                  │          │        │
                      ┌───────────▼──┐  ┌────▼──────┐ │
                      │  K8s STAGING │  │ K8s PROD  │ │
                      │  (Auto Sync) │  │ (Approved)│ │
                      └──────────────┘  └───────────┘ │
                                                       │
                                          ┌────────────▼──────────────┐
                                          │     Monitoring Namespace   │
                                          │                            │
                                          │  📈 Prometheus (metrics)   │
                                          │  📊 Grafana  (dashboards)  │
                                          │  📋 Loki     (logs)        │
                                          └────────────────────────────┘
```

---

## 📁 Project Structure

```
Tetris-Devsecops-End-to-End-Project/
│
├── 📄 Jenkinsfile                          # Full CI/CD pipeline definition
│
├── 🎮 Tetris-V2/                           # Application source code (Node.js)
│   ├── src/                               # Application source files
│   ├── Dockerfile                         # Container image definition
│   └── package.json                       # Node.js dependencies & scripts
│
└── ☸️ Kubernetes-Manifests-file/           # GitOps manifests (Kustomize)
    │
    ├── argocd/                            # ArgoCD Application definitions
    │   ├── app-staging.yaml              # Tetris — Staging ArgoCD App
    │   ├── app-prod.yaml                 # Tetris — Production ArgoCD App
    │   ├── monitoring-app.yaml           # Prometheus + Grafana ArgoCD App
    │   └── loki-application.yaml         # Loki log aggregation ArgoCD App
    │
    ├── base/                              # Shared Kubernetes base configs
    │   ├── deployment.yaml               # Base Deployment manifest
    │   ├── service.yaml                  # Service definition
    │   └── kustomization.yaml            # Base kustomization
    │
    ├── monitoring/                        # Monitoring stack Helm values
    │   ├── values.yaml                   # Prometheus + Grafana Helm values
    │   └── loki-values.yaml              # Loki Helm values
    │
    └── overlays/                          # Environment-specific overrides
        ├── staging/
        │   ├── ingress.yaml              # Staging ingress rules
        │   └── kustomization.yaml        # Staging image + patches
        │
        └── prod/
            ├── ingress.yaml              # Production ingress rules
            └── kustomization.yaml        # Prod image + patches
```

---

## 🔄 CI/CD Pipeline

The Jenkins pipeline is triggered automatically on every push to `main` and consists of **13 stages**:

```
🧹 Clean Workspace
    │
    ▼
📥 Checkout (GitHub)
    │
    ▼
🏷️  Set Image Tag  ──────────── git tag → IMAGE_TAG
    │                           fallback → sha-<commit>
    ▼
⚙️  Install Dependencies (npm ci)
    │
    ▼
⚡ Quality Checks (parallel)
    ├── 🔎 Lint (ESLint)
    └── 🧪 Unit Tests + Coverage (JUnit report)
    │
    ▼
🔬 Trivy FS Scan ─────────────── vuln + secret | HIGH, CRITICAL
    │
    ▼
📊 SonarQube Analysis ────────── SAST static analysis
    │
    ▼
🚦 Quality Gate ──────────────── aborts pipeline if failed
    │
    ▼
🔨 Build (npm run build)
    │
    ▼
🐳 Docker Build ──────────────── tagged with IMAGE_TAG + latest
    │
    ▼
🔬 Trivy Image Scan ──────────── vuln scan + SBOM (CycloneDX)
    │                            ❌ exits 1 on CRITICAL
    ▼
📤 Push to DockerHub
    │
    ▼
🔄 Update Staging Manifest ───── kustomize edit → git push
    │
    ▼
✋ Approve Prod (Manual Gate) ── only if APPLY_PROD=true
    │
    ▼
🔄 Update Prod Manifest ──────── kustomize edit → git push
```

### Pipeline Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `APPLY_PROD` | `false` | Enable production deployment stage |

### Image Tagging Strategy

```
Priority 1 → git tag        (e.g., v1.2.0)
Priority 2 → git commit SHA (e.g., sha-a3f1c9b)
```

---

## 🔐 Security (DevSec)

Security is enforced at **three layers** of the pipeline:

### 1. 🔬 Trivy Filesystem Scan
- Scans source code and `node_modules` for known vulnerabilities and hardcoded secrets
- Severity filter: **HIGH** and **CRITICAL**
- Output: `trivy-fs-report.json` (archived as build artifact)

### 2. 📊 SonarQube SAST Analysis
- Static Application Security Testing on JavaScript source
- Integrated with LCOV coverage reports
- Pipeline **aborts** if Quality Gate fails

### 3. 🐳 Trivy Docker Image Scan
- Full vulnerability scan of the built container image
- Generates **CycloneDX SBOM** (`trivy-sbom.json`)
- **Pipeline fails** if any `CRITICAL` severity vulnerability is found in the image
- Output: `trivy-image-report.json` (archived as build artifact)

### Security Artifacts per Build

| Artifact | Description |
|----------|-------------|
| `trivy-fs-report.json` | Filesystem vulnerability report |
| `trivy-image-report.json` | Container image vulnerability report |
| `trivy-sbom.json` | Software Bill of Materials (CycloneDX) |
| `coverage/junit.xml` | Test results report |

---

## ☸️ Kubernetes & GitOps

This project uses a **GitOps approach** powered by **ArgoCD** and **Kustomize**.

### How It Works

1. Jenkins updates the image tag in the overlay `kustomization.yaml` via `kustomize edit set image`
2. Jenkins pushes the change to the `main` branch of this repo
3. ArgoCD detects the diff and automatically syncs the cluster

### Environments

| Environment | URL | Sync Mode | Approval |
|-------------|-----|-----------|----------|
| **Staging** | `http://myapp-staging.local` | Auto | ❌ None |
| **Production** | `http://myapp-prod.local` | Auto | ✅ Manual (Jenkins `input`) |

### Kustomize Overlay Structure

```yaml
# overlays/staging/kustomization.yaml
images:
  - name: houssemdhahri93/tetris
    newTag: <IMAGE_TAG>   # ← Updated by Jenkins automatically
```

---

## 📈 Monitoring Stack

The monitoring stack is fully **GitOps-managed** via ArgoCD and deployed to a dedicated namespace in Kubernetes using **Helm values** stored in the repo.

### Components

| Component | Role | ArgoCD App |
|-----------|------|-----------|
| **Prometheus** | Metrics collection & alerting | `monitoring-app.yaml` |
| **Grafana** | Visualization & dashboards | `monitoring-app.yaml` |
| **Loki** | Log aggregation from all pods | `loki-application.yaml` |

### Architecture

```
 Kubernetes Pods
      │  (metrics scrape)        │  (log shipping)
      ▼                          ▼
 Prometheus ◄──────────    Promtail / Loki
      │                          │
      └──────────┬───────────────┘
                 ▼
             Grafana
        (unified dashboards:
         metrics + logs)
```

### Helm Values

| File | Description |
|------|-------------|
| `monitoring/values.yaml` | Prometheus stack configuration (scrape intervals, retention, Grafana datasources) |
| `monitoring/loki-values.yaml` | Loki configuration (storage, retention, chunk settings) |

### Deploy Monitoring via ArgoCD

```bash
# Deploy Prometheus + Grafana
kubectl apply -f Kubernetes-Manifests-file/argocd/monitoring-app.yaml

# Deploy Loki
kubectl apply -f Kubernetes-Manifests-file/argocd/loki-application.yaml
```

> ArgoCD will automatically sync and deploy the Helm releases based on the values files in the repo.

---

## ⚙️ Prerequisites

Make sure the following tools and services are installed and configured:

| Tool | Purpose | Version |
|------|---------|---------|
| **Jenkins** | CI/CD orchestration | LTS |
| **Node.js** | Build environment | 22.x |
| **Docker** | Container runtime | 24+ |
| **Trivy** | Security scanner | Latest |
| **Kustomize** | K8s manifest patching | v5+ |
| **SonarQube** | Code quality & SAST | Community/Enterprise |
| **ArgoCD** | GitOps controller | v2.x |
| **Kubernetes** | Container orchestration | v1.28+ |
| **Helm** | Kubernetes package manager | v3+ |
| **Prometheus + Grafana** | Metrics & dashboards | kube-prometheus-stack |
| **Loki** | Log aggregation | grafana/loki-stack |

### Jenkins Credentials Required

| Credential ID | Type | Usage |
|--------------|------|-------|
| `github-token` | Username/Password | GitHub checkout & GitOps push |
| `Dockerhub` | Username/Password | DockerHub image push |

### Jenkins Tools Required

| Tool Name | Type |
|-----------|------|
| `node22` | NodeJS installation |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HoussemDhahri/Tetris-Devsecops-End-to-End-Project.git
cd Tetris-Devsecops-End-to-End-Project
```

### 2. Configure Jenkins

- Create a **Pipeline** job pointing to this repository
- Set **Branch** to `main`
- Enable **GitHub webhook trigger**
- Add the required credentials (`github-token`, `Dockerhub`)
- Configure **SonarQube server** with name `SonarQube-Server`

### 3. Apply ArgoCD Applications

```bash
# Tetris app
kubectl apply -f Kubernetes-Manifests-file/argocd/app-staging.yaml
kubectl apply -f Kubernetes-Manifests-file/argocd/app-prod.yaml

# Monitoring stack
kubectl apply -f Kubernetes-Manifests-file/argocd/monitoring-app.yaml
kubectl apply -f Kubernetes-Manifests-file/argocd/loki-application.yaml
```

### 4. Trigger the Pipeline

```bash
git push origin main
# Jenkins webhook fires → pipeline starts automatically
```

### 5. Deploy to Production

In Jenkins, trigger a build with parameter:
```
APPLY_PROD = true
```
Then approve the manual gate when prompted.

---

## 🌍 Environments

### Staging
- **Auto-deployed** on every successful pipeline run
- Accessible at: `http://myapp-staging.local`
- Synced by ArgoCD from: `overlays/staging/`

### Production
- Requires `APPLY_PROD=true` pipeline parameter
- Requires **manual approval** in Jenkins (`input` step)
- Accessible at: `http://myapp-prod.local`
- Synced by ArgoCD from: `overlays/prod/`

---

## 📊 Reports & Artifacts

Every Jenkins build produces and archives the following:

```
build-artifacts/
├── trivy-fs-report.json        # FS vulnerability scan results
├── trivy-image-report.json     # Image vulnerability scan results
├── trivy-sbom.json             # CycloneDX SBOM
└── coverage/
    └── junit.xml               # Unit test results (JUnit format)
```

These are accessible directly from the Jenkins build page under **Build Artifacts**.

---



---

<div align="center">

**Built with ❤️ by [Houssem Dhahri](https://github.com/HoussemDhahri)**

<img src="https://img.shields.io/badge/Security-Shift--Left-red?style=flat-square"/>
<img src="https://img.shields.io/badge/GitOps-ArgoCD-orange?style=flat-square"/>
<img src="https://img.shields.io/badge/Pipeline-Jenkins-D24939?style=flat-square"/>
<img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-F46800?style=flat-square"/>
<img src="https://img.shields.io/badge/Logs-Loki-F5A623?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

</div>