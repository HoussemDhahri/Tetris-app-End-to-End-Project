<div align="center">

# 🎮 Tetris App — End-to-End DevOps & GitOps Project

<img src="https://img.shields.io/badge/DevOps-End--to--End-blueviolet?style=for-the-badge&logo=devops&logoColor=white"/>
<img src="https://img.shields.io/badge/Jenkins-Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Kubernetes-GitOps-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/ArgoCD-App--of--Apps-EF7B4D?style=for-the-badge&logo=argo&logoColor=white"/>
<img src="https://img.shields.io/badge/SonarQube-Quality%20Gate-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white"/>
<img src="https://img.shields.io/badge/Trivy-Security%20Scan-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-Frontend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker%20Hub-Registry-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Kustomize-Overlays-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>

<br/>
<br/>

> **A production-grade DevOps pipeline** that automates the full software delivery lifecycle of a Node.js Tetris game — from source code, through security scanning and quality gates, to a Kubernetes deployment managed with GitOps (ArgoCD), running **two live versions side by side**: `v1.0.0` in staging and `v2.0.0` in production.

</div>

> ⚠️ **Note:** The application source code (`Tetris-V1`, `Tetris-V2`) was not developed by me. This repository documents the **DevOps / Platform Engineering layer**: the Jenkins CI/CD pipeline, Kubernetes manifests (Kustomize), and GitOps delivery (ArgoCD). This project does **not** include a monitoring stack.

