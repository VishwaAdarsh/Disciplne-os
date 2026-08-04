# ARCH-003 — Event Contracts & Event Payload Specification

**Document ID:** ARCH-003  
**Title:** Event Contracts & Event Payload Specification  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Critical)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing backend mock route in `backend/src/routes/v1/events.ts` accepts `eventType` fields without top-level `eventVersion` or `metadata` envelope wrappers. Per mandatory guardrail instructions, frontend UI components, React hooks, API handlers, and database schemas (`ARCH-001`) remain untouched. This blueprint provides the complete event system specification and payload contract for system-wide alignment.

---

## 1. Vision

The Event System is the decoupled communication backbone of **DisciplineOS**.

No module communicates directly with another module. Instead, modules emit immutable facts to an Event Bus, which routes events to asynchronous subscribers:

```
Module ──► Event ──► Event Bus ──► Subscribers ──► Updated Modules
```

This decoupled architecture guarantees:
- **Scalability**: Modules scale independently without synchronous lock-in.
- **Maintainability**: New modules or subscribers subscribe to event streams without mutating existing module code.
- **Auditability**: Complete historical record of every user action and score transition.

---

## 2. Core Event Principles

Every event in DisciplineOS MUST strictly be:
1. **Immutable**: Events are historical facts that can never be altered or deleted once emitted.
2. **Timestamped**: Standard ISO 8601 UTC timestamp recorded at creation (`timestamp`).
3. **Versioned**: Schema versions tracked via `eventVersion` (integer, starting at `1`).
4. **Authenticated**: Bound strictly to an authenticated user ID (`userId`).
5. **Traceable**: Unique RFC 4122 v4 UUID (`eventId`) for tracing across queue pipelines.
6. **Idempotent**: Safe to re-process multiple times without creating duplicate side effects.
7. **Replay-safe**: Event streams can be re-played sequentially to reconstruct historical system state.
8. **Facts, Not Commands**: Events represent actions that *have already occurred* (`TASK_COMPLETED`), never imperative operations (`UPDATE_SCORE`).

```
✔ TASK_COMPLETED
❌ UPDATE_SCORE
```

---

## 3. Event Naming Convention

All event names MUST use strict **`UPPERCASE_SNAKE_CASE`** prefixed by module noun context where applicable:

- **Discipline**: `TASK_CREATED`, `TASK_UPDATED`, `TASK_COMPLETED`, `TASK_SKIPPED`, `TASK_DELETED`, `FOCUS_SESSION_STARTED`, `FOCUS_SESSION_PAUSED`, `FOCUS_SESSION_RESUMED`, `FOCUS_SESSION_COMPLETED`
- **Body**: `WORKOUT_STARTED`, `WORKOUT_COMPLETED`, `STEPS_UPDATED`, `SLEEP_RECORDED`, `WEIGHT_UPDATED`, `WATER_LOGGED`
- **Mind**: `MOOD_LOGGED`, `FOCUS_UPDATED`, `ENERGY_UPDATED`, `STRESS_UPDATED`, `JOURNAL_CREATED`, `MEDITATION_STARTED`, `MEDITATION_COMPLETED`
- **Nutrition**: `MEAL_LOGGED`, `MEAL_UPDATED`, `MEAL_DELETED`, `WATER_LOGGED`, `NUTRITION_GOAL_COMPLETED`
- **Goals**: `GOAL_CREATED`, `GOAL_UPDATED`, `GOAL_COMPLETED`, `GOAL_PAUSED`, `GOAL_ARCHIVED`, `MILESTONE_CREATED`, `MILESTONE_COMPLETED`
- **Performance**: `PERFORMANCE_UPDATED`, `LEVEL_UP`, `XP_GAINED`, `ACHIEVEMENT_UNLOCKED`

---

## 4. Standard Top-Level Event Structure

Every event MUST adhere strictly to the top-level envelope schema below. **No event may alter this structure.**

