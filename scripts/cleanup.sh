#!/bin/bash
# Cleanup script

set -e

echo "🧹 Cleaning up..."

read -p "Are you sure you want to delete all namespaces? (yes/no): " confirm

if [ "$confirm" == "yes" ]; then
    echo "Deleting namespaces..."
    kubectl delete namespace education logging message-queue cache monitoring argocd --ignore-not-found
    
    echo "Deleting Docker volumes..."
    docker volume rm devopspfe_postgres_data devopspfe_redis_data devopspfe_rabbitmq_data devopspfe_elasticsearch_data --ignore-not-found || true
    
    echo "✅ Cleanup completed!"
else
    echo "Cleanup cancelled"
fi
