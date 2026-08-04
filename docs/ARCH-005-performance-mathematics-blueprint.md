# ARCH-005 — Performance Mathematics & Scoring Engine Blueprint

**Document ID:** ARCH-005  
**Title:** Performance Mathematics & Scoring Engine Blueprint  
**Priority:** ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Highest Priority)  
**Version:** 1.0  
**Status:** Approved & Active  

---

## Out of Scope Observations

> [!NOTE]
> **OUT OF SCOPE OBSERVATION 01**: Legacy frontend store `frontend/src/store/performanceEngineStore.ts` contains client-side score computation functions (`calculateScoreInternal`, `evaluateLevelInternal`). Per mandatory guardrail instructions, frontend UI components, React code, and backend API handlers remain untouched. This blueprint establishes the authoritative backend scoring engine mathematics and calculation pipeline.

---

## 1. Vision

The **Performance Score** represents the user's overall execution quality, consistency, and holistic well-being—not merely a raw task count.

It evaluates execution across 5 core dimensions:
- **Discipline**: Daily non-negotiables, habit completion, and deep work focus.
- **Physical Wellness (Body)**: Workouts, step targets, sleep quality, hydration, and physical recovery.
- **Mental Wellness (Mind)**: Mood, focus, energy, stress management, meditation, and journaling.
- **Nutrition**: Caloric balance, protein intake, hydration consistency, and meal logging.
- **Strategic Progress (Goals)**: Long-term objective progress, milestone completion, and deadline adherence.

Performance Score is **not** a gamified point counter. It is a precise mathematical index measuring life execution quality.

---

## 2. Score Scale & Boundaries

- **Minimum Score**: `0`
- **Maximum Score**: `1000`
- **Score Scale**: Bounded integer in `[0, 1000]`.
- **Primary Display Format**: E.g., **`742`** — *PERFORMANCE SCORE* (*Performer* Tier).

---

## 3. Category Sub-Score Inputs

Each domain engine computes a normalized sub-score from **0 to 100**:

```
Discipline Sub-Score (0–100)  ──────┐
Goals Sub-Score (0–100)       ──────┼──► Performance Engine ──► Overall Score (0–1000)
Body Sub-Score (0–100)        ──────┤
Mind Sub-Score (0–100)        ──────┤
Nutrition Sub-Score (0–100)   ──────┘
```

> **Rule**: Individual domain engines NEVER calculate the final 0–1000 Performance Score directly. They emit domain metrics, and the Performance Engine applies the global weighting formula backend-side.

---

## 4. Category Weights

Default backend configuration weights:

| Module Domain | Default Weight Percentage | Decimal Multiplier |
| :--- | :--- | :--- |
| **Discipline** | **35%** | `0.35` |
| **Goals** | **25%** | `0.25` |
| **Body** | **15%** | `0.15` |
| **Mind** | **15%** | `0.15` |
| **Nutrition** | **10%** | `0.10` |

*Weights are stored in backend configuration (`user_settings` or system environment) and customizable by system administrators.*

---

## 5. Overall Performance Score Formula

$$\text{Raw Composite Score} = (\text{Discipline} \times 0.35) + (\text{Goals} \times 0.25) + (\text{Body} \times 0.15) + (\text{Mind} \times 0.15) + (\text{Nutrition} \times 0.10)$$

$$\text{Overall Performance Score} = \min\left(1000, \max\left(0, \text{Math.round}\left(\text{Raw Composite Score} \times 10\right)\right)\right)$$

### Example Calculation
- Discipline = `85`
- Goals = `80`
- Body = `70`
- Mind = `75`
- Nutrition = `90`

$$\text{Raw} = (85 \times 0.35) + (80 \times 0.25) + (70 \times 0.15) + (75 \times 0.15) + (90 \times 0.10)$$
$$\text{Raw} = 29.75 + 20.00 + 10.50 + 11.25 + 9.00 = 80.50$$
$$\text{Overall Performance Score} = 80.50 \times 10 = \mathbf{805} \quad (\text{Elite Tier})$$

---

## 6. Domain Sub-Score Formulas (0–100)

### 6.1 Discipline Sub-Score (0–100)
$$\text{Discipline} = (\text{NonNegCompletionRate} \times 40) + (\text{HabitCompletionRate} \times 25) + (\text{FocusTargetRatio} \times 20) + (\text{StreakConsistencyFactor} \times 15)$$

- **Non-Negotiables (40%)**: Ratio of completed daily non-negotiable tasks.
- **Habit Completion (25%)**: Percentage of target weekly habits completed today.
- **Focus Sessions (20%)**: Ratio of logged focus minutes vs daily target (capped at 1.0).
- **Consistency (15%)**: Active streak bonus factor ($\min(1.0, \text{streak} / 30)$).

