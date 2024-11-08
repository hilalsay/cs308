package edu.sabanciuniv.cs308;

import edu.sabanciuniv.cs308.db.DatabaseConnection;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication
public class Cs308Application {

	public static void main(String[] args) {
		SpringApplication.run(Cs308Application.class, args);

		try {
			// Establish the database connection
			Connection conn = DatabaseConnection.connect();

			if (conn != null) {
				System.out.println("Connected to the database!");
			} else {
				System.out.println("Failed to connect to the database.");
			}
		} catch (SQLException e) {
			// Handle SQLException
			System.out.println("Error during database connection: " + e.getMessage());
			e.printStackTrace();
		}
	}
}
