package com.web_systems.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.io.InputStream;
import java.util.Properties;

public class PostsRepository {

    private Connection connection;
    private LikesRepository likesRepository = new LikesRepository();
    private CommentsRepository commentsRepository = new CommentsRepository();

    public PostsRepository() {
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

    public String createPost(int userId, String title, String content, String image) {
        try {
            String created_at = new java.util.Date().toString();
            String sql = "INSERT INTO posts (user_id, title, content, image, created_at) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, userId);
            pstmt.setString(2, title);
            pstmt.setString(3, content);
            pstmt.setString(4, image);
            pstmt.setString(5, created_at);
            pstmt.executeUpdate();
            return "Post created successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating post.";
        }
    }

    public String getPosts(int offset, String search) {
        try {
            String sql;
            sql = "SELECT * FROM posts INNER JOIN users ON users.id = posts.user_id ORDER BY created_at DESC LIMIT 10 OFFSET " + offset;
            if (search != null) {
                sql = "SELECT * FROM posts INNER JOIN users ON users.id = posts.user_id WHERE title LIKE '%" + search + "%' OR content LIKE '%" + search + "%' ORDER BY created_at DESC LIMIT 5";
            }
            PreparedStatement pstmt = connection.prepareStatement(sql);
            ResultSet rs = pstmt.executeQuery();

            StringBuilder xmlResult = new StringBuilder();
            xmlResult.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            xmlResult.append("<Posts>");

            while (rs.next()) {
                String authorName = rs.getString("name") + " " + rs.getString("surname");
                String profileImage = rs.getString("image");
                int likesCount = likesRepository.getLikesCount(rs.getInt("id"));

                xmlResult.append("<Post>");
                xmlResult.append("<Id>").append(rs.getInt("id")).append("</Id>");
                xmlResult.append("<AuthorName>").append(authorName).append("</AuthorName>");
                xmlResult.append("<ProfileImage>").append(profileImage).append("</ProfileImage>");
                xmlResult.append("<DateTime>").append(rs.getTimestamp("created_at").toInstant().toString()).append("</DateTime>");
                xmlResult.append("<PostTitle>").append(rs.getString("title")).append("</PostTitle>");
                xmlResult.append("<MessageText>").append(rs.getString("content")).append("</MessageText>");
                xmlResult.append("<MessageImage>").append(rs.getString("image")).append("</MessageImage>");
                xmlResult.append("<Likes>").append(likesCount).append("</Likes>");
                //comments
                xmlResult.append(this.commentsRepository.getComments(rs.getInt("id")));
                xmlResult.append("</Post>");
            }

            xmlResult.append("</Posts>");
            return xmlResult.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error retrieving posts.";
        }
    }

    public String getPost(int postId) {
        try {
            String sql = "SELECT * FROM posts INNER JOIN users ON users.id = posts.user_id WHERE posts.id = ?";
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, postId);
            ResultSet rs = pstmt.executeQuery();

            StringBuilder xmlResult = new StringBuilder();
            xmlResult.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            xmlResult.append("<Post>");

            if (rs.next()) {
                String authorName = rs.getString("name") + " " + rs.getString("surname");
                String profileImage = rs.getString("image");
                int likesCount = likesRepository.getLikesCount(rs.getInt("id"));

                xmlResult.append("<Id>").append(rs.getInt("id")).append("</Id>");
                xmlResult.append("<AuthorName>").append(authorName).append("</AuthorName>");
                xmlResult.append("<ProfileImage>").append(profileImage).append("</ProfileImage>");
                xmlResult.append("<DateTime>").append(rs.getTimestamp("created_at").toInstant().toString()).append("</DateTime>");
                xmlResult.append("<PostTitle>").append(rs.getString("title")).append("</PostTitle>");
                xmlResult.append("<MessageText>").append(rs.getString("content")).append("</MessageText>");
                xmlResult.append("<MessageImage>").append(rs.getString("image")).append("</MessageImage>");
                xmlResult.append("<Likes>").append(likesCount).append("</Likes>");
                //comments
                xmlResult.append(this.commentsRepository.getComments(rs.getInt("id")));
            }

            xmlResult.append("</Post>");
            return xmlResult.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error retrieving post.";
        }
    }
}