```json
{
  "eventId": "c1f7b8a0-7d43-4e89-9a1b-123456789abc",
  "eventName": "TASK_COMPLETED",
  "eventVersion": 1,
  "userId": "u9f8e7d6-5c4b-3a21-0000-112233445566",
  "module": "discipline",
  "timestamp": "2026-08-04T10:47:00.000Z",
  "payload": {
    "taskId": "t1a2b3c4-5555-6666-7777-888899990000",
    "title": "Morning Cold Shower & Hydration",
    "category": "nonneg",
    "streak": 15,
    "xpEarned": 20,
    "completedAt": "2026-08-04T10:47:00.000Z"
  },
  "metadata": {
    "source": "user",
    "clientVersion": "1.0.0",
    "correlationId": "corr_9988776655",
    "ipAddress": "127.0.0.1"
  }
}
```

---

## 5. Event Producers Matrix

Only backend domain engine services emit events. **UI components NEVER emit business events directly.**

| Producer Engine | Emitted Event Types |
| :--- | :--- |
| **Discipline Engine** | `TASK_CREATED`, `TASK_UPDATED`, `TASK_COMPLETED`, `TASK_SKIPPED`, `TASK_DELETED`, `FOCUS_SESSION_STARTED`, `FOCUS_SESSION_PAUSED`, `FOCUS_SESSION_RESUMED`, `FOCUS_SESSION_COMPLETED` |
| **Body Engine** | `WORKOUT_STARTED`, `WORKOUT_COMPLETED`, `STEPS_UPDATED`, `SLEEP_RECORDED`, `WEIGHT_UPDATED`, `WATER_LOGGED` |
| **Mind Engine** | `MOOD_LOGGED`, `FOCUS_UPDATED`, `ENERGY_UPDATED`, `STRESS_UPDATED`, `JOURNAL_CREATED`, `MEDITATION_STARTED`, `MEDITATION_COMPLETED` |
| **Nutrition Engine** | `MEAL_LOGGED`, `MEAL_UPDATED`, `MEAL_DELETED`, `WATER_LOGGED`, `NUTRITION_GOAL_COMPLETED` |
| **Goals Engine** | `GOAL_CREATED`, `GOAL_UPDATED`, `GOAL_COMPLETED`, `GOAL_PAUSED`, `GOAL_ARCHIVED`, `MILESTONE_CREATED`, `MILESTONE_COMPLETED` |
| **Auth Engine** | `USER_REGISTERED`, `USER_LOGGED_IN`, `PASSWORD_RESET` |
| **AI Coach Engine** | `AI_INSIGHT_GENERATED`, `AI_REPORT_GENERATED` |
| **System Scheduler** | `DAILY_RESET_TRIGGERED`, `WEEKLY_SNAPSHOT_CALCULATED` |

---

## 6. Event Consumers Matrix

Subscribers consume event streams asynchronously and independently:

| Subscriber Consumer | Subscribed Events | Action / Outcome |
| :--- | :--- | :--- |
| **Performance Engine** | `TASK_COMPLETED`, `WORKOUT_COMPLETED`, `MOOD_LOGGED`, `MEAL_LOGGED`, `MILESTONE_COMPLETED` | Recalculate 0-1000 daily performance score snapshot |
| **Overview Dashboard** | All events | Push real-time SSE / WebSocket state updates |
| **Notification Engine**| `LEVEL_UP`, `ACHIEVEMENT_UNLOCKED`, `TASK_SKIPPED`, `GOAL_COMPLETED` | Dispatch push notifications and in-app alerts |
| **Analytics Engine** | All events | Update `daily_statistics`, `weekly_statistics`, `monthly_statistics` |
| **AI Context Engine** | `TASK_COMPLETED`, `JOURNAL_CREATED`, `WORKOUT_COMPLETED`, `MOOD_LOGGED` | Append historical context vector memory for AI prompt engineering |
| **Activity Timeline** | All events | Append immutable user timeline log item |
| **Achievement Engine**| `TASK_COMPLETED`, `WORKOUT_COMPLETED`, `FOCUS_SESSION_COMPLETED` | Evaluate gamification unlock criteria & emit `ACHIEVEMENT_UNLOCKED` |

