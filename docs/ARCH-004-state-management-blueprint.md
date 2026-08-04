# ARCH-004 — State Management & Data Flow Architecture

**Document ID:** ARCH-004  
**Title:** State Management & Data Flow Architecture  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Highest)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing store file `frontend/src/store/useStore.ts` combines authentication credentials, server entities (`tasks`, `dashboard`, `reflections`), and UI properties (`loading`, `theme`) inside a monolithic Zustand store without query caching or offline queue replay. Per mandatory guardrail instructions, existing UI, components, React code, and backend APIs remain untouched. This blueprint defines the complete state architecture and data flow blueprint for frontend alignment.

---

## 1. Vision

The DisciplineOS frontend possesses **one predictable single source of truth**.

Every piece of application data has a strictly defined owner. Multiple competing states representing the exact same underlying entity are strictly prohibited.

---

## 2. State Philosophy & 5 Tiers

State is strictly categorized into 5 distinct non-overlapping tiers. **Tiers must never be mixed.**

```
┌────────────────────────────────────────────────────────────────────────┐
│                                UI State                                │
│                     (Modals, Tabs, Accordions, Search)                 │
├────────────────────────────────────────────────────────────────────────┤
│                          Local Component State                         │
│                    (Form inputs, Dropdown selections)                  │
├────────────────────────────────────────────────────────────────────────┤
│                         Global Application State                       │
│               (Auth session, Theme, Notifications, Live Session)       │
├────────────────────────────────────────────────────────────────────────┤
│                              Server State                              │
│                (Tasks, Goals, Meals, Body Logs, Mind Logs)             │
├────────────────────────────────────────────────────────────────────────┤
│                             Derived State                              │
│              (Calculated Completion %, Streaks, Macro Totals)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Predictable Data Flow Architecture

```
User Action ──► Component ──► Store Action ──► API Request ──► Backend ──► Response ──► Store Update ──► Automatic UI Refresh
```

Components **NEVER** modify server or backend data directly. All state transitions flow through defined store actions or query hooks.

---

## 4. State Category Definitions

### 4.1 UI State (Ephemeral)
Temporary interface display properties. **Never persisted to local database or backend.**
- Examples: Modal open/closed, Active tab index, Accordion expanded state, Search input text, Selected sidebar item.

### 4.2 Local Component State
Isolated state scoped to a single React component instance.
- Examples: Uncommitted form input fields, hover states, checkbox draft selections.
- Rule: Do NOT move local component state into global stores unless shared across pages.

### 4.3 Global Application State
Cross-cutting state required by multiple independent pages and components.
- Examples: Authenticated user profile, JWT access token, App theme token (`dark` | `light`), Notification unread count, Active focus session timer.

### 4.4 Server State (Cached API Data)
Entities originating from backend database endpoints (`/api/v1/*`).
- Examples: Task lists, Habit trackers, Meals & Macro logs, Body metric entries, Goal & Milestone hierarchies, Performance score snapshots.
- Rule: Server state must be managed via dedicated server-state caching hooks with defined stale-time policies.

### 4.5 Derived State (Computed)
Values dynamically computed from existing state. **Never stored independently.**
- Examples: Task completion percentage (`completedTasks / totalTasks`), Today's remaining calorie budget, Active streak length, Weekly score average.

---

## 5. Store Architecture & Boundaries

```
frontend/src/
├── stores/                      # Global App Stores (Zustand)
│   ├── authStore.ts             # Auth session & JWT token
│   ├── userStore.ts             # Active user profile
│   ├── uiStore.ts               # Theme, sidebar, global modals
│   ├── performanceStore.ts      # Current score KPI & levels
│   ├── notificationStore.ts     # Unread count & drawer state
│   ├── sessionStore.ts          # Active timer focus session
│   └── settingsStore.ts         # User preferences & reset time
│
└── hooks/                       # Server State Hooks (TanStack Query / Cache)
    ├── useTasks.ts              # Discipline tasks & habits
    ├── useGoals.ts              # Goals & milestones
    ├── useBody.ts               # Body logs, steps, sleep, workouts
    ├── useMind.ts               # Mind logs, journals, meditation
    ├── useNutrition.ts          # Meals, macros, water logs
    └── useAnalytics.ts          # Daily/weekly statistics & timeline
```

---

## 6. Module Data Ownership Matrix

Each domain module strictly owns its respective data boundaries:

| Module Domain | Owned Entities | Consumed By |
| :--- | :--- | :--- |
| **Discipline** | Tasks, Habits, Focus Sessions, Task History | Performance Engine, Overview Dashboard, AI Context |
| **Body** | Body Logs, Workouts, Steps, Sleep, Weight Logs | Performance Engine, Overview Dashboard, AI Context |
| **Mind** | Mind Logs, Journals, Meditation Sessions | Performance Engine, Overview Dashboard, AI Context |
| **Nutrition** | Meals, Macros, Water Logs | Performance Engine, Overview Dashboard, AI Context |
| **Goals** | Goals, Milestones, Goal History | Performance Engine, Overview Dashboard, Discipline |

Other modules consume data through read-only selectors or API query responses, never by mutating another domain's store directly.

---

## 7. Single Source of Truth Principle

```
Backend DB ──► API Response ──► Server State Cache (React Query) ──► Selector ──► UI Component
```

- Editable duplicate copies of server state inside local component state are forbidden.
- Updates mutate the primary cache via defined store actions.

---

## 8. Server State Cache Strategy

| Cache Key Namespace | Stale Time | Cache Time (gcTime) | Refetch Strategy |
| :--- | :--- | :--- | :--- |
| `["tasks"]` | 5 minutes | 30 minutes | On window focus & network reconnect |
| `["performance"]` | 1 minute | 15 minutes | On event trigger or task completion |
| `["goals"]` | 10 minutes | 60 minutes | On mutation |
| `["bodyLogs"]` | 5 minutes | 30 minutes | On date change or log POST |
| `["mindLogs"]` | 5 minutes | 30 minutes | On log POST |
| `["nutrition"]` | 5 minutes | 30 minutes | On meal/water log POST |
| `["analytics"]` | 15 minutes | 60 minutes | Background refetch on tab mount |
| `["notifications"]` | 30 seconds | 10 minutes | Polling / WebSocket trigger |

---

## 9. Query Invalidation Cascade Matrix

When a domain action occurs, affected query caches are selectively invalidated to trigger automatic UI updates:

```
User Action: Complete Task
    │
    ├──► Invalidate ["tasks"]
    ├──► Invalidate ["performance"]
    ├──► Invalidate ["dashboard"]
    ├──► Invalidate ["analytics"]
    └──► Invalidate ["timeline"]
```

- **`WORKOUT_COMPLETED`**: Invalidates `["bodyLogs"]`, `["performance"]`, `["dashboard"]`, `["timeline"]`.
- **`MEAL_LOGGED`**: Invalidates `["nutrition"]`, `["performance"]`, `["dashboard"]`.
- **`GOAL_COMPLETED`**: Invalidates `["goals"]`, `["performance"]`, `["tasks"]`, `["timeline"]`.

---

## 10. Optimistic Updates & Rollback Pipeline

To ensure sub-50ms instant UI responses:

```
User Clicks "Complete Task"
   │
   ├── 1. Cancel outgoing queries for ["tasks"]
   ├── 2. Snapshot current cache state (rollbackStack)
   ├── 3. Immediately mutate local cache (UI shows checked state instantly)
   ├── 4. Send asynchronous HTTP PATCH to /api/v1/tasks/:id/complete
   │
   ├──► Success ──► Invalidate & sync with true server payload
   └──► Failure ──► Restore snapshot from rollbackStack + Display Error Toast
```

---

## 11. Live Session State Persistence

The active focus session timer state (`sessionStore`) MUST survive:
- Full browser page refresh (`F5`)
- Route navigation changes
- Component re-renders

**Implementation**: State serialized to `localStorage` key `dos_active_session` on state change, rehydrated immediately upon app startup.

---

## 12. Real-Time Synchronization Protocol

```
Server WebSocket Event (e.g. TASK_COMPLETED)
   │
   ▼
Event Engine Listener
   │
   ▼
Extract Module & Target Query Key
   │
   ▼
Invalidate Target Cache Entry (e.g. queryClient.invalidateQueries(["tasks"]))
   │
   ▼
UI Components Re-render Automatically
```

---

## 13. Offline Queue & Replay Buffer

When network disconnect is detected (`navigator.onLine === false`):

```
User Action Offline ──► Push to IndexedDB Offline Queue (dos_offline_queue)
                               │
            Network Reconnected (online event)
                               │
                               ▼
        Process Queue sequentially (FIFO execution)
                               │
            Sync Backend & Refresh Query Cache
```

Zero user actions are lost due to transient network drops.

---

## 14. Error Recovery Strategy

When an API mutation fails:
1. Automatically revert optimistic UI changes using the stored snapshot.
2. Display a clear contextual toast notification.
3. Provide a one-click "Retry Action" button.
4. Log error details to monitoring analytics.

---

## 15. Loading Strategy & Granular Flags

Global monolithic loading flags (`loading: true`) are prohibited. Features expose granular flags:
- `isLoading`: Initial fetch in progress (render skeleton UI).
- `isFetching`: Background refetch in progress (render subtle spinner).
- `isUpdating`: Existing entity mutation in progress.
- `isSubmitting`: Form submit action in progress.
- `isSyncing`: Offline queue synchronization in progress.

---

## 16. Store Communication Rules

Stores MUST NOT invoke each other's state mutation functions directly.

```
Store A ──► Emits Event / API Action ──► Listener / Query Invalidation ──► Store B
```

Direct cross-store imports create circular dependencies and tight coupling.

---

## 17. Memory Management & Garbage Collection

- Automatic eviction of inactive query caches after `gcTime` (default 30 minutes).
- Active event listeners and WebSocket channels disposed in `useEffect` cleanup handlers.
- Search query inputs debounced (300ms) to prevent memory allocations from rapid keystrokes.

---

## 18. Component Rules & Separation of Concerns

React UI components MUST ONLY:
1. Read state via hooks or selectors (`const tasks = useTasks()`).
2. Dispatch defined store actions or mutations (`completeTask(id)`).
3. Render visual HTML/JSX interface.

React UI components MUST NOT:
- Contain core business calculation logic.
- Execute direct `fetch` / `axios` database calls.
- Manage cross-module state transformations.

---

## 19. Performance Guidelines

- **Memoized Selectors**: Use `useCallback` and Zustand shallow equality checks to prevent re-renders of non-changed properties.
- **Virtualization**: Long timelines or task lists (> 50 items) virtualized via `@tanstack/react-virtual`.
- **Store Splitting**: Modular store files per domain instead of one monolithic global store.

---

## 20. Client-Side Security Guidelines

The following sensitive data items MUST NEVER be stored in client state or `localStorage`:
- Plaintext user passwords
- API secret keys or private OAuth keys
- AI API provider keys (Gemini / OpenAI secrets remain backend-only)
- JWT Refresh Tokens (stored exclusively in HTTP-Only SameSite Cookies)

---

## 21. Future Scalability Plan

The state architecture seamlessly supports future expansions:
- Multi-device real-time sync via WebSocket event bus
- Offline-first PWA / Mobile app rehydration
- Live collaboration & AI streaming text updates

---

## 22. Success Criteria

The State Management Architecture successfully fulfills:
- ✅ Single source of truth across all 16 domains.
- ✅ Strict 5-tier state separation (UI, Local, Global, Server, Derived).
- ✅ Sub-50ms instant UI responses via optimistic updates and rollback stacks.
- ✅ Resilient offline queue replay and live session persistence.
- ✅ Decoupled store boundaries and server caching stale-time policies.
