package edu.sabanciuniv.cs308.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private static final String URL = "jdbc:mysql://shopapp.clkea8a0k0wm.eu-north-1.rds.amazonaws.com:3306/shopapp";
    private static final String USER = "admin02";
    private static final String PASSWORD = "Gathie.shopapp02";

    public static Connection connect() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connection successful!");
        } catch (SQLException e) {
            System.out.println("Connection failed.");
            e.printStackTrace();
        }
        return conn;
    }

    public static void main(String[] args) {
        connect();
    }
}
