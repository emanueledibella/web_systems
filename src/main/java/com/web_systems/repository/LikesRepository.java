package com.web_systems.repository;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;
import java.io.InputStream;
import java.util.Properties;

public class LikesRepository {
    
    private Connection connection;

    public LikesRepository() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Properties properties = new Properties();
            try (InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties")) {
                if (input == null) {
                    System.out.println("Sorry, unable to find application.properties");
                    return;
                }
                properties.load(input);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            String url = properties.getProperty("db.url");
            String username = properties.getProperty("db.username");
            String password = properties.getProperty("db.password");

            connection = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getLikesCount(int postId) {
        try {
            String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ?";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, postId);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            return rs.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public String insertLike(int userId, int postId) {
        try {
            String sql = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, postId);
            pstmt.executeUpdate();
            return "Like inserted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error inserting like.";
        }
    }

    public String deleteLike(int userId, int postId) {
        try {
            String sql = "DELETE FROM likes WHERE user_id = ? and post_id = ?";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, postId);
            pstmt.executeUpdate();
            return "Like deleted successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error deleting like.";
        }
    }
}
