# ARCH-002 — API Contracts & Backend Interface Blueprint

**Document ID:** ARCH-002  
**Title:** API Contracts & Backend Interface Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Highest)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Legacy mock route handlers in `backend/src/routes/v1` currently return custom top-level JSON fields in isolated endpoints without standardized `meta` pagination blocks or Zod request validation wrappers. Per mandatory implementation guardrails, frontend UI components, React hooks, and database schemas (`ARCH-001`) remain untouched. This blueprint provides the complete API specification and OpenAPI contract for full backend alignment.

---

## 1. Vision

The API layer is the single standardized communication bridge between:
- Frontend (React / Vite Web Client)
- Backend API Services (Express / Node.js)
- AI Engine (Gemini / LLM Context Pipeline)
- Event Engine (Immutable Event Stream)
- Mobile App & Future Integrations

Every feature communicates strictly through standardized RESTful APIs. **No direct database access from the frontend is permitted.**

---

## 2. API Principles

Every API endpoint must strictly be:
1. **RESTful**: standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) mapping to resources.
2. **Versioned**: explicitly scoped under `/api/v1/*`.
3. **Predictable**: uniform URL patterns, status codes, request bodies, and envelope structures.
4. **Secure**: mandatory JWT authentication and Role-Based Access Control (RBAC).
5. **Stateless**: request self-containment via JWT Bearer headers without server sessions.
6. **Documented**: OpenAPI 3.0 (Swagger) specification kept in lockstep with implementation.
7. **Type-safe**: request and response payload schemas validated with Zod.
8. **Consistent**: standardized envelope JSON structure for all success and error responses.

---

## 3. Base URL & Route Namespace

**Base URL**:  
`/api/v1`

**Example Core Routes**:
- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/tasks`
- `/api/v1/habits`
- `/api/v1/focus`
- `/api/v1/body`
- `/api/v1/mind`
- `/api/v1/nutrition`
- `/api/v1/goals`
- `/api/v1/performance`
- `/api/v1/events`
- `/api/v1/analytics`
- `/api/v1/notifications`
- `/api/v1/ai`
- `/api/v1/settings`
- `/api/v1/files`
- `/api/v1/reports`

---

## 4. Standard Response Envelope Format

### 4.1 Success Response Structure
Every successful API execution MUST return an HTTP status in the `2xx` range with the following JSON structure:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "c1f7b8a0-7d43-4e89-9a1b-123456789abc",
    "title": "Morning Cold Shower & Hydration",
    "category": "nonneg",
    "priority": "high",
    "completed": false
  },
  "meta": {
    "timestamp": "2026-08-04T10:45:00.000Z",
    "requestId": "req_987654321"
  }
}
```

#### Paginated Success Response
When returning collections, `meta` MUST contain pagination metadata:

```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8,
    "hasNext": true,
    "hasPrevious": false,
    "timestamp": "2026-08-04T10:45:00.000Z",
    "requestId": "req_123456789"
  }
}
```

---

### 4.2 Error Response Structure
Every API error MUST return an appropriate HTTP status in the `4xx` or `5xx` range with the following JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Requested task with ID 'c1f7b8a0-7d43-4e89-9a1b-123456789abc' does not exist",
    "details": [],
    "timestamp": "2026-08-04T10:45:00.000Z",
    "requestId": "req_error_12345"
  }
}
```

#### Validation Error (HTTP 422) Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body parameters",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      },
      {
        "field": "duration",
        "message": "Duration must be a positive integer"
      }
    ],
    "timestamp": "2026-08-04T10:45:00.000Z",
    "requestId": "req_val_998877"
  }
}
```

---

## 5. Authentication Specification

### 5.1 Bearer Token Headers
Protected endpoints require HTTP Header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 5.2 Endpoint Scope Matrix

| Endpoint Route | Auth Required | Rate Limit | Permissions Required |
| :--- | :--- | :--- | :--- |
| `POST /api/v1/auth/register` | Public | 5 req/min | None |
| `POST /api/v1/auth/login` | Public | 5 req/min | None |
| `POST /api/v1/auth/refresh` | Public | 10 req/min | None |
| `POST /api/v1/auth/forgot-password` | Public | 3 req/min | None |
| `POST /api/v1/auth/reset-password` | Public | 3 req/min | None |
| `GET /api/v1/auth/verify-email` | Public | 5 req/min | None |
| `GET /api/v1/auth/me` | Protected | 60 req/min | `USER` |
| `POST /api/v1/auth/logout` | Protected | 60 req/min | `USER` |
| **All Other `/api/v1/*` Routes** | Protected | 100 req/min | `USER` / `ADMIN` |

---

## 6. Authorization Model (RBAC)