---

## 7. Domain Payload Specifications

### 7.1 Discipline Domain Payloads

#### `TASK_COMPLETED`
```json
{
  "taskId": "UUID",
  "goalId": "UUID | null",
  "title": "String",
  "category": "nonneg | habit | goal",
  "priority": "low | medium | high",
  "streak": "Number",
  "xpEarned": "Number",
  "completedAt": "ISO-8601"
}
```

#### `FOCUS_SESSION_COMPLETED`
```json
{
  "sessionId": "UUID",
  "taskId": "UUID | null",
  "sessionName": "String",
  "targetMinutes": "Number",
  "elapsedSecs": "Number",
  "pauses": "Number",
  "completedAt": "ISO-8601"
}
```

---

### 7.2 Body Domain Payloads

#### `WORKOUT_COMPLETED`
```json
{
  "workoutId": "UUID",
  "workoutType": "String",
  "durationMinutes": "Number",
  "intensity": "low | medium | high",
  "caloriesBurned": "Number",
  "logDate": "YYYY-MM-DD"
}
```

#### `WATER_LOGGED`
```json
{
  "logId": "UUID",
  "amountLiters": "Number",
  "dailyTotalLiters": "Number",
  "targetLiters": "Number",
  "loggedAt": "ISO-8601"
}
```

---

### 7.3 Mind Domain Payloads

#### `MOOD_LOGGED`
```json
{
  "logId": "UUID",
  "moodLabel": "String",
  "focusRating": "Number (1-10)",
  "energyRating": "Number (1-10)",
  "stressRating": "Number (1-10)",
  "logDate": "YYYY-MM-DD"
}
```

#### `JOURNAL_CREATED`
```json
{
  "journalId": "UUID",
  "title": "String",
  "moodTag": "String",
  "wordCount": "Number",
  "createdAt": "ISO-8601"
}
```

---

### 7.4 Nutrition Domain Payloads

#### `MEAL_LOGGED`
```json
{
  "mealId": "UUID",
  "mealName": "String",
  "mealType": "Breakfast | Lunch | Dinner | Snack",
  "calories": "Number",
  "proteinGrams": "Number",
  "carbsGrams": "Number",
  "fatGrams": "Number",
  "logDate": "YYYY-MM-DD"
}
```

---

### 7.5 Goals Domain Payloads

#### `GOAL_COMPLETED`
```json
{
  "goalId": "UUID",
  "title": "String",
  "category": "String",
  "totalMilestones": "Number",
  "completedAt": "ISO-8601"
}
```

#### `MILESTONE_COMPLETED`
```json
{
  "milestoneId": "UUID",
  "goalId": "UUID",
  "title": "String",
  "progressPercent": "Number",
  "completedAt": "ISO-8601"
}
```

---

### 7.6 Performance Domain Payloads

#### `PERFORMANCE_UPDATED`
```json
{
  "snapshotId": "UUID",
  "overallScore": "Number (0-1000)",
  "disciplineScore": "Number",
  "bodyScore": "Number",
  "mindScore": "Number",
  "nutritionScore": "Number",
  "goalsScore": "Number",
  "level": "Number",
  "xp": "Number",
  "snapshotDate": "YYYY-MM-DD"
}
```

#### `LEVEL_UP`
```json
{
  "userId": "UUID",
  "oldLevel": "Number",
  "newLevel": "Number",
  "newTitle": "String",
  "totalXp": "Number",
  "unlockedAt": "ISO-8601"
}
```

#### `ACHIEVEMENT_UNLOCKED`
```json
{
  "achievementId": "UUID",
  "achievementKey": "String",
  "title": "String",
  "description": "String",
  "icon": "String",
  "unlockedAt": "ISO-8601"
}
```

---

## 8. Event Lifecycle Pipeline Architecture

