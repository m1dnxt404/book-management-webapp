# Book CRUD Application – Enhancement Roadmap

This document outlines structured improvements that can transform the current Spring Boot + JWT + PostgreSQL project into a production-ready, portfolio-level application.

---

## 1. Security Enhancements

### Role-Based Access Control (RBAC) ✅

* ~~Introduce roles: `ADMIN`, `USER`~~ ✅
* ~~Restrict create/update/delete operations to ADMIN~~ ✅
* ~~Allow read-only access to USER~~ ✅
* ~~Implement method-level security using `@PreAuthorize`~~ ✅

### Refresh Token Mechanism ✅

* ~~Short-lived access tokens~~ ✅ (15 minutes)
* ~~Long-lived refresh tokens~~ ✅ (7 days, UUID, stored in `refresh_tokens` table)
* ~~Secure token renewal endpoint~~ ✅ (`POST /api/auth/refresh` with token rotation, `POST /api/auth/logout`)

### Password Security ✅

* ~~Use BCrypt hashing~~ ✅
* ~~Prevent storage of plain-text passwords~~ ✅

### Account Management Features

* Email verification
* Password reset flow
* Account lock after multiple failed attempts

### Production CORS Configuration

* Restrict allowed origins
* Remove wildcard `@CrossOrigin`

---

## 2. Backend Improvements

### Pagination ✅

~~Improves scalability and performance.~~ ✅ (Spring Data `Pageable` + frontend Previous/Next controls)

### Search Endpoint ✅

~~Full-text search across title, author, and year.~~ ✅ (`/api/books/search?keyword=X`)

### Sorting & Filtering

```text
GET /api/books?sort=year,desc
GET /api/books?author=Martin
```

### DTO Architecture (Partial) ⏳

* ~~Separate Entity from Request/Response DTO~~ ✅ (LoginRequest, RegisterRequest exist)
* Prevent exposing internal database structure (Book DTOs still needed)

### Global Exception Handling

* Use `@ControllerAdvice`
* Standardize error responses

Example:

```json
{
  "timestamp": "...",
  "status": 404,
  "message": "Book not found"
}
```

### Logging

* Use SLF4J + Logback
* Structured logging for production

---

## 3. Testing Enhancements

### Unit Tests

* Service layer testing
* Mock repository with Mockito

### Integration Tests

* Test REST endpoints using MockMvc

### TestContainers

* Run PostgreSQL container during tests
* Ensure real database validation

---

## 4. Frontend Improvements

### Role-Based UI

* Hide add/edit/delete controls for USER role
* Show full controls for ADMIN role

### Protected Routes ✅

* ~~Redirect to login if token missing~~ ✅

### UI Framework

* TailwindCSS
* Material UI
* Chakra UI

---

## 5. DevOps & Deployment

### Dockerization ✅

* ~~Backend container~~ ✅
* ~~PostgreSQL container~~ ✅
* ~~Docker Compose orchestration~~ ✅ (with health check, named volume, Spring profile)
* ~~pgAdmin container~~ ✅ (accessible at port 5050)

### CI/CD Pipeline

* GitHub Actions
* Run tests on push
* Auto-build and deploy

### Cloud Deployment

* AWS
* Azure
* GCP
* Render
* Railway

---

## 6. Advanced Architecture Enhancements

### Swagger / OpenAPI

* Auto-generated API documentation
* Accessible at `/swagger-ui.html`

### Caching

* Redis integration
* Cache frequently accessed books

### Rate Limiting

* Prevent API abuse

### Audit Logging

* Track updates and deletions
* Store user and timestamp

### Soft Delete

* Add `is_deleted` flag instead of hard delete

---

## 7. Enterprise-Level Upgrades

### Microservices Architecture

Split into:

* Auth Service
* Book Service

### Message Queue

* RabbitMQ
* Kafka

### Monitoring & Metrics

* Spring Boot Actuator
* Prometheus
* Grafana

---

## Recommended Upgrade Order

1. ~~RBAC~~ ✅
2. ~~Docker~~ ✅
3. ~~Refresh Token Mechanism~~ ✅
4. DTO + Global Exception Handling
5. Swagger
6. Unit & Integration Tests
7. Cloud Deployment

---

## Production-Ready Target

To elevate this project to a professional level, aim to include:

* ~~JWT~~ ✅ + ~~Refresh Tokens~~ ✅
* ~~RBAC Authorization~~ ✅
* ~~DTO Layer~~ ⏳ (partial — auth DTOs done, book DTOs needed)
* ~~Pagination~~ ✅ & ~~Search~~ ✅
* Global Error Handling
* Swagger Documentation
* ~~Dockerized Deployment~~ ✅
* Automated Tests
* Live Deployment

This roadmap transforms the application from a basic CRUD system into a secure, scalable, production-style full-stack project.
