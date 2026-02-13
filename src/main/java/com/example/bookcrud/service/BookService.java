package com.example.bookcrud.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.bookcrud.model.Book;
import com.example.bookcrud.repository.BookRepository;


@Service
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Book createBook(Book book) {
        return repository.save(book);
    }

    // READ ALL
    public List<Book> getAllBooks() {
        return repository.findAll();
    }

    // READ ALL (paginated)
    public Page<Book> getBooks(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }

    // READ ONE
    public Optional<Book> getBookById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Optional<Book> updateBook(Long id, Book updatedBook) {
        return repository.findById(id).map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setYearPublished(updatedBook.getYearPublished());
            return repository.save(book);
        });
    }

    // DELETE
    public boolean deleteBook(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}