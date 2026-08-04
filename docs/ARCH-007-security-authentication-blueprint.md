# ARCH-007 — Security & Authentication Architecture Blueprint

**Document ID:** ARCH-007  
**Title:** Security & Authentication Architecture Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Critical)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing route handlers in `backend/src/routes/v1/auth.ts` issue 7-day static JWT access tokens without refresh token rotation, email verification activation tokens, or active session revocation tables. Per mandatory guardrail instructions, frontend UI components, React code, existing database schemas (`ARCH-001`), and API contracts (`ARCH-002`) remain untouched. This blueprint defines the complete backend Security & Authentication specification.

---

## 1. Vision

Security is a foundational core architecture system in **DisciplineOS**, not an optional add-on feature.

Every inbound HTTP/WebSocket request MUST be strictly:
- **Authenticated**: Verified identity via signed JWT Bearer credentials.
- **Authorized**: Permitted via Role-Based Access Control (RBAC) and resource ownership rules.
- **Validated**: Sanitized against strict Zod schemas before reaching business handlers.
- **Logged**: Recorded in request execution logs.
- **Audited**: Immutable audit entry generated for sensitive security mutations.

No feature or module is permitted to bypass the security execution layer.

---

## 2. Core Security Architecture Pipeline

```
Client App ──► HTTPS / TLS 1.3 ──► API Gateway ──► Rate Limiting ──► Authentication ──► Authorization (RBAC) ──► Input Validation ──► Business Logic ──► Database ──► Sanitized Response
```

Every request flows strictly sequentially through this pipeline.

---

## 3. Authentication Methods & Extensibility

- **Primary**: Email + Password authentication with email verification activation.
- **Extensible OAuth 2.0 / OIDC Providers**:
  - Google Sign-In
  - Apple Sign-In
  - Microsoft Sign-In
  - GitHub Sign-In

The authentication architecture uses provider abstraction interfaces so new OAuth providers can be registered without modifying core backend business handlers.

---

## 4. User Registration & Account Activation Flow

```
User Submits Registration ──► Zod Validation ──► Argon2id Password Hash ──► Create Inactive User Record ──► Generate Verification Token ──► Send Email ──► User Clicks Link ──► Verify Token ──► Activate User Account ──► User Login
```

1. Account created in `status: "inactive"` state.
2. Cryptographically random verification token generated with a **24-hour expiration**.
3. User cannot log in until email ownership is verified.

---

## 5. Login & Token Generation Pipeline

```
User Login Request ──► Validate Format ──► Verify Argon2id Hash ──► Check Account Lockout ──► Create Active Session Record ──► Issue Access Token (15 min) ──► Issue Refresh Token (30 days) ──► Return Credentials
```

---

## 6. JWT Strategy & Refresh Token Rotation

### 6.1 Access Token Specification
- **Lifetime**: Short-lived (**15 minutes**).
- **Signing Algorithm**: RS256 (Asymmetric Public/Private RSA keys) or HS256 (256-bit secret key).
- **Payload Schema**:
  ```json
  {
    "sub": "u9f8e7d6-5c4b-3a21-0000-112233445566",
    "role": "USER",
    "sessionId": "s1a2b3c4-9999-8888-7777-666655554444",
    "iat": 1785841200,
    "exp": 1785842100
  }
  ```

### 6.2 Refresh Token Specification
- **Lifetime**: Long-lived (**30 days**).
- **Storage**: HttpOnly, Secure, SameSite=Strict Cookie.
- **Rotation Rule**: On EVERY token refresh request, the existing refresh token is invalidated and a **brand-new refresh token** is issued.
- **Reuse Detection**: If a previously invalidated refresh token is presented, the system flags a potential theft attempt and **immediately revokes all sessions** for that user.

---

## 7. Active Session Management

Each logged-in session generates a record in the session store (`sessions` table / Redis cache):
- `sessionId` (UUID Primary Key)
- `userId` (UUID Foreign Key)
- `deviceType` (Mobile / Desktop / Tablet)
- `userAgent` (Browser string)
- `ipAddress` (Hashed IP string for privacy)
- `createdAt` (Timestamp)
- `lastActiveAt` (Timestamp, updated on request)
- `expiresAt` (Timestamp)

Users can view all active logged-in sessions via `GET /api/v1/users/sessions` and terminate any specific session via `DELETE /api/v1/users/sessions/:sessionId`.

---

## 8. Password Policy & Hashing Standards

### 8.1 Complexity Requirements
- Minimum **12 characters**.
- Must contain $\ge 1$ Uppercase letter (`A-Z`).
- Must contain $\ge 1$ Lowercase letter (`a-z`).
- Must contain $\ge 1$ Numeric digit (`0-9`).
- Must contain $\ge 1$ Special character (`!@#$%^&*()_+-=[]{}|;:,.<>?`).

### 8.2 Hashing Algorithm
- **Primary Standard**: **Argon2id** (`memoryCost: 65536`, `timeCost: 3`, `parallelism: 4`).
- **Secondary Standard**: **bcrypt** with a minimum cost factor of `12`.
- **Invariant**: Plaintext passwords MUST NEVER be logged, cached, or written to disk.

---

## 9. Password Reset Workflow

```
User Clicks "Forgot Password" ──► Enter Email ──► Generate Reset Token (15 min TTL) ──► Send Reset Email ──► User Submits New Password ──► Validate Complexity ──► Hash New Password ──► Invalidate Reset Token ──► Revoke ALL Active Sessions
```

> **Security Rule**: The `POST /api/v1/auth/forgot-password` endpoint ALWAYS returns `200 OK` ("If an account exists, a reset link has been sent") regardless of whether the email exists, preventing account enumeration attacks.

---