1. **`USER`**: Access to own user data, profile, tasks, body, mind, nutrition, goals, events, AI assistant, and settings.
2. **`ADMIN`**: Access to system analytics, user management, system events, and global report triggers.
3. **`SUPER_ADMIN`**: Unrestricted full access including database maintenance and security logs.

---

## 7. Endpoint Specifications across 16 Modules

### Module 1: Authentication (`/auth`)

#### `POST /api/v1/auth/register`
- **Purpose**: Create a new user account.
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "user@disciplineos.com",
    "name": "Jane Doe",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `201 Created` with `accessToken`, `user` object.

#### `POST /api/v1/auth/login`
- **Purpose**: Authenticate user and return JWT access & refresh tokens.
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "user@disciplineos.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` with `accessToken`, `refreshToken`, `user`.

---

### Module 2: User Profile & Settings (`/users`, `/settings`)

#### `GET /api/v1/users/profile`
- **Purpose**: Fetch current user profile details.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with `Profile` object.

#### `PATCH /api/v1/users/profile`
- **Purpose**: Update user profile metadata (targets, bio, timezone).
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "timezone": "America/New_York",
    "dailyStepTarget": 12000,
    "dailyWaterTargetL": 3.5
  }
  ```
- **Response**: `200 OK` with updated `Profile`.

#### `GET /api/v1/settings`
- **Purpose**: Fetch user settings and preferences.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with `UserSettings` object.

#### `PATCH /api/v1/settings`
- **Purpose**: Update user settings (theme, reset time, alerts).
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with updated `UserSettings`.

---

### Module 3: Discipline & Tasks (`/tasks`, `/habits`, `/focus`)

#### `GET /api/v1/tasks`
- **Purpose**: List user tasks with filtering, sorting, and pagination.
- **Auth**: Protected (`USER`)
- **Query Params**: `page`, `limit`, `category` (`nonneg`|`habit`|`goal`), `priority`, `completed`, `search`.
- **Response**: `200 OK` with paginated task array.

#### `POST /api/v1/tasks`
- **Purpose**: Create a new task.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "title": "Core Deep Work Block",
    "category": "nonneg",
    "priority": "high",
    "estimatedMinutes": 60,
    "goalId": "b2c3d4e5-1111-2222-3333-444455556666"
  }
  ```
- **Response**: `201 Created` with created `Task` payload.

#### `PATCH /api/v1/tasks/:id/complete`
- **Purpose**: Toggle task completion status and emit `task_completed` event.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with `{ taskId, completed, streak, xpReward }`.

#### `POST /api/v1/focus/sessions/start`
- **Purpose**: Initiate a focus timer session.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "taskId": "c1f7b8a0-7d43-4e89-9a1b-123456789abc",
    "sessionName": "Architecture Design",
    "sessionType": "deepwork",
    "targetMinutes": 45
  }
  ```
- **Response**: `201 Created` with `FocusSession` details.

---

### Module 4: Body (`/body`)

#### `GET /api/v1/body/logs`
- **Purpose**: Fetch daily body logs (steps, water, sleep, recovery).
- **Auth**: Protected (`USER`)
- **Query Params**: `date` (`YYYY-MM-DD`).
- **Response**: `200 OK` with `BodyLog`.

#### `POST /api/v1/body/workouts`
- **Purpose**: Log a physical workout session.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "workoutType": "HIIT Training",
    "duration": 45,
    "intensity": "high",
    "calories": 420,
    "logDate": "2026-08-04"
  }
  ```
- **Response**: `201 Created` with `Workout` object.

---

### Module 5: Mind (`/mind`)

#### `GET /api/v1/mind/logs`
- **Purpose**: Retrieve daily mind logs (mood, focus, energy, stress).
- **Auth**: Protected (`USER`)
- **Query Params**: `date` (`YYYY-MM-DD`).
- **Response**: `200 OK` with `MindLog`.

#### `POST /api/v1/mind/journals`
- **Purpose**: Create a journal entry.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "title": "Evening Reflection",
    "content": "Executed phase 2.5 blueprint flawlessly today.",
    "moodTag": "focused"
  }
  ```
- **Response**: `201 Created` with `Journal` object.

---

### Module 6: Nutrition (`/nutrition`)

#### `POST /api/v1/nutrition/meals`
- **Purpose**: Log a meal with macros.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "mealName": "Grilled Chicken & Quinoa",
    "mealType": "Lunch",
    "calories": 650,
    "proteinGrams": 48.5,
    "carbsGrams": 52.0,
    "fatGrams": 14.2,
    "logDate": "2026-08-04"
  }
  ```
- **Response**: `201 Created` with `Meal` object.

