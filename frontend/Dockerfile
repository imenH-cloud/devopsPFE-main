# =============================================
# Stage 1 : Build de l'application Angular
# =============================================
# Utilise l'image Node.js 20 sur Alpine Linux (image léger ~160MB)
FROM node:20-alpine AS build

# Définit le répertoire de travail à /app où les commandes s'exécuteront
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (s'il existe) de l'hôte vers /app
# L'astérisque (*) rend package-lock.json optionnel
COPY app/package*.json ./

# Installe les dépendances npm avec --legacy-peer-deps pour éviter les conflits de versions
# Les dépendances legacy permettent l'utilisation de versions incompatibles
RUN npm install --legacy-peer-deps

# Copie tout le code source de l'application Angular du répertoire app/
COPY app/ .

# Exécute la commande de build Angular en mode production
# Le résultat (fichiers compilés) sera généré dans dist/front/browser
RUN npm run build -- --configuration production

# =============================================
# Stage 2 : Serveur nginx + proxy
# =============================================
# Utilise l'image Nginx Alpine (image léger ~20MB)
# Cette image ne contient que Nginx, pas Node.js
FROM nginx:alpine

# Supprime la configuration par défaut de Nginx pour utiliser uniquement notre configuration personnalisée
RUN rm -f /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques générés pendant le build (du stage 1) vers le répertoire racine web Nginx
# /usr/share/nginx/html est le répertoire servi par Nginx par défaut
COPY --from=build /app/dist/front/browser /usr/share/nginx/html

# Copie notre fichier de configuration Nginx personnalisé vers la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose le port 80 (HTTP) - le conteneur écoutera sur ce port
EXPOSE 80

# Commande lancée au démarrage du conteneur
# "nginx -g daemon off;" lance Nginx en avant-plan (important pour Docker)
# Sans "daemon off;", Nginx s'exécuterait en arrière-plan et le conteneur s'arrêterait
CMD ["nginx", "-g", "daemon off;"]
