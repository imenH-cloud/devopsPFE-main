# Activity Service - Database Management

## ⚠️ IMPORTANT - Prévention des problèmes de schéma

Ce service implémente plusieurs mécanismes pour éviter les erreurs de schéma de base de données.

### 1. **TypeORM Migrations** 📋

Les migrations gèrent le versioning du schéma. Elles s'exécutent automatiquement au démarrage du service.

```bash
# Générer une migration après changement d'entity
npm run migration:generate -- src/migrations/AddNewColumn

# Exécuter les migrations
npm run migration:run

# Revert une migration
npm run migration:revert

# Voir toutes les migrations
npm run migration:show
```

### 2. **Database Initialization** 🔄

Au démarrage du pod Kubernetes:
1. **Init container** exécute `npm run migration:run`
2. **Main container** exécute la logique d'init
3. **Health checks** vérifient que tout est correct

### 3. **Health Checks** 🏥

Trois niveaux de health checks:

#### `/health` - Détaillé
```bash
GET http://localhost:3003/health
```
**Vérifie:**
- Service running
- Database connection
- Schema completeness (tables + colonnes)

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2025-05-21T10:30:00Z",
  "checks": {
    "service": true,
    "database": true,
    "schema": true
  }
}
```

#### `/health/ready` - Readiness probe
```bash
GET http://localhost:3003/health/ready
```
**Utilisé par Kubernetes pour savoir si le pod peut recevoir du trafic.**

**Response:**
```json
{
  "status": "READY"
}
```

#### `/health` - Liveness probe
Utilisé par Kubernetes pour redémarrer le pod s'il est mort.

### 4. **Kubernetes Deployment** ⚙️

Le deployment incluture:

**Init Container:**
```yaml
initContainers:
- name: db-init
  command: ['npm', 'run', 'migration:run']
```
S'exécute AVANT le main container et garantit que le schéma est à jour.

**Health Probes:**
```yaml
livenessProbe:      # Restart if unhealthy
startupProbe:       # Wait for app to start
readinessProbe:     # Remove from load balancer if not ready
```

### 5. **Schéma Requis** 📊

**Table: activity**
```sql
- id (integer, PK, auto-increment)
- name (varchar, NOT NULL)
- type (varchar, nullable)
- description (text, nullable)
- location (varchar, nullable)
- date (timestamp, NOT NULL)
- duration (integer, NOT NULL)
- isCompleted (boolean, default=false)
- classroomId (integer, FK to classroom, nullable)
- metadata (jsonb, nullable)
- createdAt (timestamp, default=NOW())
- updatedAt (timestamp, default=NOW())
```

**Table: classroom**
```sql
- id (integer, PK, auto-increment)
- name (varchar, NOT NULL)
- description (varchar, nullable)
- createdAt (timestamp, default=NOW())
```

### 6. **Prévention des Problèmes** 🛡️

**Avant ce projet:**
- ❌ Pas de migrations
- ❌ Pas de health checks
- ❌ Pas de init containers
- ❌ Schéma manuellement créé

**Maintenant:**
- ✅ Migrations automatiques
- ✅ Health checks à 3 niveaux
- ✅ Init container garantit schéma
- ✅ Startup probe attend le démarrage
- ✅ Readiness probe teste connectivité DB

### 7. **En cas de Problème** 🚨

**Le pod refuse de démarrer?**
```bash
# Vérifier les logs
kubectl logs -n education activity-service-deployment-xxx

# Vérifier la health
curl http://localhost:3003/health

# Vérifier les events
kubectl describe pod activity-service-deployment-xxx -n education
```

**Le schéma est cassé?**
```bash
# Revert la dernière migration
npm run migration:revert

# Ou réinit complètement
kubectl delete pod activity-service-deployment-xxx -n education
```

### 8. **Ajouter une Nouvelle Colonne** 🆕

**Étape 1:** Modifier l'entity TypeORM
```typescript
@Entity()
export class Activity {
  @Column()
  newColumn: string;  // Add this
}
```

**Étape 2:** Générer la migration
```bash
npm run migration:generate -- src/migrations/AddNewColumnToActivity
```

**Étape 3:** Revue + Commit
```bash
git add src/migrations/
git commit -m "Add new column to activity"
git push
```

**Étape 4:** Rebuild + Deploy
```bash
docker build -t eline2016/devopspfe-activity-service:59 .
docker push eline2016/devopspfe-activity-service:59

kubectl set image deployment/activity-service-deployment \
  activity-service=eline2016/devopspfe-activity-service:59 -n education
```

**Migration s'exécute automatiquement!** ✅

---

**Résumé:** Ce système élimine complètement les erreurs de schéma en versionnant le schéma, en exécutant les migrations automatiquement, et en vérifiant la santé à chaque démarrage.
