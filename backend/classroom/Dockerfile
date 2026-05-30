# =============================================
# Stage 1 : Build (Compilation TypeScript → JavaScript)
# =============================================
# Utilise l'image Node.js 20 sur Alpine Linux pour compiler le code TypeScript
FROM node:20-alpine AS builder

# Définit le répertoire de travail à /app
WORKDIR /app

# Copie les fichiers package*.json (package.json et optionnellement package-lock.json)
COPY package*.json ./

# Installe les dépendances avec npm ci (clean install - plus fiable que npm install)
# --prefer-offline : utilise le cache npm en priorité
# --no-audit : désactive la vérification de sécurité pour gagner du temps
RUN npm ci --prefer-offline --no-audit

# Copie tout le code source du microservice Classroom
COPY . .

# Compile le code TypeScript en JavaScript (le résultat est dans dist/)
RUN npm run build

# =============================================
# Stage 2 : Production (Runtime minimal)
# =============================================
# Utilise à nouveau l'image Node.js Alpine (l'image légère)
FROM node:20-alpine

# Définit le répertoire de travail à /app
WORKDIR /app

# Installe dumb-init : un petit init system qui gère correctement les signaux Docker
# Cela permet l'arrêt gracieux des conteneurs (SIGTERM)
# --no-cache : ne conserve pas l'index apk pour économiser de l'espace
RUN apk add --no-cache dumb-init

# Copie les fichiers compilés (dist/) du stage 1 (build) vers le stage 2 (production)
# Cela évite d'inclure les sources TypeScript dans l'image finale
COPY --from=builder /app/dist ./dist

# Copie les fichiers package*.json nécessaires pour installer les dépendances runtime
COPY --from=builder /app/package*.json ./

# Installe UNIQUEMENT les dépendances de production (pas les devDependencies)
# --omit=dev : exclut les dépendances de développement (typescript, builders, etc.)
# --prefer-offline : utilise le cache npm
# --no-audit : désactive la vérification de sécurité
# && npm cache clean --force : nettoie le cache npm pour réduire la taille de l'image
RUN npm ci --omit=dev --prefer-offline --no-audit && \
    npm cache clean --force

# Définit la variable d'environnement NODE_ENV à "production"
# Cela indique à Node.js qu'il est en mode production (optimisations appliquées)
ENV NODE_ENV=production

# Expose le port 3006 : le conteneur écoutera sur ce port
# C'est le port par défaut pour le microservice Classroom
EXPOSE 3006

# Crée un groupe utilisateur 'nodejs' avec l'ID 1001 (-g)
# -S : système (ne demande pas de password)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Bascule vers l'utilisateur 'nodejs' (non-root)
# Cela améliore la sécurité en évitant d'exécuter l'application en tant que root
USER nodejs

# Utilise dumb-init comme point d'entrée pour gérer correctement les signaux Docker
# dumb-init transmet les signaux au processus Node.js (permet l'arrêt gracieux)
ENTRYPOINT ["dumb-init", "--"]

# Commande lancée au démarrage du conteneur
# Lance l'application compilée (main.js) avec Node.js
CMD ["node", "dist/main.js"]
