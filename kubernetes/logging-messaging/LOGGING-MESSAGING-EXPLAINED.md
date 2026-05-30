# Logging-Messaging Infrastructure - Explication Détaillée

## Vue d'ensemble
Ce fichier déploie 3 services importants:
- **Elasticsearch** : Indexation et stockage des logs
- **Kibana** : Interface de visualisation des logs
- **RabbitMQ** : Message queue pour communication asynchrone

---

## 1. ELASTICSEARCH (Namespace: logging)

### Ressources créées:

#### PersistentVolume + PersistentVolumeClaim
```yaml
// PersistentVolume : stockage physique sur l'hôte
metadata.name: elasticsearch-pv
spec.hostPath.path: /data/elasticsearch  // Stockage sur le nœud host
spec.capacity.storage: 10Gi              // 10 GiB d'espace

// PersistentVolumeClaim : demande de stockage
metadata.name: elasticsearch-pvc
spec.resources.requests.storage: 10Gi    // Demande 10 GiB
```

#### StatefulSet (NOT Deployment)
```yaml
// StatefulSet : pour applications stateful (base de données, queues)
// Différence Deployment vs StatefulSet:
// - Deployment  : stateless, noms de pods génériques (pod-abc123, pod-def456)
// - StatefulSet : stateful, noms stables (elasticsearch-0, elasticsearch-1)
spec.serviceName: elasticsearch          // Service headless (DNS stable)
spec.replicas: 1                         // 1 seule instance
image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0

// Ports
containerPort: 9200  // HTTP API + REST (pour Kibana, logs)
containerPort: 9300  // Transport (inter-nœud clustering)

// Env variables
discovery.type: single-node              // Mode single-node (pas de clustering)
xpack.security.enabled: "false"          // Sécurité désactivée (dev)
ES_JAVA_OPTS: "-Xms512m -Xmx512m"       // JVM heap : 512M min/max

// Probes
livenessProbe: /_cluster/health          // Check santé du cluster
readinessProbe: /_cluster/health         // Check si prêt
```

#### Services
```yaml
// Service headless (clusterIP: None)
// Utilisé par StatefulSet pour noms DNS stables
name: elasticsearch
ports:
  - 9200 (http)      // API REST
  - 9300 (transport) // Inter-nœud

// Service NodePort (accès externe)
name: elasticsearch-nodeport
nodePort: 30920  // Accessible depuis l'extérieur du cluster
```

---

## 2. KIBANA (Namespace: logging)

### Ressources créées:

#### Deployment
```yaml
spec.replicas: 1                         // 1 seule instance
image: docker.elastic.co/kibana/kibana:8.11.0

// Port
containerPort: 5601                      // UI Kibana

// Env variables
ELASTICSEARCH_HOSTS: "http://elasticsearch:9200"  // Connexion à Elasticsearch (DNS interne)
ELASTICSEARCH_USERNAME: "elastic"

// Probes
livenessProbe: /api/status               // Check santé
readinessProbe: /api/status              // Check prêt
```

#### Services
```yaml
// Service ClusterIP
name: kibana
port: 5601
type: ClusterIP  // Accès interne seulement

// Service NodePort (accès externe)
name: kibana-nodeport
nodePort: 30561  // Accès externe via http://node-ip:30561
```

---

## 3. RABBITMQ (Namespace: message-queue)

### Ressources créées:

#### ConfigMap : rabbitmq-config
```yaml
enabled_plugins: |
  [rabbitmq_management,rabbitmq_peer_discovery_k8s]
  // Plugins : Management UI + Kubernetes peer discovery

rabbitmq.conf: |
  cluster_formation.peer_discovery_backend = rabbit_peer_discovery_k8s
  // Découverte de pair via Kubernetes
  cluster_formation.node_cleanup.interval = 10
  cluster_partition_handling = autoheal
  // Auto-healing des partitions réseau
  management.listener.ssl = false        // Management UI HTTP
```

#### ConfigMap : rabbitmq-definitions
```yaml
// Défini automatiquement:
users:
  - guest / guest avec permissions admin

vhosts:
  - /           // Vhost par défaut
  - education   // Vhost métier

exchanges:
  - education.events (type: topic)  // Exchange pour événements
  - education.logs   (type: direct) // Exchange pour logs

queues:
  - user.events               // Queue pour événements utilisateur
  - activity.logs             // Queue pour logs activités
  - classroom.notifications   // Queue pour notifications salles

bindings:
  // Connexions entre exchanges et queues
  // Ex: education.events + routing_key: "user.*" → user.events queue
```

#### StatefulSet
```yaml
spec.serviceName: rabbitmq        // Service headless pour noms stables
spec.replicas: 1                  // 1 seule instance

image: rabbitmq:3.12-management-alpine

// Ports
containerPort: 5672    // AMQP (clients)
containerPort: 15672   // Management UI
containerPort: 4369    // EPMD (peer discovery)
containerPort: 25672   // Clustering inter-nœud

// Volumes
config/        // Configuration Kubernetes
definitions.json // Définitions queues/exchanges/bindings
data/          // Données persistantes (emptyDir)

// Probes
livenessProbe: rabbitmq-diagnostics ping
readinessProbe: rabbitmq-diagnostics ping
```

#### Services
```yaml
// Service headless (clusterIP: None)
name: rabbitmq
ports:
  - 5672 (amqp)       // AMQP
  - 15672 (management) // Management UI
  - 4369 (epmd)       // EPMD
  - 25672 (clustering) // Clustering

// Service NodePort (accès externe)
name: rabbitmq-nodeport
nodePort: 30672  // AMQP externe
nodePort: 31672  // Management UI externe
```

---

## Flux de Données

### Scenario 1: Logging
```
Service (ex: Activity)
    ↓
Elasticsearch:9200 (indexation)
    ↓
Kibana:5601 (UI de visualisation)
```

### Scenario 2: Messaging Asynchrone
```
Service A (Publisher)
    ↓
RabbitMQ:5672 (exchange: education.events)
    ↓
Queue (user.events, activity.logs, etc.)
    ↓
Service B (Consumer)
```

### Accès Externe
```
Browser/CLI
    ↓
NodePort (30920, 30561, 31672)
    ↓
Elasticsearch/Kibana/RabbitMQ Management UI
```

---

## Namespaces
- **logging** : Elasticsearch + Kibana
- **message-queue** : RabbitMQ
- Permet d'isoler les ressources et appliquer des quotas

---

## Points Clés

1. **StatefulSet vs Deployment** : StatefulSet pour données persistantes
2. **Service Headless** : DNS stables pour clustering (rabbitmq-0, rabbitmq-1)
3. **PersistentVolume** : Stockage des données (emptyDir = perdu à chaque restart)
4. **ConfigMaps** : Configurations injectées dans les pods
5. **NodePort** : Accès externe via port>30000
6. **Namespaces** : Isolation et organisation des ressources
