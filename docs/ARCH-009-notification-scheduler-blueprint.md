# ARCH-009 — Notification & Scheduler Architecture Blueprint

**Document ID:** ARCH-009  
**Title:** Notification & Scheduler Architecture Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing route handler in `backend/src/routes/v1/notifications.ts` returns static mock objects without binding to a background cron engine, BullMQ priority queues, or quiet hour filters. Per mandatory guardrail instructions, frontend UI components, React code, existing database schemas (`ARCH-001`), and API contracts (`ARCH-002`) remain untouched. This blueprint defines the complete backend Notification & Scheduler Architecture specification.

---

## 1. Vision

The Notification System in **DisciplineOS** functions like an intelligent personal assistant—never an annoying alarm clock.

Notifications must strictly be:
- **Timely**: Delivered exactly when relevant to the user's current context.
- **Helpful**: Providing value and actionable next steps.
- **Personalized**: Adapted to individual user habits, goals, and energy levels.
- **Non-Spammy**: Respecting quiet hours and batching non-urgent messages.
- **Actionable**: Directly linked to execution triggers (e.g. *"Log +500ml Water"* or *"Complete 1 task for Elite tier"*).

The **Scheduler Engine** serves as the automated heart of DisciplineOS, powering daily resets, recurring reminders, background analytics, and AI report synthesis.

---

## 2. Core Notification Pipeline Architecture

```
User Action / Event ──► Event Engine ──► Scheduler ──► BullMQ Queues ──► Notification Service ──► Delivery Channels ──► User
                                                            │
                                         ┌──────────────────┼──────────────────┐
                                         ▼                  ▼                  ▼
                                  Reminder Queue        AI Queue         Report Queue
```

---

## 3. Delivery Channels Matrix

### 3.1 Current Supported Channels
- **In-App Drawer**: Real-time notifications rendered in app top navigation (`notifications` table).
- **Web Push Notifications**: Browser push alerts via Web Push API.
- **Transactional Email**: Critical security alerts, weekly summary reports, and account verification.
- **AI Coach Context**: Proactive AI coaching tips delivered inside the AI chat interface.
- **System Badges**: Visual indicator icons on navigation tabs.

### 3.2 Future Channel Roadmap
- SMS alerts (Twilio integration)
- WhatsApp Business API notifications
- Slack Webhook notifications
- Discord Webhook integration

---

## 4. Notification Categories Catalog

| Category | Example Notification | Default Priority |
| :--- | :--- | :--- |
| **Security Alert** | *"New login detected from unrecognized IP address"* | **Critical** |
| **Achievement** | *"🔥 14-Day Streak Protection unlocked!"* | **High** |
| **Level Up** | *"🏆 You reached Level 14: Master Operator!"* | **High** |
| **Goal Reminder** | *"Target deadline for Capstone Milestone is tomorrow"* | **High** |
| **Daily Reminder** | *"Good morning! Your 3 non-negotiables are ready"* | **Normal** |
| **Workout Reminder** | *"Time for today's 45m Strength Training workout"* | **Normal** |
| **Water Reminder** | *"Hydration check: Log +500ml to reach 3.0L target"* | **Normal** |
| **Sleep Reminder** | *"Wind-down alert: Target sleep in 30 minutes"* | **Normal** |
| **Weekly Report** | *"Your Weekly Performance Report (+32 pts) is ready"* | **Low** |
| **AI Insight** | *"Performance is 8% below target. Complete 1 task for Elite"* | **Low** |

---

## 5. End-to-End Notification Lifecycle Pipeline

```
Trigger Event ──► Zod Validation ──► User Preference Check ──► Quiet Hour Check ──► Enqueue Message ──► Delivery Worker ──► Mark Read ──► Archive
```

1. **Trigger**: Event emitted from Event Engine or background scheduler cron.
2. **Validation**: Validate payload structure and recipient user status.
3. **Preference Check**: Verify recipient has enabled the notification category and channel.
4. **Quiet Hour Check**: Check if local user time falls within Quiet Hours (e.g. 22:00–07:00). Non-critical messages are delayed; Critical Security Alerts bypass quiet hours.
5. **Enqueue**: Push notification object to BullMQ execution queue.
6. **Delivery**: Worker attempts delivery over configured channel.
7. **Read & Archive**: Mark status in `notifications` table (`unread` -> `read` -> `archived`).

---

## 6. Background Scheduler Jobs Matrix

Background cron workers execute tasks decoupled from user HTTP requests:

### 6.1 Daily Jobs
- **04:00 AM Daily Reset (`0 4 * * *`)**: Resets daily non-negotiable task completion flags, archives yesterday's score, and initializes the new day.
- **Daily Brief Synthesis (`0 7 * * *`)**: Generates personalized AI daily briefing at 07:00 AM local time.
- **Daily Database Backup (`0 2 * * *`)**: Executes full database backup and WAL archive.
- **Daily Analytics Pre-aggregation (`0 3 * * *`)**: Pre-aggregates `daily_statistics` table records.

### 6.2 Weekly Jobs
- **Weekly Report Generation (`0 8 * * 0`)**: Every Sunday at 08:00 AM, compiles weekly performance trends and AI reviews.

### 6.3 Monthly Jobs
- **Monthly Summary Synthesis (`0 9 1 * *`)**: On the 1st of every month, generates 30-day performance summaries and level progression reports.

---

## 7. Reminder Engine Architecture

The Reminder Engine handles user-customized scheduled alerts:

```
09:00 ──► Study / Deep Work Reminder
13:00 ──► Hydration / Water Check-in
17:30 ──► Physical Workout Reminder
22:00 ──► Nighttime Wind-Down & Sleep Alert
```

