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
* PostgreSQL *(only when switching from H2)*

---

## Project Structure

```text
bookcrud/
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
│   └── application.properties
├── pom.xml
└── README.md
```

---

## Running the Application

From the project root directory:

```cmd
mvn spring-boot:run
```

Wait until you see:

```cmd
Tomcat started on port 8080 (http) with context path '/'
Started BookcrudApplication
```

Open in browser:

```text
http://localhost:8080
```

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

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/api/books`      | Create a new book |
| GET    | `/api/books`      | Get all books     |
| GET    | `/api/books/{id}` | Get book by ID    |
| PUT    | `/api/books/{id}` | Update a book     |
| DELETE | `/api/books/{id}` | Delete a book     |

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

### Step 4: Get all books

```cmd
curl http://localhost:8080/api/books -H "Authorization: Bearer YOUR_TOKEN"
```

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

The H2 in-memory database console is available for development.

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

## Switching to PostgreSQL (Production)

When ready to use PostgreSQL for persistent storage:

1. Install and start PostgreSQL
2. Create the database:

   ```sql
   CREATE DATABASE bookdb;
   ```

3. In `pom.xml`, uncomment the PostgreSQL dependency and comment out H2

4. In `application.properties`, uncomment the PostgreSQL config and comment out H2:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bookdb
   spring.datasource.username=postgres
   spring.datasource.password=password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```

5. Restart the application

---

## Important Notes

* JWT tokens expire after 1 hour
* H2 is used for testing (data resets on restart); switch to PostgreSQL for production
* Passwords are hashed with BCrypt (never stored in plain text)
* A default admin user is seeded on startup
* This setup is **for learning only**, not production

---

## Next Planned Enhancements

1. Role-based access control (admin vs user permissions)
2. Unit & integration tests
3. Dockerize app

---

## Learning Philosophy

> *Build fundamentals first. Add complexity later.*