#### `POST /api/v1/nutrition/water`
- **Purpose**: Log hydration amount.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "amount": 0.5
  }
  ```
- **Response**: `200 OK` with updated daily water total.

---

### Module 7: Goals & Milestones (`/goals`)

#### `GET /api/v1/goals`
- **Purpose**: List active goals with milestone progress.
- **Auth**: Protected (`USER`)
- **Query Params**: `status` (`Active`|`Completed`|`Archived`), `category`.
- **Response**: `200 OK` with array of `Goal` objects with embedded `Milestone` items.

#### `POST /api/v1/goals`
- **Purpose**: Create strategic goal.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "title": "Ship DisciplineOS v1.0 Production",
    "description": "Complete all core architecture phases",
    "category": "Career",
    "priority": "high",
    "deadline": "2026-09-01"
  }
  ```
- **Response**: `201 Created` with `Goal` payload.

---

### Module 8: Performance (`/performance`)

#### `GET /api/v1/performance/current`
- **Purpose**: Retrieve current 0-1000 overall performance score and module breakdowns.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with:
  ```json
  {
    "overallScore": 860,
    "disciplineScore": 920,
    "bodyScore": 810,
    "mindScore": 840,
    "nutritionScore": 850,
    "goalScore": 880,
    "level": 14,
    "xp": 14200,
    "levelTitle": "Master Architect"
  }
  ```

#### `GET /api/v1/performance/history`
- **Purpose**: Fetch historical daily score snapshot trend line.
- **Auth**: Protected (`USER`)
- **Query Params**: `startDate`, `endDate`.
- **Response**: `200 OK` with array of `PerformanceSnapshot` objects.

---

### Module 9: Event Store (`/events`)

#### `GET /api/v1/events`
- **Purpose**: Fetch immutable event ledger for user audit and timeline display.
- **Auth**: Protected (`USER`)
- **Query Params**: `page`, `limit`, `module`, `eventType`.
- **Response**: `200 OK` with paginated `Event` stream.

#### `POST /api/v1/events`
- **Purpose**: Record new system event into immutable ledger.
- **Auth**: Protected (`USER`)
- **Request Body**:
  ```json
  {
    "module": "discipline",
    "eventType": "task_completed",
    "title": "Morning Routine Completed",
    "scoreImpact": 20,
    "payloadJson": "{\"taskId\":\"dt-1\"}"
  }
  ```
- **Response**: `201 Created` with created `Event`.

---

### Module 10: AI Engine (`/ai`)

#### `POST /api/v1/ai/chat`
- **Purpose**: Send query to AI Coach Context Engine.
- **Auth**: Protected (`USER`)
- **Rate Limit**: 30 req/hour
- **Request Body**:
  ```json
  {
    "message": "Analyze my performance trend for the last 7 days and recommend adjustments."
  }
  ```
- **Response**: `200 OK` with AI response message, insights, and token metadata.

---

### Module 11: Notifications (`/notifications`)

#### `GET /api/v1/notifications`
- **Purpose**: Retrieve user notifications.
- **Auth**: Protected (`USER`)
- **Query Params**: `read` (`true`|`false`).
- **Response**: `200 OK` with notification list.

