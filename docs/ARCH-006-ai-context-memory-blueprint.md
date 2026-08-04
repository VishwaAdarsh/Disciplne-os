# ARCH-006 — AI Context & Memory Architecture Blueprint

**Document ID:** ARCH-006  
**Title:** AI Context & Memory Architecture Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Critical)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Existing backend route handler in `backend/src/routes/v1/ai.ts` generates static response strings without passing requests through a backend Context Engine pipeline or enforcing token size caps (e.g. max 20 tasks, max 50 events). Per mandatory guardrail instructions, frontend UI components, React code, and existing API contracts remain untouched. This blueprint defines the complete backend AI context assembly and memory specification.

---

## 1. Vision

The AI Engine in DisciplineOS **never receives an unfiltered database dump**.

Instead, DisciplineOS constructs a compressed, prioritized, and privacy-sanitized **Context Package** before issuing any query to an LLM provider:

```
User Telemetry Data ──► Context Engine ──► Prompt Builder ──► LLM Provider ──► Response Validator ──► User Response
```

The Context Engine decides strictly what information is relevant to the user's immediate request or coaching domain.

---

## 2. AI Philosophy & Personas

The AI in DisciplineOS is an active, evidence-based performance assistant operating across 6 specialized personas:

1. **Performance Coach**: Analyzes daily execution quality, overall index (0–1000), and consistency gaps.
2. **Planning Assistant**: Helps schedule non-negotiables, balance workload, and structure deep work focus sessions.
3. **Analytics Explainer**: Interprets complex trend lines, category tradeoffs, and historical progress metrics.
4. **Habit Mentor**: Recommends habit frequency adjustments and streak maintenance strategies.
5. **Goal Strategist**: Deconstructs strategic goals into actionable sub-deliverable milestones.
6. **Reflection Assistant**: Synthesizes journal reflections to identify obstacles and emotional energy patterns.

> **Fundamental Invariant**: The AI NEVER invents, guesses, or hallucinates user data. If telemetry is missing, it explicitly states so.

---

## 3. End-to-End AI Architecture Pipeline

```
USER REQUEST
     │
     ▼
Performance Engine ──► Extract Current Scores & Streaks
     │
     ▼
Context Engine ──────► Query & Filter Authorized Data Sources (Apply Hard Token Limits)
     │
     ▼
Prompt Builder ──────► Assemble System Prompt + User Context + Request
     │
     ▼
LLM Provider ────────► Send Request to Gemini / OpenAI / Claude API
     │
     ▼
Response Validator ──► Verify Output Format & Ensure No Data Hallucination
     │
     ▼
DELIVER RESPONSE TO USER
```

---

## 4. Authorized Context Data Sources Matrix

The AI Context Engine is strictly restricted to pulling from these 15 authorized data sources:

1. **Current User Profile** (Name, timezone, targets)
2. **Current Performance Score** (Overall 0–1000 score)
3. **Category Sub-Scores** (Discipline, Body, Mind, Nutrition, Goals)
4. **Active Strategic Goals & Milestones**
5. **Today's Scheduled Tasks & Habits**
6. **Recent Event Logs** (`events` table)
7. **Current & Best Streaks**
8. **Cumulative XP & Level Metadata**
9. **Mood & Energy Summary** (`mind_logs`)
10. **Nutrition & Macro Summary** (`meals`, `water_logs`)
11. **Workout & Physical Telemetry** (`body_logs`, `workouts`)
12. **Weekly Reflection Summaries** (`reflections`)
13. **Monthly Performance Reports** (`ai_reports`)
14. **User Preference Settings** (`user_settings`)
15. **Active Focus Session Timer State**

*No raw application code, private database keys, or unauthorized system secrets may enter the Context Package.*

---

## 5. Context Builder & Compression Pipeline

Before every LLM API call:

```
Collect Telemetry Data ──► Filter Irrelevant Keys ──► Compress Text ──► Prioritize Tiers ──► Construct Prompt
```

1. **Collect**: Query relevant user data sources.
2. **Filter**: Remove raw database internal fields (e.g. `passwordHash`, internal foreign keys).
3. **Compress**: Summarize text blocks (e.g. journal entries) into key bullet themes.
4. **Prioritize**: Apply the 5-tier context priority cascade.
5. **Build**: Inject into the standardized prompt template.

---

## 6. Context Priority Cascade

