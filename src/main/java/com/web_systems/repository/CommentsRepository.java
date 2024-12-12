package com.web_systems.repository;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;
import java.io.InputStream;
import java.util.Properties;

public class CommentsRepository {
    
    private Connection connection;

    public CommentsRepository() {
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

    public String createComment(int userId, int postId, String content, String image) {
        try {
            String created_at = new java.util.Date().toString();
            String sql = "INSERT INTO comments (user_id, post_id, content, comment_image, created_at) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setInt(2, postId);
            pstmt.setString(3, content);
            pstmt.setString(4, image);
            pstmt.setString(5, created_at);
            pstmt.executeUpdate();
            return "Comment created successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating comment.";
        }
    }

    public String getComments(int postId) {
        try {
            String sql = "SELECT * FROM comments INNER JOIN users ON users.id = comments.user_id WHERE post_id = ?";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, postId);
            ResultSet rs = pstmt.executeQuery();

            StringBuilder xmlResult = new StringBuilder();
            xmlResult.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            xmlResult.append("<Comments>");

            while (rs.next()) {
                String authorName = rs.getString("name") + " " + rs.getString("surname");
                String profileImage = rs.getString("image");
                xmlResult.append("<Comment>");
                xmlResult.append("<Id>").append(rs.getInt("id")).append("</Id>");
                xmlResult.append("<CommentAuthorName>").append(authorName).append("</CommentAuthorName>");
                xmlResult.append("<CommentProfileImage>").append(profileImage).append("</CommentProfileImage>");
                xmlResult.append("<CommentText>").append(rs.getString("content")).append("</CommentText>");
                xmlResult.append("<CommentImage>").append(rs.getString("comment_image")).append("</CommentImage>");
                xmlResult.append("<CommentDateTime>").append(rs.getString("created_at")).append("</CommentDateTime>");
                xmlResult.append("<CommentLikes>").append(rs.getInt("comment_likes")).append("</CommentLikes>");
                xmlResult.append("</Comment>");
            }

            xmlResult.append("</Comments>");
            return xmlResult.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error getting comments.";
        }
    }
}
