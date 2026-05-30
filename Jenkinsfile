pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }
    
    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['development', 'staging', 'production'], description: 'Deployment environment')
        booleanParam(name: 'PUSH_DOCKER', defaultValue: true, description: 'Push images to Docker Hub?')
        booleanParam(name: 'RUN_TRIVY', defaultValue: true, description: 'Run Trivy security scans?')
    }
    
    environment {
        DOCKER_REGISTRY = 'eline2016'
        GIT_REPO = 'https://github.com/imenH-cloud/devopsPFE-main.git'
        GITOPS_REPO = 'https://github.com/imenH-cloud/devopsPFE-gitops.git'
        ARGOCD_SERVER = 'localhost:32000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out source code..."
                checkout scm
            }
        }
        
        stage('Build Backend Services') {
            parallel {
                stage('Build Activity Service') {
                    steps {
                        script {
                            echo "🔨 Building activity-service:${BUILD_NUMBER}..."
                            dir('backend/activity') {
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
        
        stage('Build Frontend') {
            steps {
                script {
                    echo "🔨 Building frontend-app:${BUILD_NUMBER}..."
                    dir('frontend') {
                        bat "docker build -f Dockerfile.prod -t ${DOCKER_REGISTRY}/devopspfe-frontend-app:${BUILD_NUMBER} ."
                    }
                }
            }
        }
        
        stage('Trivy Security Scan') {
            when {
                expression { params.RUN_TRIVY == true }
            }
            steps {
                script {
                    echo "🔍 Running Trivy security scans..."
                    bat '''
                        setlocal enabledelayedexpansion
                        for %%i in (activity-service auth-service classroom-service gateway-service parent-service student-service teacher-service user-service) do (
                            echo Scanning eline2016/devopspfe-%%i:%BUILD_NUMBER%...
                            docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-%%i:%BUILD_NUMBER% || exit /b 0
                        )
                        echo Scanning eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...
                        docker run --rm aquasec/trivy:latest image --exit-code 0 --severity CRITICAL eline2016/devopspfe-frontend-app:%BUILD_NUMBER% || exit /b 0
                        echo ✅ Trivy scans completed
                    '''
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                expression { params.PUSH_DOCKER == true }
            }
            steps {
                script {
                    echo "📤 Pushing images to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat '''
                            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                            
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                echo Pushing eline2016/devopspfe-%%s-service:%BUILD_NUMBER%...
                                docker push eline2016/devopspfe-%%s-service:%BUILD_NUMBER%
                            )
                            
                            echo Pushing eline2016/devopspfe-frontend-app:%BUILD_NUMBER%...
                            docker push eline2016/devopspfe-frontend-app:%BUILD_NUMBER%
                            
                            docker logout
                            echo ✅ All images pushed to Docker Hub
                        '''
                    }
                }
            }
        }
        
        stage('Update GitOps Repo') {
            when {
                expression { params.PUSH_DOCKER == true }
            }
            steps {
                script {
                    echo "🔄 Updating GitOps repo (devopsPFE-gitops)..."
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        bat '''
                            setlocal enabledelayedexpansion
                            if exist gitops-temp rmdir /s /q gitops-temp
                            
                            set "GITOPS_URL=https://%GITHUB_TOKEN%@github.com/imenH-cloud/devopsPFE-gitops.git"
                            
                            git clone !GITOPS_URL! gitops-temp
                            cd gitops-temp
                            
                            echo Updating kubernetes manifests in GitOps repo...
                            
                            REM Update backend service deployments individually
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                if exist kubernetes\backend\%%s-service.yaml (
                                    powershell -Command "$content = Get-Content 'kubernetes\backend\%%s-service.yaml' -Raw; $content = $content -replace 'image: devopspfe-%%s-service:[^\s]*', 'image: eline2016/devopspfe-%%s-service:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\%%s-service.yaml'"
                                )
                            )
                            
                            REM Update gateway backend specifically
                            if exist kubernetes\backend\gateway-backend.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\backend\gateway-backend.yaml' -Raw; $content = $content -replace 'image: devopspfe-gateway-backend:[^\s]*', 'image: eline2016/devopspfe-gateway-backend:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\backend\gateway-backend.yaml'"
                            )
                            
                            REM Update frontend deployment if exists
                            if exist kubernetes\frontend\frontend-app.yaml (
                                powershell -Command "$content = Get-Content 'kubernetes\frontend\frontend-app.yaml' -Raw; $content = $content -replace 'image: devopspfe-frontend-app:[^\s]*', 'image: eline2016/devopspfe-frontend-app:%BUILD_NUMBER%'; $content | Set-Content 'kubernetes\frontend\frontend-app.yaml'"
                            )
                            
                            REM Verify changes
                            echo .
                            echo Updated manifests:
                            git diff --name-only
                            
                            REM Commit and push
                            git config user.email "jenkins@devops.local"
                            git config user.name "Jenkins CI/CD"
                            git add kubernetes/
                            git commit -m "Jenkins Build #%BUILD_NUMBER% - Updated Docker images" || (
                                echo ✅ No changes to commit
                                exit /b 0
                            )
                            git push origin main
                            
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
    
    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                bat 'docker image prune -f || exit /b 0'
            }
        }
        
        success {
            echo "✅ BUILD SUCCESSFUL - Build #${BUILD_NUMBER}"
            echo "📤 Images pushed to Docker Hub: eline2016/devopspfe-*:${BUILD_NUMBER}"
            echo "🔄 GitOps repo updated: devopsPFE-gitops/k8s/"
            echo "🚀 Argo CD will auto-sync from GitOps repo"
            echo "🎯 Environment: ${DEPLOY_ENV}"
        }
        
        failure {
            echo "❌ BUILD FAILED - Build #${BUILD_NUMBER}"
        }
    }
}
