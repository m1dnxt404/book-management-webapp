package com.example.bookcrud;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.bookcrud.model.User;
import com.example.bookcrud.repository.UserRepository;

@SpringBootApplication
public class BookcrudApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookcrudApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("password"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Default admin user created (admin/password)");
			}
		};
	}
}