When building a context package within token budget constraints, higher priority tiers displace lower priority tiers:

```
Priority 1: Current Session & Active Request  (HIGHEST)
     │
Priority 2: Today's Telemetry & Task Status
     │
Priority 3: Current Week Trends & Goals
     │
Priority 4: Long-Term Performance Trends
     │
Priority 5: Historical Archive Records       (LOWEST)
```

---

## 7. Context Size Hard Limits & Token Budgeting

To maintain fast sub-second latency and optimize LLM token usage, the Context Engine enforces strict bounds:

| Data Type | Hard Maximum Limit | Time Window |
| :--- | :--- | :--- |
| **Recent Tasks** | Max **20 tasks** | Current Day |
| **Recent Events** | Max **50 events** | Last 48 Hours |
| **Journal Summaries** | Max **30 days** pre-summarized text | Last 30 Days |
| **Performance Scores** | Max **90 days** score snapshots | Last 90 Days |
| **Active Goals** | Max **10 goals** | Active status |

---

## 8. 3-Tier Memory Architecture Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                             Session Memory                             │
│       (In-memory, active conversation thread, discarded on close)      │
├────────────────────────────────────────────────────────────────────────┤
│                        User Preference Memory                          │
│     (Persistent: preferred workout time, coaching tone, targets)       │
├────────────────────────────────────────────────────────────────────────┤
│                           Performance Memory                           │
│     (Long-term patterns: best study hours, peak energy days, trends)   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Session Memory**: Conversational history within current chat drawer session. Expired when user closes chat or starts a new topic.
2. **User Preference Memory**: Persistent preferences explicitly confirmed by user (e.g. *"I prefer concise coaching suggestions"* or *"My core workout time is 07:00 AM"*). User-editable and clearable at any time.
3. **Performance Memory**: Automated pattern extraction over 30+ days (e.g. *"User achieves 30% higher completion when deep work starts before 10 AM"*).

---

## 9. Structured Prompt Construction Specification

Every prompt generated by the backend MUST follow this 5-stage structure:

```markdown
[STAGE 1: SYSTEM INSTRUCTIONS & PERSONA]
You are DisciplineOS AI Coach, an evidence-based performance assistant. Provide concise, actionable, and non-judgmental guidance based strictly on the user context below.

[STAGE 2: USER PROFILE & PREFERENCE MEMORY]
User Name: Adarsh | Timezone: Asia/Kolkata | Level: 14 (Master Operator) | Tone: Direct & Actionable

[STAGE 3: CURRENT PERFORMANCE TELEMETRY & RELEVANT STATISTICS]
Overall Score: 782/1000 (Performer) | Streak: 12 Days | XP: 14,200
Module Breakdown: Discipline: 82/100 | Goals: 84/100 | Body: 78/100 | Mind: 82/100 | Nutrition: 81/100
Today's Tasks (3/5 Complete): [x] Morning Cold Shower [x] Deep Work Block 1 [ ] Workout [ ] 3.0L Water

[STAGE 4: USER CURRENT REQUEST]
"How can I optimize my remaining day to cross 800 overall performance score?"

[STAGE 5: OUTPUT FORMATTING RULES]
Provide 3 bullet-point action steps strictly linked to the user's pending tasks. Max 150 words.
```

---

## 10. Recommendation Context & Personalization Matrix

The AI recommendation engine considers 6 dynamic contextual inputs when suggesting actions:
1. **Pending Tasks**: What remains incomplete today?
2. **Time of Day**: Is it morning (focus time), afternoon (execution), or evening (recovery/reflection)?
3. **Energy Level**: Current reported energy rating in `mind_logs`.
4. **Current Goals**: Alignment with active strategic goals.
5. **Performance Trend**: Is the daily change positive (`+18`) or dropping?
6. **Recent Activity**: What event occurred in the last 60 minutes?

---

## 11. Privacy & Reflection Pre-Summarization Protocol

Full daily journal entries MUST NEVER be injected as raw text into LLM prompts. 

Before entry into the Context Package, journal text passes through a local backend summarizer:

```
Raw Journal Entry ("Felt exhausted today during coding block due to poor sleep...")
                         │
                         ▼
        Backend Pre-Summarizer Component
                         │
                         ▼
Structured Reflection Summary:
• Main Theme: Deep work fatigue
• Obstacle: Sub-optimal sleep (5.5 hrs)
• Emotional Trend: Determined but tired
```

