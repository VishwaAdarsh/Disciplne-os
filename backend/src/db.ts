import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'dev.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      goal_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'Work',
      category TEXT DEFAULT 'Work',
      priority TEXT DEFAULT 'medium',
      estimated_minutes INTEGER DEFAULT 30,
      due_date TEXT,
      time_target TEXT,
      why TEXT,
      status TEXT DEFAULT 'pending',
      tags TEXT DEFAULT '[]',
      notes TEXT,
      is_active INTEGER DEFAULT 1,
      is_archived INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      habit_name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Health',
      frequency TEXT DEFAULT 'daily',
      target_days_per_week INTEGER DEFAULT 7,
      streak INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0.0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details_json TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS task_completions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(task_id, date),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      current INTEGER DEFAULT 0,
      best INTEGER DEFAULT 0,
      last_date TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reflections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_start TEXT NOT NULL,
      overall_score REAL NOT NULL,
      nonneg_score REAL NOT NULL,
      clarity_score REAL NOT NULL,
      progress_score REAL NOT NULL,
      went_well TEXT NOT NULL,
      broke_down TEXT NOT NULL,
      commitment TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      reset_time TEXT DEFAULT '06:00',
      reflection_day TEXT DEFAULT 'Saturday',
      streak_alerts INTEGER DEFAULT 1,
      public_score INTEGER DEFAULT 0,
      reflect_reminder INTEGER DEFAULT 1,
      comeback_mode INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      module TEXT NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT '⚡',
      payload_json TEXT DEFAULT '{}',
      score_impact INTEGER DEFAULT 0,
      source TEXT DEFAULT 'user',
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Strength',
      duration_minutes INTEGER DEFAULT 45,
      calories_burned INTEGER DEFAULT 300,
      intensity TEXT DEFAULT 'medium',
      notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sleep_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      sleep_start TEXT,
      sleep_end TEXT,
      duration_minutes INTEGER DEFAULT 480,
      quality_percent INTEGER DEFAULT 80,
      notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount_ml INTEGER NOT NULL,
      logged_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS step_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      steps_count INTEGER NOT NULL,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS weight_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      chest_cm REAL,
      waist_cm REAL,
      hip_cm REAL,
      arm_cm REAL,
      thigh_cm REAL,
      notes TEXT,
      logged_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS performance_snapshots (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      overall_score INTEGER NOT NULL,
      discipline_score INTEGER NOT NULL,
      body_score INTEGER NOT NULL,
      mind_score INTEGER NOT NULL,
      nutrition_score INTEGER NOT NULL,
      goals_score INTEGER NOT NULL,
      period_type TEXT DEFAULT 'daily',
      trend TEXT DEFAULT 'stable',
      snapshot_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mood_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mood TEXT NOT NULL,
      icon TEXT DEFAULT '🙂',
      notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS energy_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      energy_level TEXT NOT NULL,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stress_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      stress_level INTEGER NOT NULL,
      trigger_notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS focus_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      focus_score INTEGER NOT NULL,
      notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS journals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      mood_tag TEXT DEFAULT 'neutral',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS meditation_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT DEFAULT 'Mindfulness Meditation',
      duration_minutes INTEGER DEFAULT 10,
      type TEXT DEFAULT 'mindfulness',
      completed INTEGER DEFAULT 1,
      notes TEXT,
      log_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Lunch',
      calories INTEGER DEFAULT 0,
      protein_g REAL DEFAULT 0,
      carbs_g REAL DEFAULT 0,
      fat_g REAL DEFAULT 0,
      fiber_g REAL DEFAULT 0,
      notes TEXT,
      log_date TEXT NOT NULL,
      logged_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS nutrition_goals (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      calories_target INTEGER DEFAULT 2200,
      protein_target INTEGER DEFAULT 120,
      carbs_target INTEGER DEFAULT 250,
      fat_target INTEGER DEFAULT 70,
      water_target_ml INTEGER DEFAULT 3000,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);
    CREATE INDEX IF NOT EXISTS idx_task_completions_user_id ON task_completions(user_id);
    CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
    CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_events_module ON events(module);
    CREATE INDEX IF NOT EXISTS idx_events_user_created ON events(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_perf_user_id ON performance_snapshots(user_id);
    CREATE INDEX IF NOT EXISTS idx_perf_snapshot_date ON performance_snapshots(snapshot_date);
    CREATE INDEX IF NOT EXISTS idx_perf_user_date_period ON performance_snapshots(user_id, snapshot_date, period_type);
    CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON sleep_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_water_user_logged ON water_logs(user_id, logged_at);
    CREATE INDEX IF NOT EXISTS idx_steps_user_date ON step_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_weight_user_logged ON weight_logs(user_id, logged_at);
    CREATE INDEX IF NOT EXISTS idx_mood_user_date ON mood_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_energy_user_date ON energy_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_stress_user_date ON stress_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_focus_user_date ON focus_logs(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_journals_user_id ON journals(user_id);
    CREATE INDEX IF NOT EXISTS idx_meditation_user_date ON meditation_sessions(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_meals_user_category ON meals(user_id, category);
    CREATE INDEX IF NOT EXISTS idx_nutrition_goals_user ON nutrition_goals(user_id);
  `);
  console.log('✅ Database initialized');
}

export default db;

