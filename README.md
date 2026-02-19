# Spring-Boot Book Management Application

A **Spring Boot CRUD web application** with **JWT authentication**, **user registration**, and a **frontend UI**, built to learn Java, Spring Boot, Spring Security, REST APIs, and database integration.

---

## Tech Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| Java 25           | Programming language          |
| Spring Boot 4.0.1 | Backend framework             |
| Spring Security   | Authentication & authorization|
| BCrypt            | Password hashing              |
| JWT (JJWT)        | Token-based authentication    |
| Spring Data JPA   | ORM / Database access         |
| H2 Database       | In-memory database (testing)  |
| PostgreSQL        | Persistent database (prod)    |
| Maven             | Build & dependency management |
| HTML / CSS / JS   | Frontend UI                   |
| VS Code           | Code editor                   |

### Prerequisites

* Java 25
* Maven
* VS Code (or any IDE)
  * Maven extension pack
  * Spring Boot extension pack
* Docker & Docker Compose *(for containerized deployment)*
* PostgreSQL *(only when switching from H2 locally)*

---

## Project Structure

```text
book-management-webapp/
├── src/main/java/com/example/bookcrud/
│   ├── BookcrudApplication.java
│   ├── controller/
│   │   ├── AuthController.java        # Login & registration endpoints
│   │   └── BookController.java        # Book CRUD endpoints
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   ├── model/
│   │   ├── Book.java                  # Book entity
│   │   └── User.java                  # User entity
│   ├── repository/
│   │   ├── BookRepository.java
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtFilter.java             # JWT authentication filter
│   │   ├── JwtUtil.java               # JWT token generation/parsing
│   │   └── SecurityConfig.java        # Spring Security configuration
│   └── service/
│       ├── BookService.java
│       └── UserService.java          # Registration & authentication
├── src/main/resources/
│   ├── static/
│   │   ├── index.html                 # Frontend UI
│   │   ├── style.css
│   │   └── app.js
│   ├── application.properties         # Default config (H2, dev)
│   └── application-docker.properties # Docker profile config (PostgreSQL)
├── Dockerfile                         # Multi-stage build (JDK build → JRE run)
├── docker-compose.yml                 # App + PostgreSQL containers
├── .dockerignore
├── pom.xml
└── README.md
```

---

## Running the Application

### Option 1: Docker (recommended)

Starts the app and a PostgreSQL database together. Data persists across restarts.

```bash
docker-compose up --build
```

Wait until you see:

```log
Started BookcrudApplication
```

Open in browser: `http://localhost:8080`

To stop and remove containers:

```bash
docker-compose down
```

To also remove the database volume (wipes all data):

```bash
docker-compose down -v
```

### Option 2: Local (H2 in-memory)

Requires Java 25 and Maven. Data is lost on restart.

```bash
mvn spring-boot:run
```

Wait until you see:

```log
Tomcat started on port 8080 (http) with context path '/'
Started BookcrudApplication
```

Open in browser: `http://localhost:8080`

---

## Authentication

The app uses **JWT (JSON Web Token)** authentication with **BCrypt password hashing**. All `/api/books` endpoints require a valid token.

A default admin user is seeded on startup. New users can register through the UI or API.

### Default Admin Credentials

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `password` |

### Login Flow

1. Open `http://localhost:8080` in your browser
2. Enter `admin` / `password` on the login page (or register a new account)
3. The app stores the JWT token and redirects to the dashboard
4. All API requests automatically include the token

### Registration Flow

1. Click the **Register** toggle on the login page
2. Enter a username, password, and confirm password
3. On success, you are switched back to the login form
4. Log in with your new credentials

---

## REST API Endpoints