This protects personal privacy while dramatically reducing token consumption.

---

## 12. AI Response Rules & Safety Boundaries

### 12.1 Mandatory Quality Rules
- Responses MUST be **personalized**, **evidence-based**, **actionable**, **concise**, and **non-judgmental**.
- Explanations MUST cite specific user data points (e.g. *"Your body score is at 78 due to logging 0.0L water so far today"*).

### 12.2 Strict Safety Invariants
- ❌ **NO Task Hallucination**: AI must never invent completed tasks or claim an unrecorded task was done.
- ❌ **NO Data Guessing**: AI must never guess unrecorded metrics (e.g. guessing weight or sleep if unlogged).
- ❌ **NO Score Manipulation**: AI cannot alter performance scores directly; scores are calculated exclusively by the backend Performance Engine.
- ❌ **NO Database Write Access**: AI outputs recommendations only. All database state changes occur through validated user API calls.

---

## 13. Memory Lifecycle & Expiration Protocol

```
User Action / Event ──► Memory Evaluator ──► Write to Memory Layer ──► Update Pattern Index ──► Expire (TTL) ──► Delete
```

- **Session Memory**: TTL = End of chat session / 2 hours idle.
- **User Preference Memory**: Persistent until explicitly modified or cleared by user.
- **Performance Memory**: Rolling 90-day window; older telemetry automatically purged.
- **User Control**: Users can click *"Clear AI Memory"* in Settings at any time to purge stored preference/performance memory.

---

## 14. Automatic Context Refresh Triggers

The Context Package automatically invalidates and refreshes upon receiving these event triggers (`ARCH-003`):
- `TASK_COMPLETED` / `TASK_SKIPPED`
- `GOAL_UPDATED` / `MILESTONE_COMPLETED`
- `WORKOUT_COMPLETED`
- `MOOD_LOGGED` / `JOURNAL_CREATED`
- `MEAL_LOGGED` / `WATER_LOGGED`
- `PERFORMANCE_UPDATED`

---

## 15. User Privacy Controls & Consent Settings

Settings interface options allow users to toggle:
- `includeJournalsInAI`: Boolean (default `false` — requires explicit consent).
- `allowPerformanceMemory`: Boolean (default `true`).
- `allowAIPersonalization`: Boolean (default `true`).
- `clearAIMemory()`: Action to purge all AI-stored preference memory.

---

## 16. AI Report Data Synthesis Specification

The Context Engine prepares pre-aggregated summary packages for specialized AI reports:
- **Daily Brief**: Today's priorities, streak alert, top 3 recommendations.
- **Weekly Review**: 7-day score trend, strongest/weakest category, goal progress.
- **Monthly Report**: Level progression, 30-day consistency score, long-term habit strength.

---

## 17. Multi-Provider LLM Abstraction Layer

The Context Engine architecture is decoupled from any single LLM vendor via a standardized provider interface:

```
                     ┌──► Gemini Provider (Default)
                     ├──► OpenAI Provider (GPT-4o)
Context Package ────►├──► Claude Provider (Anthropic)
                     ├──► Local LLM Provider (Ollama / Llama-3)
                     └──► Future Extensions (Voice / Vision / Wearables)
```

Adding or switching LLM providers requires zero changes to the backend Context Engine or Prompt Builder.

---

## 18. Monitoring & Observability Metrics

The AI pipeline exports execution telemetry:
- `ai_prompt_token_count`: Total tokens per prompt.
- `ai_response_latency_ms`: Total roundtrip response time.
- `ai_context_generation_ms`: Duration of context filtering and prompt assembly.
- `ai_failed_requests_total`: Total failed or rate-limited AI requests.
- **Privacy Standard**: Plaintext journal entries are NEVER logged to server log files or monitoring systems.

---

## 19. Success Criteria

The AI Context & Memory Architecture successfully fulfills:
- ✅ Intelligent context selection and compression without raw database dumps.
- ✅ Token size hard limits (Max 20 tasks, 50 events, 30-day journal summaries, 90-day performance trends).
- ✅ 3-tier memory model (Session, User Preference, Performance Memory).
- ✅ Strict AI safety guardrails preventing task hallucination or direct score manipulation.
- ✅ Decoupled multi-provider LLM abstraction layer (Gemini, OpenAI, Claude, Local LLMs).