```
User Action ──► Zod Validation ──► Emit Event ──► Persist DB (events) ──► Publish Bus (Redis/BullMQ)
                                                                                  │
     ┌────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┐
     ▼                                             ▼                                          ▼                                          ▼
Performance Consumer                          Analytics Consumer                         Notification Consumer                        AI Context Consumer
(Recalculate Scores)                        (Update Aggregations)                       (Dispatch Alerts)                            (Vector Memory)
```

---

## 9. Event Queue Architecture & User-Scoped FIFO Ordering

- **Queue Engine**: Redis Streams / BullMQ instance.
- **Partitioning Strategy**: Partitioned by `userId` to preserve strict sequential order per user.
- **Ordering Guarantees**: Events for a single user are processed strictly in FIFO sequence (`TASK_CREATED` -> `TASK_UPDATED` -> `TASK_COMPLETED`).
- **Concurrency**: Parallel queue workers process different `userId` partitions concurrently without cross-user lock contention.

---

## 10. Idempotency & Deduplication Strategy

1. Every event has a unique `eventId` (UUID).
2. Consumers store processed `eventId` keys in Redis with a 7-day TTL (`processed_events:<eventId>`).
3. Before processing, consumers run `SETNX processed_events:<eventId> 1`. If the key exists, the consumer skips processing immediately.
4. Ensures duplicate publishes or retries produce zero side effects.

---

## 11. Retry Policy & Dead-Letter Queue (DLQ)

If a subscriber processing handler fails:

```
Attempt 1 (Immediate) ──► Attempt 2 (+2s backoff) ──► Attempt 3 (+10s backoff) ──► Move to DLQ (dead_letter_events)
```

- **Exponential Backoff**: `2^attempt * 1000ms`.
- **Dead-Letter Queue**: Events failing after 3 attempts are isolated in `dead_letter_events` for manual investigation without blocking the main event queue.

---

## 12. Event Versioning Strategy

- Every payload schema includes `eventVersion` (integer, e.g. `1`).
- Non-breaking changes (adding optional fields) retain the existing `eventVersion`.
- Breaking changes (field rename or structural mutation) increment to `eventVersion: 2`.
- Consumers maintain backwards-compatibility handlers for older versions.

---

## 13. Audit Logging & Compliance

- Every emitted event is written immutably to the `events` database table (`ARCH-001`).
- Preserves processing metadata (`consumerResults`, `executionTimeMs`, `status`).
- Fulfills security audit logging requirements and full user timeline history.

---

## 14. Security Guidelines

1. **Authentication**: Events are instantiated strictly on backend services using verified JWT `userId`.
2. **Client Injection Guard**: Frontend clients cannot inject raw events into the bus; events are generated server-side upon validated API endpoints.
3. **Payload Sanitization**: Payloads sanitized against script/SQL injection vectors.

---

## 15. Performance Requirements

| Performance Metric | Threshold Limit |
| :--- | :--- |
| **Event Creation & DB Ingestion** | `< 50 ms` |
| **Queue Dispatch & Processing** | `< 100 ms` |
| **Real-time Dashboard Refresh** | `< 500 ms` |
| **Activity Timeline Update** | `< 500 ms` |

---

## 16. Monitoring & Observability Metrics

The event bus exporter tracks real-time metrics:
- **Event Throughput**: `events_emitted_per_second`
- **Failure Rate**: `event_processing_failure_total`
- **Queue Depth**: `queue_backlog_count`
- **Retry Count**: `event_retry_attempts_total`
- **DLQ Count**: `dead_letter_queue_total`
- **Consumer Latency**: `consumer_processing_duration_ms`

---

## 17. Success Criteria

The Event System successfully fulfills:
- ✅ Immutable facts-not-commands design across all 16 domains.
- ✅ Standard top-level schema (`eventId`, `eventName`, `eventVersion`, `userId`, `module`, `timestamp`, `payload`, `metadata`).
- ✅ User-partitioned FIFO queue ordering and deduplication idempotency.
- ✅ Exponential backoff retries with Dead-Letter Queue isolation.
- ✅ Full subscriber decoupling (Performance Engine, Dashboard, Notifications, Analytics, AI Context).
