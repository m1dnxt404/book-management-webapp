const API_URL = "/api/books";
const TOKEN_KEY = "jwtToken";

let allBooks = [];
let editingId = null;

// =====================
// AUTHENTICATED FETCH
// =====================
function secureFetch(url, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        showLoginPage();
        return Promise.reject("Not authenticated");
    }

    options.headers = {
        ...options.headers,
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };

    return fetch(url, options).then(res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem(TOKEN_KEY);
            showLoginPage();
            return Promise.reject("Session expired");
        }
        return res;
    });
}

// =====================
// PAGE SWITCHING
// =====================
function showDashboard() {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("dashboardPage").classList.add("active");
    loadAllBooks();
}

function showLoginPage() {
    document.getElementById("dashboardPage").classList.remove("active");
    document.getElementById("loginPage").classList.add("active");
}

// =====================
// LOGIN
// =====================
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");

    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (!res.ok) throw new Error("Invalid credentials");
            return res.text();
        })
        .then(token => {
            errorDiv.textContent = "";
            localStorage.setItem(TOKEN_KEY, token);
            showDashboard();
        })
        .catch(() => {
            errorDiv.textContent = "Invalid username or password";
        });
});

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").textContent = "";
    showLoginPage();
}

// =====================
// FORM TOGGLE (Login / Register)
// =====================
function showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("showLoginBtn").classList.add("toggle-active");
    document.getElementById("showRegisterBtn").classList.remove("toggle-active");
    document.getElementById("registerMessage").textContent = "";
    document.getElementById("loginError").textContent = "";
}

function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("showRegisterBtn").classList.add("toggle-active");
    document.getElementById("showLoginBtn").classList.remove("toggle-active");
    document.getElementById("registerMessage").textContent = "";
    document.getElementById("loginError").textContent = "";
}

// =====================
// REGISTER
// =====================
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const messageDiv = document.getElementById("registerMessage");

    if (password !== confirmPassword) {
        messageDiv.textContent = "Passwords do not match";
        messageDiv.className = "error";
        return;
    }

    if (username.length < 3) {
        messageDiv.textContent = "Username must be at least 3 characters";
        messageDiv.className = "error";
        return;
    }

    if (password.length < 4) {
        messageDiv.textContent = "Password must be at least 4 characters";
        messageDiv.className = "error";
        return;
    }

    fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
            return res.text();
        })
        .then(() => {
            messageDiv.textContent = "Registration successful! You can now log in.";
            messageDiv.className = "success";
            document.getElementById("registerForm").reset();
            setTimeout(() => showLoginForm(), 2000);
        })
        .catch(err => {
            messageDiv.textContent = err.message || "Registration failed";
            messageDiv.className = "error";
        });
});

// =====================
// LOAD ALL BOOKS
// =====================
function loadAllBooks() {
    secureFetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allBooks = data;
            displayBooks(allBooks);
        })
        .catch(() => {});
}

// =====================
// SEARCH (client-side filter)
// =====================
function searchBooks() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    displayBooks(filtered);
}

// =====================
// DISPLAY BOOKS AS CARDS
// =====================
function displayBooks(books) {
    const container = document.getElementById("booksContainer");

    if (books.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No books found</h3>
                <p>Start by adding your first book above</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="books-grid">
            ${books.map(book => `
                <div class="book-card">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Year:</strong> ${book.yearPublished}</p>
                    <p style="color: #999; font-size: 12px;">ID: ${book.id}</p>
                    <div class="actions">
                        <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

// =====================
// CREATE / UPDATE
// =====================
document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("bookId").value;
    const book = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        yearPublished: parseInt(document.getElementById("yearPublished").value)
    };

    if (id) {
        secureFetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(book)
        })
            .then(() => {
                showMessage("Book updated successfully!", "success");
                cancelEdit();
                loadAllBooks();
            })
            .catch(() => {});
    } else {
        secureFetch(API_URL, {
            method: "POST",
            body: JSON.stringify(book)
        })
            .then(() => {
                showMessage("Book added successfully!", "success");
                document.getElementById("bookForm").reset();
                loadAllBooks();
            })
            .catch(() => {});
    }
});

// =====================
// EDIT BOOK
// =====================
function editBook(id) {
    const book = allBooks.find(b => b.id === id);
    if (book) {
        editingId = id;
        document.getElementById("bookId").value = id;
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("yearPublished").value = book.yearPublished;
        document.getElementById("formTitle").textContent = "Edit Book";
        document.getElementById("submitBtn").textContent = "Update Book";
        document.getElementById("cancelBtn").style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// =====================
// DELETE BOOK
// =====================
function deleteBook(id) {
    if (confirm("Are you sure you want to delete this book?")) {
        secureFetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => {
                showMessage("Book deleted successfully!", "success");
                loadAllBooks();
            })
            .catch(() => {});
    }
}

// =====================
// CANCEL EDIT / RESET FORM
// =====================
function cancelEdit() {
    editingId = null;
    document.getElementById("bookId").value = "";
    document.getElementById("bookForm").reset();
    document.getElementById("formTitle").textContent = "Add New Book";
    document.getElementById("submitBtn").textContent = "Add Book";
    document.getElementById("cancelBtn").style.display = "none";
}

// =====================
// STATUS MESSAGE
// =====================
function showMessage(message, type) {
    const messageDiv = document.getElementById("formMessage");
    messageDiv.textContent = message;
    messageDiv.className = type;
    setTimeout(() => {
        messageDiv.textContent = "";
        messageDiv.className = "";
    }, 3000);
}

// =====================
// SEARCH ON ENTER KEY
// =====================
document.getElementById("searchInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchBooks();
    }
});

// =====================
// ON PAGE LOAD - auto-login if token exists
// =====================
window.onload = function () {
    if (localStorage.getItem(TOKEN_KEY)) {
        showDashboard();
    }
};