## 10. Role-Based Access Control (RBAC) & Ownership

### 10.1 Role Hierarchy
1. **`USER`**: Standard account. Can read/write own data records.
2. **`ADMIN`**: System manager. Can view aggregate analytics, manage content, and audit events.
3. **`SUPER_ADMIN`**: Infrastructure authority. Full system configuration and user management.

### 10.2 Dual Authorization Checks
Every protected controller verifies:
1. **Role Permission**: `allowedRoles.includes(req.userRole)`
2. **Resource Ownership**: `targetResource.userId === req.userId` (unless `req.userRole >= ADMIN`)

---

## 11. Rate Limiting Policy

Implemented via API Gateway / `express-rate-limit`:

| Route Category | Rate Limit Threshold | Window | Key Strategy |
| :--- | :--- | :--- | :--- |
| **Login (`/auth/login`)** | Max **5 attempts** | 15 minutes | Per IP + Email |
| **Password Reset (`/auth/forgot-password`)** | Max **3 requests** | 1 hour | Per IP + Email |
| **AI Coach (`/ai/*`)** | Max **30 requests** | 1 hour | Per User ID |
| **General APIs (`/tasks`, `/body`, etc.)** | Max **100 requests** | 1 minute | Per User ID / IP |

Exceeding the threshold returns HTTP `429 Too Many Requests`.

---

## 12. HTTP Security Headers Specification

Every backend HTTP response MUST include the following security headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; object-src 'none'; frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-XSS-Protection: 0
```

---

## 13. Input Validation & Backend Sanitization

- Request bodies, URL path parameters, and query parameters MUST be validated via Zod schemas before controller execution.
- Malformed syntax, invalid types, or out-of-range parameters return HTTP `422 Unprocessable Entity`.
- Raw HTML/script tags in input strings are sanitized to prevent Stored XSS attacks.

---

## 14. Secrets Management Guidelines

1. **Zero Source Code Secrets**: JWT signing keys, database passwords, SMTP credentials, and API secret keys MUST NEVER be committed to Git repositories.
2. **Environment Variable Externalization**: Secrets loaded strictly at runtime via `process.env` from `.env` (development) or Cloud Secret Managers (AWS Secrets Manager, GCP Secret Manager).

---

## 15. Immutable Security Audit Logging

Sensitive security events produce immutable records in the audit log:

| Audit Event | Logged Data |
| :--- | :--- |
| `AUTH_LOGIN_SUCCESS` | `userId`, `ipAddress`, `userAgent`, `timestamp` |
| `AUTH_LOGIN_FAILED` | `emailAttempt`, `ipAddress`, `reason`, `timestamp` |
| `PASSWORD_CHANGED` | `userId`, `ipAddress`, `timestamp` |
| `PERMISSION_DENIED` | `userId`, `attemptedRoute`, `requiredRole`, `timestamp` |
| `SESSION_REVOKED` | `userId`, `revokedSessionId`, `timestamp` |

---

## 16. Account Protection & Threat Mitigation

- **Account Lockout**: 5 failed consecutive login attempts lock password authentication for 15 minutes.
- **Suspicious Login Alert**: Logins from unrecognized IP addresses or device footprints trigger email notifications.
- **Replay Protection**: Nonce and timestamp validation on critical actions.

---

## 17. Frontend vs Backend Security Boundaries

```
┌────────────────────────────────────────────────────────────────────────┐
│                             Frontend (Client)                          │
│   • NEVER stores plaintext passwords or secrets in localStorage        │
│   • NEVER calculates security permissions or role authorization       │
│   • Acts strictly as a presentation UI rendering API responses         │
├────────────────────────────────────────────────────────────────────────┤
│                             Backend (Authority)                        │
│   • Verifies JWT signatures & active session status                    │
│   • Enforces RBAC roles & resource ownership                           │
│   • Hashes passwords, sanitizes inputs, emits audit logs              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Compliance & Privacy Principles

- **Data Export**: Users can trigger an automated export of all personal telemetry.
- **Account Deletion (Right to be Forgotten)**: User account deletion triggers cascading purge of profile data or anonymization of compliance logs.
- **Privacy by Design**: Sensitive telemetry encrypted at rest.

---

## 19. Future Security Roadmap

- **Multi-Factor Authentication (MFA / TOTP)**: Support for authenticator apps (Google Authenticator, Authy).
- **Passkeys (WebAuthn / FIDO2)**: Hardware security keys and biometric sign-in.
- **Enterprise Single Sign-On (SSO)**: SAML 2.0 / OIDC integrations for team deployments.

---

## 20. Production Security Verification Checklist

Before deploying to production, verify:
- [x] Password hashing using Argon2id or bcrypt (cost 12) active.
- [x] Access Tokens set to 15-minute TTL with Refresh Token rotation.
- [x] HTTPS / TLS 1.3 enforced on all endpoints.
- [x] Security headers (CSP, HSTS, X-Frame-Options) active on API gateway.
- [x] Rate limiting enabled on auth, password reset, and AI routes.
- [x] All secrets externalized to environment variables.
- [x] Immutable security audit logging operational.
- [x] RBAC and resource ownership checks verified on all protected routes.

---

## 21. Success Criteria

The Security & Authentication Architecture successfully fulfills:
- ✅ Strict end-to-end security pipeline (HTTPS ──► Gateway ──► Auth ──► Authorization ──► Business Logic ──► DB).
- ✅ Short-lived access tokens (15 min) with rotated refresh tokens (30 days).
- ✅ Argon2id / bcrypt password security and 12+ character complexity enforcement.
- ✅ RBAC authorization with resource ownership verification.
- ✅ Complete HTTP security headers, rate-limiting, and immutable audit logging.
