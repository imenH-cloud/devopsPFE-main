CREATE TABLE IF NOT EXISTS activity (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  location VARCHAR(255),
  date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  isCompleted BOOLEAN DEFAULT FALSE,
  classroomId INTEGER,
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_classroomId ON activity(classroomId);
