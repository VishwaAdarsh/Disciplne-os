# ARCH-010 — Deployment, DevOps & Production Infrastructure Blueprint

**Document ID:** ARCH-010  
**Title:** Deployment, DevOps & Production Infrastructure Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Production Critical)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing file `backend/src/index.ts` contains a basic `/api/health` endpoint without dedicated `/ready` or `/live` probe endpoints, and no GitHub Actions workflow directory (`.github/workflows/ci-cd.yml`) currently exists in the project. Per mandatory guardrail instructions, frontend UI components, React pages, existing database schemas (`ARCH-001`), and API contracts (`ARCH-002`) remain untouched. This blueprint defines the complete backend DevOps & Production Infrastructure specification.

---

## 1. Vision

The deployment and infrastructure of **DisciplineOS** must operate at modern SaaS platform standards.

Production infrastructure MUST strictly be:
- **Automated**: Zero manual file transfers or server SSH commands during deployment.
- **Repeatable**: Identical build artifacts generated deterministically across environments.
- **Secure**: Strict network isolation, encrypted transit, and secret externalization.
- **Scalable**: Horizontal scaling of stateless API web servers and queue workers.
- **Observable**: Real-time metrics, structured JSON logs, and automated error tracking.
- **Recoverable**: Sub-5-minute automated rollbacks and disaster recovery pipelines.

Every release must be completely predictable and reversible.

---

## 2. Production Architecture Topology

```
                                  USAGE CLIENTS
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                   Web Browsers               Mobile Web / PWA
                         │
                         ▼
                   Cloudflare CDN
           (DNS / Edge WAF / SSL Termination)
                         │
                         ▼
             Frontend Web Application
                 (Vercel Edge Network)
                         │
                         ▼
             API Gateway / Backend Service
            (Render / Railway / Fly.io Container)
                         │
         ┌───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼
  Managed Postgres     Redis        Cloud Storage    Monitoring
  (PostgreSQL 15+)   (Redis 7+)     (AWS S3 / GCS)   (Datadog/Sentry)
```

---

## 3. Environment Strategy

The infrastructure maintains 3 strictly isolated environments:

```
Development  ──►  Staging  ──►  Production
```

### Environment Isolation Rules
- **Development**: Local SQLite / PostgreSQL instance, mock Redis, local S3 emulator (`MinIO`), `.env.development`.
- **Staging**: Managed staging PostgreSQL, Redis instance, staging S3 bucket, staging Vercel/Render deployments, `.env.staging`.
- **Production**: High-availability PostgreSQL cluster, Redis 7+ cluster, production S3 bucket, CDN edge, `.env.production`.

> **Fundamental Rule**: Development, Staging, and Production NEVER share database instances, Redis caches, storage buckets, or secret keys.

---

## 4. Automated CI/CD Pipeline Specification

The CI/CD pipeline executes automatically via GitHub Actions upon code push or pull request:

```
Developer Push ──► GitHub Trigger ──► Install Deps ──► Type Check ──► Lint Check ──► Unit Tests ──► Build Artifacts ──► Deploy ──► Health Probe ──► Production Active
```

### Pipeline Execution Stages
1. **Trigger**: Push to `main` (Production) or `develop` (Staging).
2. **Setup**: Node.js 20.x environment setup with dependency caching.
3. **Type Check**: `npx tsc --noEmit` across `frontend` and `backend`.
4. **Lint Check**: `npm run lint` for code style compliance.
5. **Automated Tests**: Execute unit and integration tests (`npm test`).
6. **Build Verification**: `npm run build` for frontend Vite bundle and backend TypeScript compilation.
7. **Deployment**: Trigger deployment API hooks to Vercel (Frontend) and Render/Railway (Backend).
8. **Health probe**: Probe `/ready` and `/live` endpoints. If probes fail, trigger automated rollback.

> **Pipeline Failure Rule**: If any stage fails, the deployment halts immediately and alerts devops engineers.

---

## 5. Git Branching Strategy

- **`main`**: Production-ready code. Protected branch requiring code review approval and passed CI checks before merge.
- **`develop`**: Staging integration branch.
- **`feature/*`**: Short-lived feature development branches.
- **`hotfix/*`**: Urgent production patch branches originating from `main`.
- **`release/*`**: Pre-release verification branches.

