# =====================================================
# JENKINSFILE - Pipeline CI/CD pour DevOps PFE
# =====================================================
# Ce fichier définit l'ensemble du pipeline d'intégration continue et déploiement continu

# Déclaration du pipeline déclaratif Jenkins
pipeline {
    # Agent : "any" signifie que le pipeline peut s'exécuter sur n'importe quel agent disponible
    # Si vous aviez plusieurs agents, vous pourriez spécifier un label spécifique
    agent any
    
    # ===== OPTIONS GLOBALES =====
    options {
        # buildDiscarder : nettoie automatiquement les anciennes builds
        # Garde seulement les 10 derniers builds pour économiser l'espace disque
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        # timestamps : ajoute des timestamps à chaque ligne de log
        # Permet de voir quand chaque étape a débuté
        timestamps()
        
        # timeout : définit un timeout global pour tout le pipeline
        # Si le build prend plus de 1 heure, il est automatiquement annulé
        timeout(time: 1, unit: 'HOURS')
    }
    
    # ===== PARAMÈTRES =====
    # Ces paramètres permettent à l'utilisateur de personnaliser chaque build Jenkins
    parameters {
        # Choix de l'environnement de déploiement
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deployment environment')
        
        # Booléen : faut-il pousser les images vers Docker Hub?
        booleanParam(name: 'PUSH_DOCKER', defaultValue: true, description: 'Push images to Docker Hub?')
        
        # Booléen : faut-il exécuter les scans de sécurité Trivy?
        booleanParam(name: 'RUN_TRIVY', defaultValue: true, description: 'Run Trivy security scans?')
    }
    
    # ===== VARIABLES D'ENVIRONNEMENT GLOBALES =====
    # Ces variables sont disponibles dans tout le pipeline
    environment {
        # Registre Docker (Docker Hub)
        DOCKER_REGISTRY = 'eline2016'
        
        # URL du repository source (code applicatif)
        GIT_REPO = 'https://github.com/imenH-cloud/devopsPFE-main.git'
        
        # URL du repository GitOps (manifests Kubernetes)
        GITOPS_REPO = 'https://github.com/imenH-cloud/devopsPFE-gitops.git'
        
        # Adresse du serveur Argo CD (pour le déploiement GitOps)
        ARGOCD_SERVER = 'localhost:32000'
    }
    
    # ===== ÉTAPES DU PIPELINE =====
    stages {
        # ----- ÉTAPE 1 : RÉCUPÉRATION DU CODE SOURCE -----
        stage('Checkout') {
            steps {
                # Echo pour afficher un message dans les logs
                echo "🔄 Checking out source code..."
                
                # checkout scm : récupère le code depuis le repository Git
                # scm = Source Control Management (récupère depuis le repo configuré)
                checkout scm
            }
        }
        
        # ----- ÉTAPE 2 : BUILD DES MICROSERVICES BACKEND -----
        # parallel : les stages enfants s'exécutent en parallèle pour gagner du temps
        stage('Build Backend Services') {
            parallel {
                # Les 8 services s'exécutent en parallèle (au lieu de séquentiellement)
                
                stage('Build Activity Service') {
                    steps {
                        script {
                            echo "🔨 Building activity-service:${BUILD_NUMBER}..."
                            # dir() : exécute les commandes dans le répertoire spécifié
                            # Navigue dans backend/activity
                            dir('backend/activity') {
                                # docker build : construit l'image Docker
                                # -t : tag (nom et version de l'image)
                                # BUILD_NUMBER : numéro unique de la build Jenkins
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-activity-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Auth Service') {
                    steps {
                        script {
                            echo "🔨 Building auth-service:${BUILD_NUMBER}..."
                            dir('backend/auth') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-auth-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Classroom Service') {
                    steps {
                        script {
                            echo "🔨 Building classroom-service:${BUILD_NUMBER}..."
                            dir('backend/classroom') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-classroom-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Gateway Service') {
                    steps {
                        script {
                            echo "🔨 Building gateway-service:${BUILD_NUMBER}..."
                            dir('backend/gateway') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-gateway-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Parent Service') {
                    steps {
                        script {
                            echo "🔨 Building parent-service:${BUILD_NUMBER}..."
                            dir('backend/parent') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-parent-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Student Service') {
                    steps {
                        script {
                            echo "🔨 Building student-service:${BUILD_NUMBER}..."
                            dir('backend/student') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-student-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build Teacher Service') {
                    steps {
                        script {
                            echo "🔨 Building teacher-service:${BUILD_NUMBER}..."
                            dir('backend/teacher') {
                                bat "docker build -t ${DOCKER_REGISTRY}/devopspfe-teacher-service:${BUILD_NUMBER} ."
                            }
                        }
                    }
                }
                
                stage('Build User Service') {
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
        
        # ----- ÉTAPE 3 : BUILD DU FRONTEND -----
        stage('Build Frontend') {
            steps {
                script {
                    echo "🔨 Building frontend-app:${BUILD_NUMBER}..."
                    dir('frontend') {
                        # -f Dockerfile.prod : utilise le Dockerfile de production
                        # . : utilise le répertoire courant comme contexte
                        bat "docker build -f Dockerfile.prod -t ${DOCKER_REGISTRY}/devopspfe-frontend-app:${BUILD_NUMBER} ."
                    }
                }
            }
        }
        
        # ----- ÉTAPE 4 : SCANS DE SÉCURITÉ AVEC TRIVY -----
        # when { expression } : cette étape ne s'exécute que si la condition est vraie
        stage('Trivy Security Scan') {
            when {
                # RUN_TRIVY est true si l'utilisateur a coché le paramètre
                expression { params.RUN_TRIVY == true }
            }
            steps {
                script {
                    echo "🔍 Running Trivy security scans..."
                    # Trivy : scanner de vulnérabilités pour images Docker
                    # --exit-code 0 : ne pas échouer même si des vulnérabilités sont trouvées
                    # --severity CRITICAL : scanner seulement les vulnérabilités critiques
                    bat '''
                        setlocal enabledelayedexpansion
                        # Boucle sur tous les microservices
                        for %%i in (activity-service auth-service classroom-service gateway-service parent-service student-service teacher-service user-service) do (
                            echo Scanning eline2016/devopspfe-%%i:%BUILD_NUMBER%...
                            docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-%%i:%BUILD_NUMBER% || exit /b 0
                        )
                        # Scan du frontend
                        echo Scanning eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...
                        docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-frontend-app:%BUILD_NUMBER% || exit /b 0
                        echo ✅ Trivy scans completed
                    '''
                }
            }
        }
        
        # ----- ÉTAPE 5 : PUSH VERS DOCKER HUB -----
        stage('Push to Docker Hub') {
            when {
                # Cette étape s'exécute seulement si PUSH_DOCKER = true
                expression { params.PUSH_DOCKER == true }
            }
            steps {
                script {
                    echo "📤 Pushing images to Docker Hub..."
                    # withCredentials : charge les identifiants stockés dans Jenkins
                    # credentialsId: 'docker-hub-credentials' : identifiants Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            # Docker login : authentification auprès de Docker Hub
                            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                            
                            # Boucle : push chaque image microservice
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                echo Pushing eline2016/devopspfe-%%s-service:%BUILD_NUMBER%...
                                docker push eline2016/devopspfe-%%s-service:%BUILD_NUMBER%
                            )
                            
                            # Push du frontend
                            echo Pushing eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...
                            docker push eline2016/devopspfe-frontend-app:%BUILD_NUMBER%
                            
                            # Docker logout : se déconnecter de Docker Hub
                            docker logout
                            echo ✅ All images pushed to Docker Hub
                        '''
                    }
                }
            }
        }
        
        # ----- ÉTAPE 6 : MISE À JOUR DU REPO GITOPS -----
        # Cette étape met à jour les manifests Kubernetes avec les nouvelles versions d'images
        stage('Update GitOps Repo') {
            when {
                expression { params.PUSH_DOCKER == true }
            }
            steps {
                script {
                    echo "🔄 Updating GitOps Repo (devopsPFE-gitops)..."
                    # withCredentials : charge le token GitHub
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        bat '''
                            setlocal enabledelayedexpansion
                            # Nettoie les fichiers temporaires si présents
                            if exist gitops-temp rmdir /s /q gitops-temp
                            
                            # Construit l'URL de clone avec le token (authentification)
                            set "GITOPS_URL=https://%GITHUB_TOKEN%@github.com/imenH-cloud/devopsPFE-gitops.git"
                            
                            # Clone le repo GitOps
                            git clone !GITOPS_URL! gitops-temp
                            cd gitops-temp
                            
                            echo Updating kubernetes manifests in GitOps repo...
                            
                            # Met à jour chaque fichier manifest avec la nouvelle version d'image
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                if exist kubernetes\backend\%%s-service.yaml (
                                    # powershell -Command : exécute une commande PowerShell
                                    # -replace : remplace l'ancienne version d'image par la nouvelle
                                    # %BUILD_NUMBER% : version de la build
                                    powershell -Command "$content = Get-Content 'kubernetes\backend\%%s-service.yaml' -Raw; $content = $content -replace 'image: devopspfe-%%s-service:[^\s]*', 'image: eline2016/devopspfe-%%s-service:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\%%s-service.yaml'"
                                )
                            )
                            
                            # Met à jour spécifiquement la gateway
                            if exist kubernetes\backend\gateway-backend.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\backend\gateway-backend.yaml' -Raw; $content = $content -replace 'image: devopspfe-gateway-backend:[^\s]*', 'image: eline2016/devopspfe-gateway-backend:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\gateway-backend.yaml'"
                            )
                            
                            # Met à jour le frontend si présent
                            if exist kubernetes\frontend\frontend-app.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\frontend\frontend-app.yaml' -Raw; $content = $content -replace 'image: devopspfe-frontend-app:[^\s]*', 'image: eline2016/devopspfe-frontend-app:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\frontend\frontend-app.yaml'"
                            )
                            
                            # Affiche les fichiers modifiés
                            echo .
                            echo Updated manifests:
                            git diff --name-only
                            
                            # Commit et push des modifications
                            git config user.email "jenkins@devops.local"
                            git config user.name "Jenkins CI/CD"
                            git add kubernetes/
                            # git commit : crée un commit avec le numéro de build
                            git commit -m "Jenkins Build #%BUILD_NUMBER% - Updated Docker images" || (
                                echo ✅ No changes to commit
                                exit /b 0
                            )
                            # git push : pousse les modifications vers GitHub
                            git push origin main
                            
                            # Nettoie les fichiers temporaires
                            cd ..
                            rmdir /s /q gitops-temp
                            echo ✅ GitOps repo updated successfully
                            echo ✅ Argo CD will sync automatically
                        '''
                    }
                }
            }
        }
    }
    
    # ===== ÉTAPE POST-BUILD =====
    # post : s'exécute après l'exécution de toutes les étapes
    post {
        # always : s'exécute toujours, peu importe le résultat
        always {
            script {
                echo "🧹 Cleaning up..."
                # docker image prune -f : supprime les images Docker non utilisées
                # Libère de l'espace disque après le build
                bat 'docker image prune -f || exit /b 0'
            }
        }
        
        # success : s'exécute seulement si le build a réussi
        success {
            echo "✅ BUILD SUCCESSFUL - Build #${BUILD_NUMBER}"
            echo "📤 Images pushed to Docker Hub: eline2016/devopspfe-*:${BUILD_NUMBER}"
            echo "🔄 GitOps repo updated: devopsPFE-gitops/kubernetes/"
            echo "🚀 Argo CD will auto-sync from GitOps repo"
            echo "🎯 Environment: ${DEPLOY_ENV}"
        }
        
        # failure : s'exécute seulement si le build a échoué
        failure {
            echo "❌ BUILD FAILED - Build #${BUILD_NUMBER}"
        }
    }
}