### Public (no auth required)

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/login`    | Login, returns JWT      |
| POST   | `/api/auth/register` | Register a new user     |

### Protected (JWT required)

| Method | Endpoint          | Description                |
| ------ | ----------------- | -------------------------- |
| POST   | `/api/books`      | Create a new book          |
| GET    | `/api/books`      | Get all books (paginated)  |
| GET    | `/api/books/{id}` | Get book by ID             |
| PUT    | `/api/books/{id}` | Update a book              |
| DELETE | `/api/books/{id}` | Delete a book              |

---

## Testing APIs Using cURL

### Step 1: Register a new user (optional)

```cmd
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{ \"username\": \"myuser\", \"password\": \"mypass\" }"
```

### Step 2: Login and get a token

```cmd
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{ \"username\": \"admin\", \"password\": \"password\" }"
```

Save the returned token. Use it in all subsequent requests as shown below.

### Step 3: Create a book

```cmd
curl -X POST http://localhost:8080/api/books -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{ \"title\": \"Clean Code\", \"author\": \"Robert Martin\", \"yearPublished\": 2008 }"
```

### Step 4: Get all books (paginated)

```cmd
curl http://localhost:8080/api/books -H "Authorization: Bearer YOUR_TOKEN"
```

With pagination parameters:

```cmd
curl "http://localhost:8080/api/books?page=0&size=5" -H "Authorization: Bearer YOUR_TOKEN"
```

| Parameter | Default | Description              |
| --------- | ------- | ------------------------ |
| `page`    | `0`     | Page number (zero-based) |
| `size`    | `10`    | Items per page           |

### Step 5: Get a book by ID

```cmd
curl http://localhost:8080/api/books/1 -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 6: Update a book

```cmd
curl -X PUT http://localhost:8080/api/books/1 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{ \"title\": \"Clean Code Updated\", \"author\": \"Uncle Bob\", \"yearPublished\": 2024 }"
```

### Step 7: Delete a book

```cmd
curl -X DELETE http://localhost:8080/api/books/1 -H "Authorization: Bearer YOUR_TOKEN"
```

---

## H2 Database Console

The H2 in-memory database console is available in local dev mode only (`mvn spring-boot:run`). It is disabled when running via Docker.

Open in browser:

```text
http://localhost:8080/h2-console
```

### Login Details

| Field    | Value              |
| -------- | ------------------ |
| JDBC URL |`jdbc:h2:mem:bookdb`|
| User     | `sa`               |
| Password | *(blank)*          |

### Example Queries

```sql
SELECT * FROM BOOK;
SELECT * FROM USERS;
```

```sql
INSERT INTO BOOK (ID, TITLE, AUTHOR, YEAR_PUBLISHED)
VALUES (10, 'Inserted via H2', 'Console User', 2022);
```

> H2 data is lost when the app restarts.

---

## Docker Setup

The app is fully containerized using Docker Compose. The Docker setup uses **PostgreSQL** with a named volume (`BookCRUDpostgres_data`) so data persists across restarts.

### Services

| Service    | Image              | Port | Description             |
| ---------- | ------------------ | ---- | ----------------------- |
| `app`      | Built from source  | 8080 | Spring Boot application |
| `postgres` | postgres:16-alpine | 5432 | PostgreSQL database     |

### How It Works

* `Dockerfile` — Multi-stage build: Maven + JDK 25 builds the JAR; JRE 25 runs it (smaller final image)
* `docker-compose.yml` — Orchestrates both containers; app waits for PostgreSQL health check before starting
* `application-docker.properties` — Activated via `SPRING_PROFILES_ACTIVE=docker`; switches to PostgreSQL and disables the H2 console

### Common Commands

| Command                        | Description                              |
| ------------------------------ | ---------------------------------------- |
| `docker-compose up --build`    | Build and start both containers          |
| `docker-compose up`            | Start without rebuilding                 |
| `docker-compose down`          | Stop and remove containers               |
| `docker-compose down -v`       | Stop containers and delete the DB volume |
| `docker-compose logs -f app`   | Stream app container logs                |

---

## Important Notes

* JWT tokens expire after 1 hour
* H2 is used for local dev (data resets on restart); Docker uses PostgreSQL with persistent storage
* Passwords are hashed with BCrypt (never stored in plain text)
* A default admin user is seeded on startup (`admin` / `password`)
* The H2 console is disabled when running via Docker
* This setup is **for learning only**, not production

---

## Next Planned Enhancements

1. Role-based access control (admin vs user permissions)
2. Unit & integration tests
3. Cloud deployment (AWS / Render / Azure)

---

## Learning Philosophy

> *Build fundamentals first. Add complexity later.*