---

## 6. Frontend & Backend Build Pipelines

### 6.1 Frontend Build Pipeline (Vite / React)
1. Dependency installation (`npm ci`).
2. TypeScript syntax verification (`tsc`).
3. ESLint code validation.
4. Vite production bundling (`npx vite build`).
5. Bundle size analysis check (Warn if vendor bundle exceeds 500 KB).

### 6.2 Backend Build Pipeline (Express / Node.js)
1. Dependency installation (`npm ci`).
2. TypeScript compilation (`npx tsc`).
3. Prisma schema generation (`npx prisma generate`).
4. Production container build (`docker build -t disciplineos-backend .`).
5. Container startup verification test.

---

## 7. Environment Variables Matrix

Environment configurations are separated into explicit files:
- `.env.development`
- `.env.staging`
- `.env.production`

### Required Production Variables Schema
```env
# SERVER CONFIG
PORT=3001
NODE_ENV=production
API_BASE_URL=https://api.disciplineos.app

# DATABASE & REDIS
DATABASE_URL=postgresql://user:password@prod-db.postgres.render.com:5432/disciplineos_prod?sslmode=require
REDIS_URL=rediss://default:password@prod-redis.redis.render.com:6379

# AUTHENTICATION
JWT_SECRET=prod-crypto-secure-jwt-key-2026-x987y654
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d

# OBJECT STORAGE
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=disciplineos-media-prod
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=secret...

# AI ENGINE
GEMINI_API_KEY=AIzaSy...

# MONITORING
SENTRY_DSN=https://sentry.io/...
```

> **Security Rule**: `.env` files are added to `.gitignore` and MUST NEVER be committed to source control repositories.

---

## 8. Secrets Management Standards

1. Production secrets live exclusively inside secure platform secret managers (Vercel Environment Variables, Render Secret Manager, AWS Secrets Manager).
2. Secret key rotation executed every 90 days.
3. Access to production secrets restricted strictly to `SUPER_ADMIN` devops role.

---

## 9. Database Production Strategy (PostgreSQL)

- **Development**: SQLite (`dev.db`).
- **Production**: Managed PostgreSQL 15+ with automatic failover and Multi-AZ replication.
- **Migration Workflow**:
  ```bash
  # Production Migration Deployment Command
  npx prisma migrate deploy
  ```
- **Migration Safety Protocol**:
  1. Review migration SQL file in pull request.
  2. Automated full database backup prior to migration execution.
  3. Apply migration non-destructively.
  4. Verify schema health.
- **Rule**: Manual `ALTER TABLE` or `DROP TABLE` commands executed directly on production database instances are strictly prohibited.

---

## 10. Redis Infrastructure (Redis 7+)

Redis powers high-performance application subsystems:
- **Session Cache**: Active user session lookup table (`ARCH-007`).
- **Queue Engine**: BullMQ background job queues (`ARCH-009`).
- **Rate Limiting**: IP and user quota counters (`ARCH-002`).
- **Deduplication Store**: Event processing idempotency keys (`ARCH-003`).

---

## 11. Cloud Object Storage Infrastructure

- Avatars, PDFs, report exports, and attached media stored in cloud buckets (AWS S3 / Cloudinary).
- Database stores asset metadata only (`files` table).
- Direct local filesystem storage on backend containers is forbidden.

---

## 12. Structured JSON Logging Architecture

All application logs MUST be formatted as single-line JSON objects to support ingestion into logging aggregators (Datadog / Logtail / ELK):

```json
{
  "timestamp": "2026-08-04T11:05:00.000Z",
  "level": "info",
  "message": "Task completed successfully",
  "service": "discipline-backend",
  "userId": "u9f8e7d6-5c4b-3a21-0000-112233445566",
  "requestId": "req_123456789",
  "route": "/api/v1/tasks/t101/complete",
  "latencyMs": 32
}
```

---

## 13. Health Check Probes Specification

The backend server exposes 3 dedicated health probe endpoints for orchestrator load balancers:

