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
      type TEXT NOT NULL,
      time_target TEXT,
      why TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT,
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
  `);
  console.log('✅ Database initialized');
}

export default db;
