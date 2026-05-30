-- Migrations SQL complètes pour déploiement Kubernetes
-- Exécuter après Argo CD rollup pour restaurer le schéma

-- 1. Créer table user (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Créer table parent
CREATE TABLE IF NOT EXISTS parent (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER,
  "phoneNumber" VARCHAR(20),
  address VARCHAR(255),
  "NCIN" VARCHAR(20),
  "typeInsurance" VARCHAR(50),
  "Numeroinsurance" VARCHAR(50),
  job VARCHAR(100),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_parent_user FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- 3. Créer table classroom (pour activity)
CREATE TABLE IF NOT EXISTS classroom (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Créer table activity
CREATE TABLE IF NOT EXISTS activity (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  location VARCHAR(255),
  date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  "isCompleted" BOOLEAN DEFAULT FALSE,
  "classroomId" INTEGER,
  metadata JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_classroom FOREIGN KEY ("classroomId") REFERENCES classroom(id) ON DELETE SET NULL
);

-- 5. Créer table student (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS student (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  email VARCHAR(255),
  "classroomId" INTEGER,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Créer table teacher (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS teacher (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  email VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Créer table migrations (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  "timestamp" BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL
);

-- 8. Enregistrer les migrations comme exécutées
INSERT INTO migrations ("timestamp", name) 
SELECT 1698765432103, 'CreateParentSchema1698765432103' 
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = 'CreateParentSchema1698765432103');

INSERT INTO migrations ("timestamp", name) 
SELECT 1698765432100, 'CreateActivityTable1698765432100' 
WHERE NOT EXISTS (SELECT 1 FROM migrations WHERE name = 'CreateActivityTable1698765432100');
