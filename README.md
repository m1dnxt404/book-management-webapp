# 📚 Spring-Boot Book Management Application

This project is a **simple Spring Boot CRUD application** built to learn the **core fundamentals of Java, Spring Boot, Maven, REST APIs, and H2 database**.

> ⚠️ This version of the project is intentionally **BEFORE** adding:
>
> * Spring Security / JWT
> * Frontend UI
> * PostgreSQL

The goal is to master backend fundamentals **first**, following real-world learning order.

---

## 🎯 Project Goals

* Understand Spring Boot project structure
* Learn RESTful API design (CRUD)
* Practice HTTP methods using cURL
* Learn JPA & Hibernate basics
* Use H2 in-memory database
* Debug common backend errors (400, 404)

---

## 🧰 Tech Stack

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| Java 17         | Programming language          |
| Spring Boot     | Backend framework             |
| Spring Web      | REST APIs                     |
| Spring Data JPA | ORM / Database access         |
| H2 Database     | In-memory database            |
| Maven           | Build & dependency management |
| VS Code         | Code Editor                   |
| cURL            | API Testing                   |

#### 📌 Prerequisites

* VS Code (or any IDE)
  
  * Maven extension pack
  * Spring Boot extension pack

---

## 📂 Project Structure

```
bookcrud
├── .mvn/wrapper
|           └── maven-wrapper.properties
├── .vscode
│    ├── launch.json
│    └── settings.json
├── src/main/java
│    └── com/example/bookcrud
│                       ├── BookcrudApplication.java
│                       ├── controller
│                       ├── service
│                       ├── repository
│                       └── model
├── src/main/resources
│               ├── static
│               ├── templates
│               └── application.properties
├── .gitattributes
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml
```

---

## ▶ Running the Application

From the project root directory:

```cmd
mvn spring-boot:run
```

Expected output:

```
Tomcat started on port(s): 8080
Started BookcrudApplication
```

Application backend is now running URL:

```
http://localhost:8080
```

---

## 🔌 REST API Endpoints (No Authentication)

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/api/books`      | Create a new book |
| GET    | `/api/books`      | Get all books     |
| GET    | `/api/books/{id}` | Get book by ID    |
| PUT    | `/api/books/{id}` | Update a book     |
| DELETE | `/api/books/{id}` | Delete a book     |

---

## 🧪 Testing APIs Using cURL (CMD)

## ▶ Step 1: Start the Spring Boot Application

From the project root directory in cmd:

```cmd
mvn spring-boot:run
```

Wait until you see:

```text
Tomcat started on port(s): 8080
Started BookcrudApplication
```

Your backend is now running at:

```
http://localhost:8080
```

---

## 🔎 Step 2: Verify API Is Reachable (GET)

Check by putting this in the terminal or put the link in a browser:

```cmd
curl http://localhost:8080/api/books
```

Expected response (initially empty):

```json
[]
```

This will confirm:

* Server is running
* Controller is reachable

---
## ➕ Step 3: Create a Book (POST)

> ⚠ This command is **CMD-safe** 

```cmd
curl -X POST http://localhost:8080/api/books -H "Content-Type: application/json" -d "{ \"title\": \"Clean Code\", \"author\": \"Robert Martin\", \"yearPublished\":2023 }"
```

Expected response and check in link in a browser :

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert Martin",
  "yearPublished": 2023
}
```

## 📋 Step 4: View All Books (GET)

```cmd
curl http://localhost:8080/api/books
```

Expected response:

```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert Martin",
    "yearPublished": 2023
  }
]
```
---

## 🔍 Step 5: View Single Book by ID

```cmd
curl http://localhost:8080/api/books/1
```

---
## ✏ Step 6: Update Book (PUT)

```cmd
curl -X PUT http://localhost:8080/api/books/1 -H "Content-Type: application/json" -d "{ \"title\": \"Clean Code Updated\", \"author\": \"Uncle Bob\",\"yearPublished\": 2024 }"
```

---
## ❌ Step 7: Delete Book (DELETE)

```cmd
curl -X DELETE http://localhost:8080/api/books/1
```

Verify deletion:

```cmd
curl http://localhost:8080/api/books
```

Expected response:

```json
[]
```

## 🗄 Step 8 : H2 Database Access

### Enable H2 Console

In `application.properties`:

```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update
```

Restart the application.

---
## 🌐 Step 9 : Open H2 Database

Open browser:

```
http://localhost:8080/h2-console
```

### Login Details

| Field    | Value                |
| -------- | -------------------- |
| JDBC URL | `jdbc:h2:mem:testdb` |
| User     | `sa`                 |
| Password | *(blank)*            |

Click **Connect**.

---

## 🧾 Step 10 : Query Data in H2

```sql
SELECT * FROM BOOK;
```

You should see the same data created via cURL.

---
## ➕ Step 11 : Insert Data Directly in H2

```sql
INSERT INTO BOOK (ID, TITLE, AUTHOR, YEAR_PUBLISHED)
VALUES (10, 'Inserted via H2', 'Console User', 2022);
```

Verify via API:

```cmd
curl http://localhost:8080/api/books
```

---

## 🧠 Key Learning Concepts

* RESTful API design
* HTTP verbs & status codes
* JSON ↔ Java object binding
* JPA entity mapping
* H2 in-memory database behavior
* Debugging `400 Bad Request` issues
* How to test REST APIs using cURL
* How HTTP methods map to CRUD
* How Spring Boot + JPA persist data
* How to verify DB state using H2

---

## ⚠ Important Notes

* No authentication is implemented
* APIs are publicly accessible
* H2 data is lost when the app restarts
* This setup is **for learning only**, not production

---

## 🔜 Next Planned Enhancements

This project will be extended with:

1. Spring Security + JWT authentication
2. Frontend UI (HTML/CSS/JS or React)
3. PostgreSQL database integration
4. Unit & integration tests
5. Dockerize app

---

## ✅ Learning Philosophy

> *Build fundamentals first. Add complexity later.*

This repository represents the **correct starting point** for learning real-world Spring Boot backend development.

---

👨‍💻 Happy Coding!