---

### 6.2 Body Sub-Score (0–100)
$$\text{Body} = (\text{WorkoutScore} \times 0.20) + (\text{StepsScore} \times 0.20) + (\text{SleepScore} \times 0.20) + (\text{WaterScore} \times 0.20) + (\text{RecoveryScore} \times 0.20)$$

- **Workout (20%)**: `100` if workout logged today, else `0`.
- **Steps (20%)**: $\min(100, (\text{stepsCount} / \text{dailyStepTarget}) \times 100)$.
- **Sleep (20%)**: $\min(100, (\text{sleepHours} / \text{dailySleepTargetH}) \times 100) \times (\text{sleepQuality} / 10)$.
- **Water (20%)**: $\min(100, (\text{waterLiters} / \text{dailyWaterTargetL}) \times 100)$.
- **Recovery (20%)**: Self-reported or wearable recovery score (0–100).

---

### 6.3 Mind Sub-Score (0–100)
$$\text{Mind} = (\text{MoodRating} \times 2) + (\text{FocusRating} \times 2) + (\text{EnergyRating} \times 2) + ((10 - \text{StressRating}) \times 2) + (\text{MindfulnessBonus})$$

- **Mood, Focus, Energy (20% each)**: 1–10 scale mapped to 20 points.
- **Stress Rating (20% inverse)**: High stress lowers the score ($(10 - \text{stress}) \times 2$).
- **Mindfulness Bonus (20%)**: 10 pts for meditation + 10 pts for journal entry.

---

### 6.4 Nutrition Sub-Score (0–100)
$$\text{Nutrition} = (\text{CalorieAdherence} \times 25) + (\text{ProteinAdherence} \times 25) + (\text{WaterScore} \times 20) + (\text{MealLoggingRate} \times 15) + (\text{WeeklyConsistency} \times 15)$$

- **Calorie Adherence (25%)**: Score penalizes under-eating (<70% target) or over-eating (>120% target).
- **Protein Target (25%)**: Ratio of logged protein vs target.

---

### 6.5 Goal Sub-Score (0–100)
$$\text{Goal} = (\text{GoalProgressAvg} \times 0.35) + (\text{MilestoneCompletionRate} \times 0.35) + (\text{GoalStreak} \times 0.15) + (\text{DeadlineAdherence} \times 0.15)$$

---

## 7. XP System vs Performance Score

| Dimension | Measured Concept | Scale | Behavior |
| :--- | :--- | :--- | :--- |
| **Performance Score** | Execution Quality & Consistency | `0 – 1000` | Dynamic index (can rise or drop based on daily performance) |
| **Experience Points (XP)** | Cumulative Progression Volume | `0 – ∞` | Monotonically increasing (never decreases) |

---

## 8. XP Rewards Schedule

| User Action | XP Awarded |
| :--- | :--- |
| Complete Easy Task | `+10 XP` |
| Complete Medium Task | `+20 XP` |
| Complete Hard Task | `+40 XP` |
| Complete Workout Session | `+30 XP` |
| Daily Check-in Log | `+10 XP` |
| Write Journal Entry | `+10 XP` |
| Complete Meditation | `+15 XP` |
| Complete Goal Milestone | `+50 XP` |
| Achieve Perfect Day (100% Non-Neg) | `+100 XP` |

---

## 9. Level Progression System

XP requirements scale progressively according to the quadratic level curve formula:

$$\text{Required XP for Level } N = 100 \times N^2 + 150 \times N$$

| Level | Required Cumulative XP | XP Delta to Next Level |
| :--- | :--- | :--- |
| **Level 1** | `0 XP` | 250 XP |
| **Level 2** | `250 XP` | 350 XP |
| **Level 3** | `600 XP` | 500 XP |
| **Level 4** | `1,100 XP` | 700 XP |
| **Level 5** | `1,800 XP` | 950 XP |
| **Level 10**| `11,500 XP` | 2,250 XP |

---

## 10. Performance Level Tiers

| Score Range | Tier Title | Color Hex | Badge Icon |
| :--- | :--- | :--- | :--- |
| `0 – 199` | **Starter** | `#6B7280` | `🌱` |
| `200 – 399` | **Explorer** | `#0EA5E9` | `🧭` |
| `400 – 599` | **Builder** | `#10B981` | `🛠️` |
| `600 – 799` | **Performer** | `#6366F1` | `⚡` |
| `800 – 899` | **Elite** | `#8B5CF6` | `👑` |
| `900 – 1000`| **Master** | `#F59E0B` | `🏆` |

