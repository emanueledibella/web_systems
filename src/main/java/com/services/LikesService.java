package com.services;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class LikesService {
    
    private Connection connection;

    public LikesService() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/web_systems", "root", "password");
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