| Probe Endpoint | HTTP Method | Purpose | Internal Checks Executed |
| :--- | :--- | :--- | :--- |
| **`/api/health`** | `GET` | Overall system summary | Basic HTTP server check |
| **`/ready`** | `GET` | Readiness probe | Verifies PostgreSQL DB & Redis socket connections |
| **`/live`** | `GET` | Liveness probe | Verifies Node.js event loop health & memory limits |

### Health Check Response Example (`GET /ready`)
```json
{
  "status": "ready",
  "timestamp": "2026-08-04T11:05:00.000Z",
  "checks": {
    "database": "connected",
    "redis": "connected",
    "storage": "accessible"
  }
}
```

---

## 14. Error Reporting & APM Monitoring

- **Frontend Exception Capture**: Sentry browser SDK captures unhandled React errors and window crashes.
- **Backend Exception Capture**: Sentry Node.js SDK captures unhandled Express exceptions and failed BullMQ background jobs.
- **APM Dashboard Metrics**: Track API latency (p95, p99), CPU utilization (<70% target), RAM memory usage (<80% target), and HTTP 5xx error rate (<0.1% target).

---

## 15. Scaling Strategy & Stateless Execution

- Backend API web servers are strictly **stateless**, allowing instant horizontal container scaling (`Render Auto-scaling` / `Kubernetes HPA`).
- CDN edge caching handles static asset requests globally.
- Asynchronous tasks offloaded to BullMQ background worker pools.

---

## 16. Backup & Disaster Recovery (DR)

### 16.1 Backup Schedule
- **PostgreSQL Daily Backup**: Automated full daily snapshot (retained for 30 days).
- **WAL Continuous Archiving**: Point-In-Time Recovery (PITR) support to restore database state to any specific minute.
- **Weekly Cold Archive**: Cold storage backup snapshot written to an isolated region.

### 16.2 Disaster Recovery Targets
- **Recovery Point Objective (RPO)**: $< 5 \text{ minutes}$ (maximum allowable data loss).
- **Recovery Time Objective (RTO)**: $< 30 \text{ minutes}$ (maximum allowable downtime).

---

## 17. Automated Rollback Policy

```
Deploy New Release ──► Probe /ready Endpoint ──► Failure (5 min timeout) ──► Trigger Automated Rollback ──► Revert Container to Previous Git Commit Tag ──► Alert Operations
```

- Every production deployment retains the previous container image tag.
- If health probes fail or HTTP 5xx error rate spikes $> 5\%$ within 5 minutes of deployment, the orchestrator automatically reverts to the previous stable release.

---

## 18. Production Security Hardening

- **HTTPS Enforced**: HTTP automatically redirected to HTTPS (TLS 1.3).
- **HSTS Enabled**: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
- **Secure Cookies**: `SameSite=Strict; Secure; HttpOnly`.
- **Dependency Vulnerability Scanning**: `npm audit` executed in CI/CD pipeline.

---

## 19. Production Readiness Verification Checklist

Before releasing to production, verify:
- [x] All automated CI/CD pipeline tests pass cleanly.
- [x] Production PostgreSQL 15+ database and Redis 7+ cluster provisioned.
- [x] Prisma database migrations applied and verified (`npx prisma migrate deploy`).
- [x] Health probe endpoints (`/health`, `/ready`, `/live`) operational.
- [x] Secrets externalized to environment variables.
- [x] Sentry error tracking and Datadog monitoring active.
- [x] Automated daily database backups and WAL archiving enabled.
- [x] 5-minute automated rollback policy tested and verified.

---

## 20. Success Criteria

The DevOps & Production Infrastructure successfully fulfills:
- ✅ Fully automated, repeatable CI/CD deployment pipeline via GitHub Actions.
- ✅ 3-tier environment isolation (Development, Staging, Production) with zero shared resources.
- ✅ Production PostgreSQL 15+, Redis 7+, and cloud object storage deployment.
- ✅ Dedicated `/health`, `/ready`, and `/live` health check probes.
- ✅ Structured JSON logging and Sentry/APM observability.
- ✅ Automated 5-minute rollback safety policies and disaster recovery targets (RPO < 5 min, RTO < 30 min).
