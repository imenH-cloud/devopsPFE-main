// Pipeline CI/CD Jenkins pour DevOps PFE - Explication détaillée ligne par ligne
// ============================================================================

// DÉCLARATION DU PIPELINE
pipeline {                                              // Déclare un pipeline déclaratif Jenkins
    agent any                                           // Exécute sur n'importe quel agent disponible
    
    // OPTIONS GLOBALES DU PIPELINE
    options {                                           // Bloc pour configurer le comportement global
        buildDiscarder(logRotator(numToKeepStr: '10')) // Garde seulement les 10 derniers builds (nettoie l'historique)
        timestamps()                                    // Ajoute des timestamps à chaque ligne de log (voir QUAND chaque étape démarre)
        timeout(time: 1, unit: 'HOURS')                // Annule automatiquement le build s'il dépasse 1 heure
    }
    
    // PARAMÈTRES UTILISATEUR
    // Ces paramètres apparaîtront dans l'interface Jenkins et l'utilisateur peut les modifier
    parameters {                                        // Bloc pour définir les paramètres du build
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deployment environment') // Choix : dev/staging/prod
        booleanParam(name: 'PUSH_DOCKER', defaultValue: true, description: 'Push images to Docker Hub?') // Cocher pour pousser les images
        booleanParam(name: 'RUN_TRIVY', defaultValue: true, description: 'Run Trivy security scans?')    // Cocher pour faire les scans de sécurité
    }
    
    // VARIABLES D'ENVIRONNEMENT GLOBALES
    // Ces variables sont accessibles partout dans le pipeline via ${NOM_VARIABLE}
    environment {                                       // Bloc pour définir les variables globales
        DOCKER_REGISTRY = 'eline2016'                  // Nom du registre Docker Hub (utilisateur Docker Hub)
        GIT_REPO = 'https://github.com/imenH-cloud/devopsPFE-main.git'        // URL du repo GitHub source
        GITOPS_REPO = 'https://github.com/imenH-cloud/devopsPFE-gitops.git'   // URL du repo GitHub GitOps
        ARGOCD_SERVER = 'localhost:32000'              // Adresse du serveur Argo CD (déploiement automatique)
    }
    
    // ÉTAPES DU PIPELINE
    stages {                                            // Bloc contenant toutes les étapes du pipeline
        
        // ÉTAPE 1 : RÉCUPÉRATION DU CODE SOURCE
        stage('Checkout') {                             // Nom de l'étape visible dans Jenkins
            steps {                                     // Bloc d'actions à exécuter
                echo "🔄 Checking out source code..."   // Affiche un message dans les logs
                checkout scm                            // Récupère le code depuis le repository Git configuré
            }
        }
        
        // ÉTAPE 2 : BUILD DES MICROSERVICES BACKEND (EN PARALLÈLE)
        stage('Build Backend Services') {               // Étape pour construire tous les microservices
            parallel {                                  // Les stages enfants s'exécutent en PARALLÈLE (plus rapide)
                // Les 8 services se compilent simultanément au lieu d'un par un
                
                stage('Build Activity Service') {       // Service de gestion des activités
                    steps {                             // Bloc d'actions
                        script {                        // Permet d'utiliser de la logique Groovy
                            echo "🔨 Building activity-service:${BUILD_NUMBER}..."  // Affiche le numéro de build
                            dir('backend/activity') {   // Change de répertoire vers backend/activity
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-activity-service:${BUILD_NUMBER} ."  // Compile l'image Docker
                                // -t = tag (nom:version de l'image)
                                // ${DOCKER_REGISTRY} = eline2016
                                // ${BUILD_NUMBER} = numéro unique du build (ex: #42)
                                // . = utilise le Dockerfile du répertoire courant
                            }
                        }
                    }
                }
                
                stage('Build Auth Service') {           // Service d'authentification
                    steps {
                        script {
                            echo "🔨 Building auth-service:${BUILD_NUMBER}..."
                            dir('backend/auth') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-auth-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Classroom Service') {      // Service de gestion des salles de classe
                    steps {
                        script {
                            echo "🔨 Building classroom-service:${BUILD_NUMBER}..."
                            dir('backend/classroom') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-classroom-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Gateway Service') {        // API Gateway (point d'entrée unique)
                    steps {
                        script {
                            echo "🔨 Building gateway-service:${BUILD_NUMBER}..."
                            dir('backend/gateway') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-gateway-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Parent Service') {         // Service de gestion des parents
                    steps {
                        script {
                            echo "🔨 Building parent-service:${BUILD_NUMBER}..."
                            dir('backend/parent') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-parent-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Student Service') {        // Service de gestion des étudiants
                    steps {
                        script {
                            echo "🔨 Building student-service:${BUILD_NUMBER}..."
                            dir('backend/student') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-student-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Teacher Service') {        // Service de gestion des enseignants
                    steps {
                        script {
                            echo "🔨 Building teacher-service:${BUILD_NUMBER}..."
                            dir('backend/teacher') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-teacher-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build User Service') {           // Service de gestion des utilisateurs
                    steps {
                        script {
                            echo "🔨 Building user-service:${BUILD_NUMBER}..."
                            dir('backend/user') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-user-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
            }
        }
        
        // ÉTAPE 3 : BUILD DU FRONTEND (APPLICATION ANGULAR)
        stage('Build Frontend') {                       // Étape pour construire l'application Angular
            steps {
                script {
                    echo "🔨 Building frontend-app:${BUILD_NUMBER}..."  // Message de démarrage
                    dir('frontend') {                   // Change de répertoire vers frontend/
                        bat "docker build -f Dockerfile.prod -t ${DOCKER_REGISTRY}/devopspfe-frontend-app:${BUILD_NUMBER} ."
                        // -f Dockerfile.prod = utilise le Dockerfile de production (multi-stage)
                        // Produit une image optimisée avec Nginx
                    }
                }
            }
        }
        
        // ÉTAPE 4 : SCANS DE SÉCURITÉ AVEC TRIVY
        stage('Trivy Security Scan') {                  // Étape pour scanner les vulnérabilités des images
            when {                                      // Condition : exécute seulement SI la condition est vraie
                expression { params.RUN_TRIVY == true } // Vérifie si l'utilisateur a activé les scans Trivy
            }
            steps {
                script {
                    echo "🔍 Running Trivy security scans..."  // Message de démarrage
                    bat '''
                        setlocal enabledelayedexpansion      // Active les variables dynamiques en batch
                        for %%i in (activity-service auth-service classroom-service gateway-service parent-service student-service teacher-service user-service) do (
                            echo Scanning eline2016/devopspfe-%%i:%BUILD_NUMBER%...  // Affiche le nom du service scanné
                            docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-%%i:%BUILD_NUMBER% || exit /b 0
                            // docker run = lance un conteneur Trivy
                            // --rm = supprime le conteneur après l'exécution (nettoyage)
                            // aquasec/trivy:latest = image Trivy (scanner de vulnérabilités)
                            // image = scanne une image Docker
                            // --exit-code 0 = ne pas échouer même si des vulnérabilités sont trouvées
                            // --severity CRITICAL = scanner seulement les vulnérabilités critiques
                        )
                        echo Scanning eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...  // Scanne aussi le frontend
                        docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-frontend-app:%BUILD_NUMBER% || exit /b 0
                        echo ✅ Trivy scans completed  // Message de fin
                    '''
                }
            }
        }
        
        // ÉTAPE 5 : PUSH DES IMAGES VERS DOCKER HUB
        stage('Push to Docker Hub') {                   // Étape pour envoyer les images compilées vers le registre
            when {                                      // Condition
                expression { params.PUSH_DOCKER == true }  // Exécute seulement SI PUSH_DOCKER = true
            }
            steps {
                script {
                    echo "📤 Pushing images to Docker Hub..."  // Message de démarrage
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // withCredentials = charge les identifiants stockés dans Jenkins
                        // credentialsId = identifiant des credentials dans Jenkins
                        // DOCKER_USER = variable contenant le username Docker
                        // DOCKER_PASS = variable contenant le password Docker (sécurisé)
                        bat '''
                            docker login -u %DOCKER_USER% -p %DOCKER_PASS%  // Authentifie auprès de Docker Hub
                            
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                echo Pushing eline2016/devopspfe-%%s-service:%BUILD_NUMBER%...  // Affiche le nom du service
                                docker push eline2016/devopspfe-%%s-service:%BUILD_NUMBER%      // Envoie l'image vers Docker Hub
                            )
                            
                            echo Pushing eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...    // Affiche le nom du frontend
                            docker push eline2016/devopspfe-frontend-app:%BUILD_NUMBER%        // Envoie l'image frontend
                            
                            docker logout                           // Se déconnecte de Docker Hub (sécurité)
                            echo ✅ All images pushed to Docker Hub  // Message de fin
                        '''
                    }
                }
            }
        }
        
        // ÉTAPE 6 : MISE À JOUR DU REPO GITOPS
        stage('Update GitOps Repo') {                   // Étape pour mettre à jour les manifests Kubernetes
            when {                                      // Condition
                expression { params.PUSH_DOCKER == true }  // Exécute seulement SI PUSH_DOCKER = true
            }
            steps {
                script {
                    echo "🔄 Updating GitOps Repo (devopsPFE-gitops)..."  // Message de démarrage
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        // Charge le token GitHub pour l'authentification
                        bat '''
                            setlocal enabledelayedexpansion      // Active les variables dynamiques en batch
                            if exist gitops-temp rmdir /s /q gitops-temp  // Nettoie les anciens fichiers temporaires
                            
                            set "GITOPS_URL=https://%GITHUB_TOKEN%@github.com/imenH-cloud/devopsPFE-gitops.git"
                            // Construit l'URL de clone avec le token (authentification automatique)
                            
                            git clone !GITOPS_URL! gitops-temp    // Clone le repo GitOps
                            cd gitops-temp                         // Entre dans le dossier cloné
                            
                            echo Updating kubernetes manifests in GitOps repo...  // Message
                            
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                if exist kubernetes\backend\%%s-service.yaml (
                                    // Vérifie si le fichier manifest existe
                                    powershell -Command "$content = Get-Content 'kubernetes\backend\%%s-service.yaml' -Raw; $content = $content -replace 'image: devopspfe-%%s-service:[^\s]*', 'image: eline2016/devopspfe-%%s-service:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\%%s-service.yaml'"
                                    // Remplace l'ancienne version d'image par la nouvelle dans le manifest
                                )
                            )
                            
                            if exist kubernetes\backend\gateway-backend.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\backend\gateway-backend.yaml' -Raw; $content = $content -replace 'image: devopspfe-gateway-backend:[^\s]*', 'image: eline2016/devopspfe-gateway-backend:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\gateway-backend.yaml'"
                            )
                            // Met à jour spécifiquement la gateway
                            
                            if exist kubernetes\frontend\frontend-app.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\frontend\frontend-app.yaml' -Raw; $content = $content -replace 'image: devopspfe-frontend-app:[^\s]*', 'image: eline2016/devopspfe-frontend-app:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\frontend\frontend-app.yaml'"
                            )
                            // Met à jour le frontend si le fichier existe
                            
                            echo .
                            echo Updated manifests:            // Message
                            git diff --name-only              // Affiche les fichiers modifiés
                            
                            git config user.email "jenkins@devops.local"  // Configure l'email du commit
                            git config user.name "Jenkins CI/CD"          // Configure le nom du commit
                            git add kubernetes/                // Stage les modifications
                            git commit -m "Jenkins Build #%BUILD_NUMBER% - Updated Docker images" || (  // Crée un commit
                                echo ✅ No changes to commit
                                exit /b 0
                            )
                            // Msg du commit = "Jenkins Build #42 - Updated Docker images"
                            
                            git push origin main               // Pousse les modifications vers GitHub
                            // Argo CD détectera automatiquement ces changements et les appliquera au cluster K8s
                            
                            cd ..                              // Revient au répertoire parent
                            rmdir /s /q gitops-temp            // Supprime les fichiers temporaires
                            echo ✅ GitOps repo updated successfully      // Message de fin
                            echo ✅ Argo CD will sync automatically       // Message de fin
                        '''
                    }
                }
            }
        }
    }
    
    // ÉTAPE POST-BUILD (s'exécute APRÈS toutes les étapes)
    post {                                              // Bloc de nettoyage post-build
        always {                                        // S'exécute TOUJOURS (succès ou échec)
            script {
                echo "🧹 Cleaning up..."                // Message de nettoyage
                bat 'docker image prune -f || exit /b 0'  // Supprime les images Docker inutilisées pour économiser l'espace
            }
        }
        
        success {                                       // S'exécute SEULEMENT si le build a réussi
            echo "✅ BUILD SUCCESSFUL - Build #${BUILD_NUMBER}"              // Message de succès
            echo "📤 Images pushed to Docker Hub: eline2016/devopspfe-*:${BUILD_NUMBER}"   // Résumé
            echo "🔄 GitOps repo updated: devopsPFE-gitops/kubernetes/"     // Résumé
            echo "🚀 Argo CD will auto-sync from GitOps repo"                // Résumé
            echo "🎯 Environment: ${DEPLOY_ENV}"                             // Affiche l'environnement
        }
        
        failure {                                       // S'exécute SEULEMENT si le build a échoué
            echo "❌ BUILD FAILED - Build #${BUILD_NUMBER}"                  // Message d'erreur
        }
    }
}