- Users configure custom reminder times, days of the week, and preferred delivery channels.
- Timers evaluate user timezone offsets to ensure reminders fire at exact local times.

---

## 8. Proactive AI Notification Generation

Integrated directly with the **AI Context Engine** (`ARCH-006`):
- **Score Drop Alert**: Triggered if daily performance drops by $> 5\%$ compared to 7-day average.
- **Tier Advancement Alert**: Triggered when a user is within 20 points of unlocking the next level tier (e.g., *"Complete 1 task to reach Elite"*).
- **Streak Protection Warning**: Triggered at 20:00 PM if non-negotiable tasks remain uncompleted.

---

## 9. User Preferences & Quiet Hours Configuration

### 9.1 User Notification Preferences
Users manage granular settings in `user_settings`:
- `enabledCategories`: List of active categories (e.g. `["security", "workout", "water", "reports"]`).
- `deliveryChannels`: Channel preferences per category (e.g. `{ "workout": ["inapp", "push"], "security": ["email", "push"] }`).
- `quietHoursStart`: Time string (default `"22:00"`).
- `quietHoursEnd`: Time string (default `"07:00"`).
- `timezone`: User's IANA timezone string (e.g. `"America/New_York"`).

### 9.2 Quiet Hours Enforcement Rules
- **Non-Critical Notifications** (Reminders, Reports, AI Insights): Enqueued and held in buffer until `quietHoursEnd` arrives.
- **Critical Notifications** (Security Alerts, Account Access Warnings): Immediately bypass quiet hours and deliver instantly.

---

## 10. Delivery Priority Cascade

Notifications enter BullMQ priority queues based on urgency:

```
Priority 1: Critical (Security alerts, System outages) ──► Immediate Delivery (Bypasses Quiet Hours & Batching)
Priority 2: High     (Streak warnings, Level up)      ──► Fast Queue (< 10 seconds)
Priority 3: Normal   (Daily reminders, Workout alerts)──► Standard Queue (< 60 seconds)
Priority 4: Low      (Weekly reports, AI tips)        ──► Batch Queue (Delivered in background)
```

---

## 11. Queue Processing & Retry Strategy

Notifications are processed via BullMQ worker threads with exponential backoff:

```
Attempt 1 (Immediate) ──► Fail ──► Attempt 2 (+5s backoff) ──► Fail ──► Attempt 3 (+30s backoff) ──► Fail ──► Mark Status "failed" & Log
```

- Max **3 attempts** per notification.
- Failed notifications move to `failed_notifications` log table for administrative inspection without crashing worker pools.

---

## 12. Independent Background Worker Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Background Worker Fleet                         │
│   • Worker Pool 1: Scheduler Cron & Daily Resets                       │
│   • Worker Pool 2: Notification Queues (BullMQ)                        │
│   • Worker Pool 3: AI Report & Analytics Pre-Aggregations              │
│   • Worker Pool 4: Database Backup & Temp File Cleanup                 │
└────────────────────────────────────────────────────────────────────────┘
```

Workers operate independently from the Express API web server, ensuring heavy report generation or batch emailing never slows down HTTP response times for end users.

---

## 13. Notification Database Storage Model

All in-app notifications are stored in the `notifications` table (`ARCH-001`):

```prisma
model Notification {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  message   String
  type      String    @default("info")
  status    String    @default("unread")
  read      Boolean   @default(false)
  createdAt DateTime  @default(now())
  deletedAt DateTime?

  @@index([userId])
  @@index([userId, read])
}
```

---

## 14. Timezone & Localization Handling

- All scheduled jobs and notification timestamps are computed and stored in **UTC**.
- The Scheduler converts UTC execution times to the user's local timezone (`profile.timezone` / `user_settings.timezone`) when calculating recurring cron triggers (e.g. 07:00 AM local time).

---

## 15. Security & Privacy Guardrails

1. **User Isolation**: Notifications can only be retrieved by the authenticated recipient (`userId === req.userId`).
2. **Lock Screen Privacy**: Push notifications omit sensitive reflection text or private details on lock screen previews.
3. **Unsubscribe Integrity**: Transactional security alerts cannot be disabled, but marketing/reminder channels support 1-click unsubscribe headers.

---

## 16. Monitoring & Observability Metrics

The Notification & Scheduler exporter tracks execution telemetry:
- `notification_delivery_success_total`: Total successfully delivered notifications.
- `notification_delivery_failed_total`: Total failed notifications.
- `notification_queue_depth`: Count of notifications waiting in BullMQ.
- `scheduler_job_execution_latency_ms`: Execution duration of background cron jobs.
- `quiet_hours_buffered_total`: Count of notifications buffered during quiet hours.

---

## 17. Future Integrations Roadmap

The notification architecture supports seamless multi-channel plugin adapters:
- Firebase Cloud Messaging (FCM) for Android push alerts
- Apple Push Notification Service (APNs) for iOS / macOS push alerts
- SendGrid / AWS SES for transactional email delivery
- Calendar integrations (Google Calendar / Apple iCal event injection)
- Smartwatch complication updates (Apple Watch / Wear OS)

---

## 18. Success Criteria

The Notification & Scheduler Architecture successfully fulfills:
- ✅ Timely, personalized, and actionable notification delivery.
- ✅ Decoupled background scheduler cron jobs (Daily 04:00 AM reset, briefs, reports).
- ✅ User-configured Reminder Engine and Quiet Hours enforcement (22:00–07:00 default).
- ✅ Priority delivery cascade and BullMQ 3-attempt exponential backoff retries.
- ✅ Independent background worker fleet decoupled from API web servers.
- ✅ UTC scheduler storage with user local timezone conversion.
