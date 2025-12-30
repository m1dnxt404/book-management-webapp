const API_URL = "http://localhost:8080/api/books";

const tableBody = document.getElementById("bookTable");
const form = document.getElementById("bookForm");

const bookIdField = document.getElementById("bookId");
const titleField = document.getElementById("title");
const authorField = document.getElementById("author");
const yearField = document.getElementById("yearPublished");

const TOKEN_KEY = 'jwtToken';

// =====================
// LOGIN FUNCTION TO ADD TOKEN TO REQUESTS
// =====================
function secureFetch(url, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        alert("Please login first");
        return Promise.reject();
    }

    options.headers = {
        ...options.headers,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    return fetch(url, options);

}

// =====================
// LOGIN FORM HANDLING
// =====================
loginForm.addEventListener('submit', e => {
    e.preventDefault();

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
    .then(res => res.text())
    .then(token => {
        localStorage.setItem(TOKEN_KEY, token);
        alert("Login successful");
        loadBooks();
    })
    .catch(() => alert("Login failed"));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// =====================
// FETCH ALL BOOKS
// =====================
window.onload = loadBooks;


function loadBooks() {
    secureFetch(API_URL)
        .then(res => res.json())
        .then(data => {
            table.innerHTML = '';
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.yearPublished}</td>
                    <td>
                        <button onclick="editBook(${book.id})">✏ Edit</button>
                        <button onclick="deleteBook(${book.id})">❌ Delete</button>
                    </td>
                `;
                table.appendChild(row);
            });
        });
}


// =====================
// CREATE / UPDATE
// =====================
form.addEventListener('submit', e => {
    e.preventDefault();


    const id = bookIdField.value;
    const book = {
        title: titleField.value,
        author: authorField.value,
        yearPublished: parseInt(yearField.value)
    };

    if (id) {
        // UPDATE
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        }).then(() => {
            resetForm();
            fetchBooks();
        });
    } else {
        // CREATE
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        }).then(() => {
            resetForm();
            fetchBooks();
        });
    }
});


// =====================
// EDIT BOOK
// =====================
function editBook(id) {
    secureFetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(book => {
            bookIdField.value = book.id;
            titleField.value = book.title;
            authorField.value = book.author;
            yearField.value = book.yearPublished;
        });
}


// =====================
// DELETE BOOK WITH CONFIRMATION
// =====================
function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        secureFetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => loadBooks());
    }

// =====================
// RESET FORM
// =====================
function resetForm() {
    bookIdField.value = "";
    form.reset();
}
}