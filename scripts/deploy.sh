#!/bin/bash
# Deploy script for DevOps PFE Project

set -e

echo "🚀 Starting deployment..."

# Create namespaces
echo "📦 Creating namespaces..."
kubectl create namespace education --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace logging --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace message-queue --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace cache --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations
echo "⚙️  Applying ConfigMaps and Secrets..."
kubectl apply -f k8s/config/configmap.yaml
kubectl apply -f k8s/config/secret.yaml

# Deploy Argo CD
echo "🔄 Deploying Argo CD..."
kubectl apply -f k8s/argocd/argocd-simple.yaml
sleep 10

# Deploy backend services
echo "🐳 Deploying backend services..."
kubectl apply -f k8s/backend/gateway.yaml
kubectl apply -f k8s/backend/services.yaml

# Deploy frontend
echo "🎨 Deploying frontend..."
kubectl apply -f k8s/frontend/frontend.yaml

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/gateway-deployment -n education || true
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n education || true

echo "✅ Deployment completed!"
echo ""
echo "📊 Cluster status:"
kubectl get pods -n education
echo ""
echo "🔗 Access points:"
echo "  Frontend:  http://localhost:31927"
echo "  Argo CD:   http://localhost:32000"
echo ""
echo "📝 Get Argo CD initial password:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d"