#### `PATCH /api/v1/notifications/:id/read`
- **Purpose**: Mark single notification as read.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK`.

---

### Module 12: Analytics (`/analytics`)

#### `GET /api/v1/analytics/daily`
- **Purpose**: Fetch pre-aggregated daily performance metrics.
- **Auth**: Protected (`USER`)
- **Query Params**: `date`.
- **Response**: `200 OK` with `DailyStatistic`.

---

### Module 13: Files (`/files`)

#### `POST /api/v1/files/upload`
- **Purpose**: Upload file asset (avatar, attachment).
- **Auth**: Protected (`USER`)
- **Response**: `201 Created` with file `id`, `url`, `sizeBytes`.

---

### Module 14: Reports (`/reports`)

#### `GET /api/v1/reports/weekly`
- **Purpose**: Fetch or generate weekly summary performance report.
- **Auth**: Protected (`USER`)
- **Response**: `200 OK` with report payload.

---

## 8. Validation Rules (Zod Schemas)

Request validation MUST occur strictly on the backend using Zod middleware before entering controller logic.

```typescript
// Example Zod Validation Schema for Task Creation
export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(120, "Title too long").trim(),
  description: z.string().max(500).optional(),
  category: z.enum(["nonneg", "habit", "goal"]).default("nonneg"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  duration: z.number().int().positive().default(30),
  goalId: z.string().uuid("Invalid Goal ID format").optional(),
  scheduledTime: z.string().datetime({ offset: true }).optional()
});
```

- **Strings**: Trimmed, length checked.
- **Emails**: Validated against standard RFC email format and lowercased.
- **UUIDs**: Verified via standard RFC 4122 regex.
- **Dates**: Must adhere strictly to ISO 8601 string syntax (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Validation Failures**: Immediately return HTTP `422 Unprocessable Entity` with error details array.

---

## 9. HTTP Status Code Mapping

| Status Code | Meaning | When Used |
| :--- | :--- | :--- |
| `200 OK` | Success | Successful `GET`, `PUT`, `PATCH`, `DELETE` operations |
| `201 Created` | Created | Successful resource creation (`POST`) |
| `204 No Content` | No Content | Successful deletion or empty action response |
| `400 Bad Request` | Bad Request | Malformed JSON syntax or invalid query parameters |
| `401 Unauthorized` | Unauthorized | Missing or expired Bearer JWT token |
| `403 Forbidden` | Forbidden | Insufficient permissions (RBAC role mismatch) |
| `404 Not Found` | Not Found | Requested resource ID does not exist |
| `409 Conflict` | Conflict | Duplicate unique constraint violation (e.g. registered email) |
| `422 Validation Error` | Unprocessable | Request payload failed Zod schema validation rules |
| `429 Too Many Requests`| Rate Limited | Exceeded endpoint rate limit threshold |
| `500 Internal Server Error`| Server Error | Unhandled internal exception (sanitized in production) |

---

## 10. Pagination Specification

Endpoints returning collections support:
- **`page`**: Int (default `1`, 1-indexed)
- **`limit`**: Int (default `20`, max `100`)
- **`sort`**: String (field name, default `createdAt`)
- **`order`**: String (`asc` | `desc`, default `desc`)

**Meta Object Output**:
- `total`: Total records matching filter.
- `page`: Current page number.
- `pages`: Total page count (`Math.ceil(total / limit)`).
- `hasNext`: Boolean (`page < pages`).
- `hasPrevious`: Boolean (`page > 1`).

---

## 11. Filtering Specification

Collection endpoints support optional composable filters via query parameters:
- `status`: e.g. `pending`, `completed`, `active`, `archived`
- `category`: e.g. `nonneg`, `habit`, `goal`, `Career`
- `priority`: e.g. `low`, `medium`, `high`
- `startDate` / `endDate`: ISO 8601 date filters
- `search`: Free text search term matching title or content
- `module`: Filter by domain module (`discipline`, `body`, `mind`, `nutrition`, `goals`)

---

## 12. Sorting Specification

Sorting parameter syntax:
`?sort=priority&order=desc`

Supported sort keys:
- `createdAt`
- `updatedAt`
- `priority`
- `deadline`
- `overallScore`
- `logDate`

---

## 13. Error Codes Catalog

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `TOKEN_EXPIRED` | 401 | Access token expired |
| `FORBIDDEN` | 403 | Insufficient RBAC privileges |
| `RESOURCE_NOT_FOUND` | 404 | Target resource ID not found |
| `USER_EXISTS` | 409 | User email already registered |
| `VALIDATION_ERROR` | 422 | Zod validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Exceeded request quota |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 14. Security Requirements

1. **JWT Validation**: Signature verification using strong RS256 / HS256 secret keys.
2. **RBAC Rules**: Express middleware validates token `role` before reaching protected handlers.
3. **Sanitization**: All HTML / SQL injection vectors sanitized via Zod and parameterized SQL queries.
4. **Audit Logging**: Every mutation emits an entry to `events` table with user identity and timestamp.

---

## 15. Rate Limiting Standards

Implemented via `express-rate-limit`:
- **Auth Routes (`/auth/*`)**: 5 requests / minute per IP.
- **AI Engine (`/ai/*`)**: 30 requests / hour per user.
- **General APIs (`/tasks`, `/body`, etc.)**: 100 requests / minute per user.

---

## 16. API Versioning Strategy

- All endpoints strictly prefixed with `/api/v1/`.
- Minor updates and additive optional fields retain `/v1/`.
- Breaking schema removals will be introduced under `/api/v2/` with a minimum 6-month deprecation grace period.

---

## 17. Documentation Standard

- Master OpenAPI 3.0 file maintained at `backend/swagger.json`.
- Automatically rendered at `http://localhost:3001/api-docs` during local development.

---

## 18. Testing Requirements

Every API endpoint must pass automated testing suites:
1. **Success Tests**: Verify 200/201 HTTP status and envelope output.
2. **Validation Tests**: Verify 422 output when invalid parameters are submitted.
3. **Authentication Tests**: Verify 401 output when token is omitted or malformed.
4. **Authorization Tests**: Verify 403 output when role permissions fail.
5. **Integration Tests**: End-to-end user request pipeline checks.

---

## 19. Success Criteria

The API layer successfully fulfills:
- ✅ Standardized RESTful contracts across all 16 domains.
- ✅ Predictable envelope structure (`{ success, message, data, meta }` / `{ success, error }`).
- ✅ Complete Zod backend validation and HTTP 422 error taxonomy.
- ✅ Secure JWT bearer token authentication and RBAC authorization.
- ✅ OpenAPI 3.0 specification in lockstep with system implementation.
