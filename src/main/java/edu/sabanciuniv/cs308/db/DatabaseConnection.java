package edu.sabanciuniv.cs308.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private static final String URL = "jdbc:mysql://shopapp.clkea8a0k0wm.eu-north-1.rds.amazonaws.com:3306/shopapp";
    private static final String USER = "admin02";
    private static final String PASSWORD = "Gathie.shopapp02";

    // Method to establish a connection to the database
    public static Connection connect() throws SQLException {
        try {
            // Load the JDBC driver (optional in newer versions)
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Return the connection to the MySQL database
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            // Handle the error if JDBC Driver is not found
            throw new SQLException("MySQL JDBC Driver not found.", e);
        }
    }
}