**Repository:** https://github.com/HoussemDhahri/Tetris-app-End-to-End-Project

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [☸️ Kubernetes & GitOps](#️-kubernetes--gitops)
- [🌍 Environments & Versioning](#-environments--versioning)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🗺️ Roadmap](#️-roadmap)

---

## 🎯 Overview

This project implements a **complete DevOps pipeline** for a Node.js Tetris game, demonstrating a real **version-promotion workflow** across two environments:

| Pillar | Implementation |
|--------|-----------------|
| 🔄 **Continuous Integration** | A single Jenkins pipeline, building from `Tetris-V2`, triggered on every push |
| 🛡️ **Quality & Security** | SonarQube quality gate + Trivy (filesystem, image & SBOM scanning) on every build |
| 📦 **Containerization** | One Docker image (`houssemdhahri93/tetris`), pushed to Docker Hub |
| 🚢 **Continuous Delivery** | GitOps with ArgoCD — staging auto-synced, production manually synced |
| ☸️ **Orchestration** | Kubernetes with Kustomize (`base` + environment `overlays`) |
| 🏷️ **Versioning** | Staging pinned to image tag `v1.0.0`, production pinned to `v2.0.0` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER WORKFLOW                              │
│                                                                          │
│   git push ──► GitHub ──► Webhook ──► Jenkins (Tetris-V2)               │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       JENKINS CI/CD          │
                    │                              │
                    │  ✅ Checkout & npm ci         │
                    │  🧪 Lint + Unit Tests         │
                    │  🛡️  Trivy FS Scan            │
                    │  📊 SonarQube + Quality Gate  │
                    │  🔨 npm run build             │
                    │  🐳 Docker Build              │
                    │  🛡️  Trivy Image Scan + SBOM  │
                    │  📤 Push to Docker Hub        │
                    │  🔄 Update Kustomize Image     │
                    │  🔄 Git Push (GitOps repo)     │
                    └──────┬────────────┬──────────┘
                           │            │
               ┌───────────▼──┐    ┌────▼────────────┐
               │  Docker Hub  │    │   GitHub Repo    │
               │(tetris image)│    │ (GitOps Source)  │
               └──────────────┘    └────────┬─────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │           ArgoCD           │
                               └──┬────────────────────┬───┘
                                  │                     │
                      ┌───────────▼──────────┐  ┌───────▼─────────────┐
                      │   tetris-staging      │  │    tetris-prod       │
                      │   (auto-sync)         │  │   (manual sync)      │
                      │                       │  │                      │
                      │   image: tetris       │  │   image: tetris      │
                      │   tag:   v1.0.0       │  │   tag:   v2.0.0      │
                      │   + Ingress           │  │   + Ingress          │
                      └───────────────────────┘  └──────────────────────┘
```

> ℹ️ Both environments deploy from the **same Kustomize base** (one `Deployment` + one `Service`). The only differences per environment are the **image tag** and the **Ingress** — everything else is shared, keeping staging and prod configuration-consistent by design.

---

## 📁 Project Structure

```
Tetris-app-End-to-End-Project/
│
├── Tetris-V1/                          # Tetris source code — v1.0.0 (running in staging)
├── Tetris-V2/                          # Tetris source code — v2.0.0 (running in prod, actively built by CI)
├── Jenkinsfile                         # Single CI/CD pipeline (builds Tetris-V2)
│
└── Kubernetes-Manifests-file/
    │
    ├── argocd/
    │   ├── app-of-apps                 # Root ArgoCD Application (App-of-Apps)
    │   └── applications/
    │       ├── staging.yaml            # ArgoCD Application → overlays/staging (auto-sync)
    │       └── prod.yaml               # ArgoCD Application → overlays/prod (manual sync)
    │
    ├── base/                           # Environment-agnostic Kustomize base
    │       deployment.yaml             # tetris-deployment (1 replica, port 3000)
    │       kustomization.yaml
    │       service.yaml
    │
    └── overlays/
        ├── prod/
        │       ingress.yaml
        │       kustomization.yaml      # images: houssemdhahri93/tetris → v2.0.0
        │
        └── staging/
                ingress.yaml
                kustomization.yaml      # images: houssemdhahri93/tetris → v1.0.0
```

---

## 🔄 CI/CD Pipeline

A **single declarative Jenkins pipeline** builds the application (currently sourced from `Tetris-V2`), triggered automatically on `githubPush()`:

```
🧹 Clean Workspace
    │
    ▼
📥 Checkout (GitHub)
    │
    ▼
🏷️  Set Image Tag ─────────────── git tag, or sha-<short-commit> fallback
    │
    ▼
⚙️  Install Dependencies ───────── npm ci
    │
    ▼
⚡ Quality Checks (parallel) ───── Lint + Unit Tests (coverage, JUnit)
    │
    ▼
🛡️  Trivy Filesystem Scan ──────── vuln + secret scan (HIGH/CRITICAL)
    │
    ▼
📊 SonarQube Analysis (Tetris_v2)
    │
    ▼
🚦 Quality Gate ─────────────────── pipeline aborts on failure
    │
    ▼
🔨 npm run build
    │
    ▼
🐳 Docker Build ──────────────────── tagged {IMAGE_TAG} + latest
    │
    ▼
🛡️  Trivy Image Scan + SBOM ─────── fails hard on CRITICAL CVEs
    │
    ▼
📤 Push to Docker Hub (houssemdhahri93/tetris)
    │
    ▼
🔄 Update Staging (Kustomize + Git push) ──► ArgoCD auto-syncs
    │
    ▼
✋ Manual Approval (APPLY_PROD)
    │
    ▼
🔄 Update Prod (Kustomize + Git push) ──────► requires manual sync in ArgoCD
```

> 🔑 **Key design point:** Jenkins never calls `kubectl apply` directly. It only runs `kustomize edit set image` inside the relevant overlay and pushes the change to Git — **ArgoCD is the only thing that ever talks to the cluster**, keeping the pipeline fully GitOps-compliant.

> 🏷️ **On versioning:** the pipeline computes `IMAGE_TAG` from the latest Git tag (or a `sha-<commit>` fallback) and applies it to whichever overlay it updates. The `v1.0.0` / `v2.0.0` tags currently pinned in staging/prod reflect a deliberate version promotion — staging still running the previous release while production has been promoted to the newer one.

### Security & Quality Tooling

| Tool | What it does |
|------|----------------|
| **SonarQube** | Enforced quality gate (`Tetris_v2` project) |
| **Trivy (FS scan)** | Scans source code + detects leaked secrets (`HIGH`, `CRITICAL`) |
| **Trivy (image scan)** | Vulnerability report + **hard fail on CRITICAL CVEs** |
| **Trivy (SBOM)** | Generates a CycloneDX Software Bill of Materials, archived per build |

---

## ☸️ Kubernetes & GitOps

### ArgoCD Applications

| Application | Path | Namespace | Sync Policy |
|-------------|------|-----------|--------------|
| `tetris-staging` | `overlays/staging` | `tetris-staging` | **Automated** (`prune: true`, `selfHeal: true`) — deploys as soon as Jenkins pushes a new tag |
| `tetris-prod` | `overlays/prod` | `tetris-prod` | **Manual** — no `automated` block; requires an explicit sync in ArgoCD even after Jenkins' own approval gate |

Both Applications use `CreateNamespace=true` and `ApplyOutOfSyncOnly=true` sync options.

> 🛡️ This gives production a **double safety net**: a human must approve the promotion in Jenkins (`APPLY_PROD` parameter), *and* a human (or a separate automation) must trigger the ArgoCD sync for it to actually reach the cluster.

### Kustomize layering

```yaml
# base/kustomization.yaml
resources:
  - deployment.yaml
  - service.yaml
```

```yaml
# overlays/staging/kustomization.yaml
resources:
  - ../../base
  - ingress.yaml
images:
  - name: houssemdhahri93/tetris
    newName: houssemdhahri93/tetris
    newTag: v1.0.0
```

```yaml
# overlays/prod/kustomization.yaml
resources:
  - ../../base
  - ingress.yaml
images:
  - name: houssemdhahri93/tetris
    newName: houssemdhahri93/tetris
    newTag: v2.0.0
```

The base `Deployment` runs a single container on port `3000`, with resource requests/limits of `512m/1Gi` CPU and `250Mi/500Mi` memory.

---

## 🌍 Environments & Versioning

| Environment | Overlay Path | Namespace | Image Tag | Sync |
|--------------|--------------|------------|-----------|------|
| **Staging** | `overlays/staging` | `tetris-staging` | `v1.0.0` | Automated |
| **Production** | `overlays/prod` | `tetris-prod` | `v2.0.0` | Manual |

This setup models a realistic scenario: **staging still serves the previous release** while **production has already been promoted** to the newer version — useful for comparison testing, rollback reference, or staggered rollout validation.

---

## ⚙️ Prerequisites

| Tool | Purpose |
|------|---------|
| **Jenkins** | CI/CD orchestration (with Node.js 22 tool configured) |
| **Docker** | Container builds |
| **Kustomize** | K8s manifest patching |
| **ArgoCD** | GitOps controller |
| **Kubernetes** | Container orchestration |
| **SonarQube server** | Code quality gate |
| **Trivy** | Security scanning |

### Jenkins Credentials Required

| Credential ID | Type | Usage |
|--------------|------|-------|
| `Dockerhub` | Username/Password | Docker Hub image push |
| `github-token` | Username/Password | GitHub checkout & GitOps push |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HoussemDhahri/Tetris-app-End-to-End-Project.git
cd Tetris-app-End-to-End-Project
```

### 2. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 3. Deploy the ArgoCD Applications

```bash
kubectl apply -f Kubernetes-Manifests-file/argocd/app-of-apps
kubectl get applications -n argocd
```

Staging (`tetris-staging`) will sync automatically. Production (`tetris-prod`) will show as `OutOfSync` until manually synced:

```bash
argocd app sync tetris-prod
```

### 4. Preview Manifests Locally (without ArgoCD)

```bash
kubectl kustomize Kubernetes-Manifests-file/overlays/staging
kubectl kustomize Kubernetes-Manifests-file/overlays/prod
```

### 5. Trigger a Deployment

```bash
git push origin main
# Jenkins webhook fires → pipeline builds Tetris-V2
# → pushes image to Docker Hub
# → auto-updates staging → ArgoCD auto-syncs
# → re-run with APPLY_PROD=true + manual Jenkins approval
# → updates prod overlay → requires a manual `argocd app sync tetris-prod`
```

---

## 🗺️ Roadmap

- [ ] Split the pipeline (or parametrize it) so `Tetris-V1` can also be built and independently promoted
- [ ] Add a monitoring stack (Prometheus/Grafana) for both environments
- [ ] Add TLS / cert-manager integration for the Ingress resources

---

<div align="center">

**Built with ❤️ — Tetris App DevOps End-to-End Project**

<img src="https://img.shields.io/badge/GitOps-ArgoCD-orange?style=flat-square"/>
<img src="https://img.shields.io/badge/Pipeline-Jenkins-D24939?style=flat-square"/>
<img src="https://img.shields.io/badge/Quality-SonarQube-4E9BCD?style=flat-square"/>
<img src="https://img.shields.io/badge/Security-Trivy-1904DA?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

</div>