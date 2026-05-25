# =============================================
# Stage 1 : Build de l'application Angular
# =============================================
FROM node:20-alpine AS build
WORKDIR /app

# Copie des fichiers de dépendances
COPY app/package*.json ./

# Installation des dépendances avec --legacy-peer-deps pour éviter le conflit
RUN npm install --legacy-peer-deps

# Copie du code source de l'application
COPY app/ .

# Build production (le dossier de sortie sera dist/front/browser)
RUN npm run build -- --configuration production

# =============================================
# Stage 2 : Serveur nginx + proxy
# =============================================
FROM nginx:alpine

# Supprime le default.conf pour utiliser uniquement notre config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copie des fichiers statiques générés (dans le sous-dossier browser)
COPY --from=build /app/dist/front/browser /usr/share/nginx/html

# Copie de la configuration nginx corrigée
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
