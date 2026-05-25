# DevOps PFE - Main Repository

**Microservices-based Education Platform** with Angular Frontend and NestJS Backend.

## 📋 Overview

Complete working application with:
- **Frontend**: Angular 17
- **Backend**: 8 NestJS microservices (Gateway, Auth, User, Parent, Student, Classroom, Activity, Teacher)
- **Database**: PostgreSQL
- **API**: RESTful architecture

## 📁 Repository Structure

```
devopsPFE-main/
├── backend/                    # NestJS microservices
│   ├── gateway/               # API Gateway
│   ├── auth/                  # Authentication Service
│   ├── user/                  # User Management
│   ├── parent/                # Parent Management
│   ├── student/               # Student Management
│   ├── classroom/             # Classroom Management
│   ├── activity/              # Activity Management
│   └── teacher/               # Teacher Management
├── frontend/                  # Angular Application
│   ├── app/                   # Application modules
│   ├── src/
│   └── nginx.conf             # Production Nginx config
├── docker-compose/            # Docker Compose configs
│   └── docker-compose.yml     # Local development stack
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Option 1: Local Development (Docker Compose)

```bash
# Navigate to docker-compose directory
cd docker-compose

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# API Gateway: http://localhost:3000
```

### Option 2: Build Services Locally

```bash
# Install Node.js dependencies for backend services
cd backend/gateway && npm install

# Install Node.js dependencies for frontend
cd frontend && npm install && npm run build

# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=education_db \
  -e POSTGRES_USER=education \
  -e POSTGRES_PASSWORD=education \
  -p 5432:5432 \
  postgres:15-alpine

# Start services
npm start  # in each service
```

## 📚 Services

### Backend Microservices

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 3000 | API Gateway routing all requests |
| Auth | 3001 | Authentication & Authorization |
| User | 3002 | User Management |
| Activity | 3003 | Activity Management |
| Parent | 3004 | Parent Management |
| Student | 3005 | Student Management |
| Classroom | 3006 | Classroom Management |
| Teacher | 3007 | Teacher Management |

### Frontend

| Component | Port | Description |
|-----------|------|-------------|
| Nginx | 80 | Serves Angular application |

## 🔐 Default Credentials

```
Email: admin@school.com
Password: admin12345
```

## 📦 API Documentation

API documentation available at:
- Swagger UI: `http://localhost:3000/api`

## 🏗️ Production Deployment

For production Kubernetes deployment, see **devopsPFE-gitops** repository.

## 🛠️ Technology Stack

### Backend
- NestJS 10
- TypeORM
- PostgreSQL 15
- Passport.js
- Class Validator

### Frontend
- Angular 17
- TypeScript
- Tailwind CSS
- RxJS

### DevOps
- Docker & Docker Compose
- Kubernetes (K8s)
- ArgoCD (GitOps)

## 📝 Environment Variables

Create `.env` file in each service:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=education
DB_PASSWORD=education
DB_NAME=education_db

# API Gateway
PORT=3000
GATEWAY_URL=http://localhost:3000

# Frontend
API_URL=http://localhost:3000/api
```

## 📖 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💼 Project Information

- **Project**: DevOps PFE
- **Platform**: Education Management System
- **Version**: 1.0.0
- **Status**: Production Ready
