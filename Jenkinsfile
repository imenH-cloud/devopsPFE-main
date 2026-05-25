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
        GIT_REPO = 'https://github.com/imenH-cloud/devops-education-platform.git'
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
                    dir('frontend/app') {
                        bat "docker build --build-arg NODE_OPTIONS=\"--max-old-space-size=4096\" -t ${DOCKER_REGISTRY}/devopspfe-frontend-app:${BUILD_NUMBER} ."
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
        
        stage('Update GitOps') {
            when {
                expression { params.PUSH_DOCKER == true }
            }
            steps {
                script {
                    echo "🔄 Updating GitOps manifests..."
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        bat '''
                            if exist gitops-temp rmdir /s /q gitops-temp || exit /b 0
                            
                            set "REPO_URL=https://%GITHUB_TOKEN%@github.com/imenH-cloud/devops-education-platform-gitops.git"
                            
                            git clone !REPO_URL! gitops-temp
                            cd gitops-temp
                            
                            echo Updating manifests...
                            for %%s in (activity auth classroom gateway parent student teacher user) do (
                                powershell -Command "(Get-Content 'kubernetes/backend/%%s-service.yaml') -replace 'image: .*', 'image: eline2016/devopspfe-%%s-service:%BUILD_NUMBER%' | Set-Content 'kubernetes/backend/%%s-service.yaml'"
                            )
                            
                            powershell -Command "(Get-Content 'kubernetes/frontend/frontend-app.yaml') -replace 'image: .*', 'image: eline2016/devopspfe-frontend-app:%BUILD_NUMBER%' | Set-Content 'kubernetes/frontend/frontend-app.yaml'"
                            
                            git config user.email "jenkins@devops.local"
                            git config user.name "Jenkins CI/CD"
                            git add .
                            git commit -m "Build %BUILD_NUMBER% - update Docker images" || exit /b 0
                            git push origin main
                            
                            cd ..
                            rmdir /s /q gitops-temp
                            echo ✅ GitOps manifests updated
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
            echo "📤 Images pushed: eline2016/devopspfe-*:${BUILD_NUMBER}"
            echo "🔄 GitOps: Updated"
        }
        
        failure {
            echo "❌ BUILD FAILED - Build #${BUILD_NUMBER}"
        }
    }
}
