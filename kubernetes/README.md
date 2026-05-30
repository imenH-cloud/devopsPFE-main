# Kubernetes Manifests - HORIZONS TSA

Production-ready Kubernetes configuration for the education platform microservices.

## Structure

```
kubernetes/
├── backend/                    # 8 NestJS microservices
│   ├── auth-service.yaml
│   ├── user-service.yaml
│   ├── activity-service.yaml
│   ├── classroom-service.yaml
│   ├── parent-service.yaml
│   ├── student-service.yaml
│   ├── teacher-service.yaml
│   └── gateway-backend.yaml
│
├── frontend/                   # Angular application
│   └── frontend-app.yaml
│
├── database/                   # PostgreSQL
│   └── postgres.yaml
│
├── monitoring/                 # Prometheus + Grafana
│   ├── prometheus-deployment.yaml
│   └── grafana-deployment.yaml
│
├── logging-messaging/          # Elasticsearch + Kibana + RabbitMQ
│   └── elasticsearch-kibana-rabbitmq.yaml
│
├── configmap.yaml              # Application configuration
├── rbac.yaml                   # Service accounts + role bindings
├── network-policies.yaml       # Network security policies
└── kustomization.yaml          # Kustomize orchestration
```

## Deployment

### Prerequisites
- Kubernetes cluster (v1.20+)
- kubectl configured
- Namespace `education` created (auto-created by kustomization)

### Deploy All Services
```bash
kubectl apply -k kubernetes/

# Verify
kubectl get pods -n education
kubectl get svc -n education
```

### Deploy Specific Component
```bash
# Backend services only
kubectl apply -f kubernetes/backend/

# Frontend only
kubectl apply -f kubernetes/frontend/

# Database
kubectl apply -f kubernetes/database/
```

## Configuration

### Environment Variables
Managed via `configmap.yaml` (non-sensitive data):
- Database host/port
- Redis endpoint
- RabbitMQ connection
- Elasticsearch URL
- Prometheus/Grafana URLs

### Secrets
Create before deployment:
```bash
kubectl create secret generic postgres-secret \
  --from-literal=username=postgres \
  --from-literal=password=your-password \
  -n education

kubectl create secret generic jwt-secret \
  --from-literal=jwt-secret=your-jwt-key \
  -n education
```

## Features

- **High Availability**: 2-5 replicas per service (HPA enabled)
- **Rolling Updates**: Zero-downtime deployments
- **Health Checks**: Liveness + readiness probes
- **Security**: Non-root users, read-only filesystems, network policies
- **Resource Management**: CPU/memory requests and limits
- **Pod Disruption Budgets**: Minimum availability during rolling updates

## Access Services

### Port Forwarding
```bash
# Frontend
kubectl port-forward -n education svc/frontend 4200:4200

# API Gateway
kubectl port-forward -n education svc/gateway 3000:3000

# Prometheus
kubectl port-forward -n education svc/prometheus 9090:9090

# Grafana
kubectl port-forward -n education svc/grafana 3000:3000
```

### Via Ingress
Expose services externally (requires Ingress controller):
```bash
kubectl apply -f kubernetes/ingress.yaml
```

## Monitoring

- **Prometheus**: Collects metrics from all pods
- **Grafana**: Dashboards for cluster health and application performance
- **Network Policies**: Restrict traffic between services

## Cleanup

Remove all resources:
```bash
kubectl delete -k kubernetes/
# or
kubectl delete namespace education
```
