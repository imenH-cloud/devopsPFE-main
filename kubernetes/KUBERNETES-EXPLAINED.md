# Kubernetes Manifests - Explication Détaillée

## Structure des Services Backend (exemple: activity-service.yaml)

Chaque service backend contient **4 ressources Kubernetes** :

### 1. **DEPLOYMENT** - Gestion du cycle de vie des pods
```yaml
apiVersion: apps/v1                        // Version API pour les déploiements
kind: Deployment                           // Type d'objet : Deployment
metadata:
  name: activity-service-deployment        // Nom du déploiement
  labels:
    app: activity-service                  // Label pour identification
    tier: backend                          // Label : tier backend
    
spec:
  replicas: 2                              // Crée 2 instances du service (HA)
  strategy:
    type: RollingUpdate                    // Mise à jour progressive (pas d'interruption)
    rollingUpdate:
      maxUnavailable: 0                    // 0 pod down lors de la mise à jour (0 interruption)
      maxSurge: 1                          // Max 1 pod supplémentaire pendant la mise à jour
      
  selector:
    matchLabels:
      app: activity-service                // Sélectionne les pods avec ce label
      
  template:
    metadata:
      labels:
        app: activity-service              // Label du pod
        tier: backend
      annotations:
        prometheus.io/scrape: "true"       // Prometheus scrape ce pod
        prometheus.io/port: "3003"         // Port pour les metrics
        prometheus.io/path: "/metrics"     // Endpoint des metrics
        
    spec:
      serviceAccountName: default          // Compte de service pour les permissions
      securityContext:
        runAsNonRoot: true                 // Pas d'exécution en tant que root (sécurité)
        runAsUser: 1001                    // Exécute en tant qu'utilisateur 1001
        fsGroup: 1001                      // Groupe propriétaire des volumes
        
      containers:
        - name: activity-service           // Nom du conteneur
          image: devopspfe-activity-service:latest  // Image Docker
          imagePullPolicy: IfNotPresent    // Pull l'image seulement si pas présente localement
          ports:
            - containerPort: 3003          // Port du conteneur
              name: http                   // Nom du port
              
          env:                             // Variables d'environnement
            - name: NODE_ENV
              valueFrom:
                configMapKeyRef:           // Récupère depuis un ConfigMap
                  name: app-config
                  key: NODE_ENV            // Clé NODE_ENV = "production"
                  
            - name: DB_USERNAME
              valueFrom:
                secretKeyRef:              // Récupère depuis un Secret (sécurisé)
                  name: postgres-secret
                  key: username            // Identifiants de DB
                  
          resources:
            requests:                      // Ressources minimum requises
              memory: "256Mi"
              cpu: "250m"
            limits:                        // Ressources maximum
              memory: "512Mi"
              cpu: "500m"
              
          livenessProbe:                   // Vérifie si le pod est vivant
            httpGet:
              path: /health                // Endpoint de health check
              port: 3003
            initialDelaySeconds: 30        // Attend 30s avant de commencer
            periodSeconds: 10              // Check toutes les 10 secondes
            timeoutSeconds: 5              // Timeout de 5 secondes
            failureThreshold: 3            // Redémarre après 3 échecs
            
          readinessProbe:                  // Vérifie si le pod est prêt à recevoir du trafic
            httpGet:
              path: /health
              port: 3003
            initialDelaySeconds: 10        // Attend 10s avant de commencer
            periodSeconds: 5               // Check toutes les 5 secondes
            failureThreshold: 2            // Retire du trafic après 2 échecs
            
          securityContext:
            allowPrivilegeEscalation: false  // Pas de privilege escalation
            readOnlyRootFilesystem: false    // Système de fichiers modifiable
            capabilities:
              drop:
                - ALL                      // Retire toutes les capabilities Linux
                
      affinity:
        podAntiAffinity:                   // Évite de mettre 2 pods du même service sur le même nœud
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100                  // Préférence forte
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - activity-service
                topologyKey: kubernetes.io/hostname  // Sur des nœuds différents
```

### 2. **SERVICE** - Point d'accès réseau pour les pods
```yaml
apiVersion: v1                             // Version API pour les services
kind: Service                              // Type d'objet : Service
metadata:
  name: activity-service                   // Nom du service (DNS interne: activity-service)
  labels:
    app: activity-service
    
spec:
  selector:
    app: activity-service                  // Sélectionne les pods avec ce label
  type: ClusterIP                          // Type : IP interne au cluster (pas accessible de l'extérieur)
  ports:
    - protocol: TCP
      port: 3003                           // Port du service (DNS)
      targetPort: 3003                     // Port du pod auquel transférer
      name: http
      
// Effet: activity-service:3003 (DNS) → pod:3003 (réseau Kubernetes)
```

### 3. **PODDISRUPTIONBUDGET** - Haute disponibilité
```yaml
apiVersion: policy/v1                      // Version API pour les policies
kind: PodDisruptionBudget                  // Type d'objet : PDB
metadata:
  name: activity-service-pdb
  
spec:
  minAvailable: 1                          // Garde MINIMUM 1 pod en fonctionnement
  selector:
    matchLabels:
      app: activity-service
      
// Effet: Évite que le pod soit interrompu pendant la maintenance (gardien de la HA)
```

### 4. **HORIZONTALPODAUTOSCALER** - Autoscaling
```yaml
apiVersion: autoscaling/v2                 // Version API pour l'autoscaling
kind: HorizontalPodAutoscaler              // Type d'objet : HPA
metadata:
  name: activity-service-hpa
  
spec:
  scaleTargetRef:                          // Cible du scaling
    apiVersion: apps/v1
    kind: Deployment
    name: activity-service-deployment
    
  minReplicas: 2                           // Minimum 2 pods
  maxReplicas: 4                           // Maximum 4 pods
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70           // Scale si CPU > 70%
          
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80           // Scale si Memory > 80%
          
// Effet: Ajoute automatiquement des pods si CPU/Memory augmente
```

---

## Autres Fichiers de Configuration

### configmap.yaml
- Stocke les **variables non-sensibles** (NODE_ENV, DATABASE_HOST, etc.)
- Accessibles par tous les pods via `valueFrom.configMapKeyRef`

### rbac.yaml
- **ServiceAccount** : Identité pour les pods
- **ClusterRole** : Définit les permissions (get, list, watch pods/deployments)
- **ClusterRoleBinding** : Attache le rôle au ServiceAccount

### network-policies.yaml
- **Firewall Kubernetes** : Contrôle le trafic entre pods
- Deny-all par défaut, puis allow des chemins spécifiques
- Gateway → Services backend → PostgreSQL → etc.

### database/postgres.yaml
- Déploiement PostgreSQL
- PersistentVolume : Stockage des données persistent

### frontend/frontend-app.yaml
- Déploiement Angular + Nginx
- Build multi-stage (production)

### monitoring/ et logging-messaging/
- Prometheus : Collecte les metrics
- Grafana : Dashboards
- Elasticsearch : Indexation des logs
- RabbitMQ : Message queue asynchrone

---

## Flux de Communication (basé sur les Network Policies)

```
Client (Browser)
    ↓
Ingress Controller (nginx-ingress)
    ↓
frontend (Nginx)
    ↓
gateway:3000 (API Gateway)
    ↓
[activity, auth, user, parent, student, teacher, classroom]:3001-3007 (Services)
    ↓
postgres:5432 (DB)
redis:6379 (Cache)
elasticsearch:9200 (Search)
```

Chaque étape est **contrôlée par NetworkPolicy** (firewall).