---

## 11. Daily, Weekly, & Monthly Score Aggregations

### 11.1 Daily Score Snapshots
- At the end of each day (or triggered on user action), the system records an **immutable daily snapshot** into `performance_scores`.
- **Rule**: Historical daily snapshot records are NEVER overwritten or mutated.

### 11.2 Weekly Score Aggregation
$$\text{Weekly Score} = \left(\frac{1}{7} \sum_{i=1}^{7} \text{DailyScore}_i\right) + \text{ConsistencyBonus}$$

- Consistency Bonus: Up to `+50 pts` for completing 7 consecutive days with scores $> 700$.

### 11.3 Monthly Score Aggregation
Monthly score aggregates weekly performance, weighting sustained execution consistency over isolated single-day peaks.

---

## 12. Bonus & Penalty Rules

### 12.1 Bonus Schedule
- **Perfect Day Bonus**: `+20 pts` added to daily score if 100% of Non-Negotiables are completed.
- **7-Day Streak Bonus**: `+30 pts` on weekly score.
- **Goal Milestone Bonus**: `+40 pts` added to Goal sub-score upon completing a milestone ahead of deadline.

### 12.2 Penalty Rules (Non-Punitive)
- Penalties are strictly capped to prevent demotivation.
- **Missing All Non-Negotiables**: `-15 pts` maximum daily penalty.
- **Extended Inactivity**: `-5 pts/day` after 3 consecutive days of zero logs, capped at `-50 pts` total.
- Missing a single workout or meal NEVER destroys overall performance.

---

## 13. Streak Rules

- **Current Streak**: Consecutive days with $\ge 1$ Non-Negotiable completed.
- **Best Streak**: All-time high streak record.
- **Rule**: Breaking a streak resets `currentStreak` to `0`, but **never** revokes unlocked achievements or historical level progression.

---

## 14. Achievement Unlocking Conditions

| Achievement Key | Title | Unlock Condition |
| :--- | :--- | :--- |
| `FIRST_FLAME` | **First Flame** | Continuous 7-day streak across all Non-Negotiables |
| `CONSISTENT_OPERATOR` | **Consistent Operator** | 30-day streak with $\ge 800$ average score |
| `PERFECT_WEEK` | **Perfect Week** | 100% Non-Negotiables completed for 7 consecutive days |
| `DEEP_WORKER` | **Deep Worker** | 100 cumulative focus hours logged |
| `GOAL_CRUSHER` | **Goal Crusher** | 10 completed goals |
| `HYDRATION_MASTER` | **Hydration Master** | 14 consecutive days meeting daily water goal |

---

## 15. Anti-Abuse & Fraud Prevention Rules

1. **Duplicate Event Filter**: Events with identical `eventId` or identical payloads within 60 seconds are discarded.
2. **Timestamp Verification**: Future-dated timestamps ($> 5 \text{ minutes}$ in the future) are rejected.
3. **Impossible Rate Cap**: Tasks completed in $< 5 \text{ seconds}$ or workouts $> 300 \text{ minutes}$ are flagged for manual review.
4. **Backend Calculation Strictness**: Scores are computed EXCLUSIVELY on backend servers. Any client-submitted score fields in API requests are ignored.

---

## 16. Recalculation Workflow

```
Event Arrives (e.g. MEAL_LOGGED)
       │
       ▼
Recalculate Nutrition Sub-Score ONLY (0-100)
       │
       ▼
Re-apply Composite Formula ──► New Overall Score (0-1000)
       │
       ▼
Persist Snapshot & Emit PERFORMANCE_UPDATED Event
```

Unrelated modules (e.g., Body or Mind) are NOT recalculated, minimizing CPU execution overhead.

---

## 17. Score History Schema & Formula Versioning

Every record in `performance_scores` stores:
- `formulaVersion`: String (e.g. `"v1.0"`).
- If formulas are updated in the future (`v1.1`, `v2.0`), historical scores retain the formula version tag that generated them.

---

## 18. Security & Execution Isolation

- All scoring logic executes within trusted backend services.
- Client applications have read-only access to score data via `/api/v1/performance` endpoints.
- Weight configurations are administrator-controlled via backend settings.

---

## 19. Success Criteria

The Scoring Engine successfully fulfills:
- ✅ Mathematical precision across 0–1000 scale based on 5 weighted domain inputs.
- ✅ Clear separation between Performance Score (execution quality) and XP (volume volume).
- ✅ Non-punitive penalty guardrails and consistency bonus multipliers.
- ✅ Anti-abuse timestamp checks and server-side calculation isolation.
- ✅ Selective event-driven recalculations and formula versioning (`v1.0`).
