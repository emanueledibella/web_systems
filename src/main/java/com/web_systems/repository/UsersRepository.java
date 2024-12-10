package com.web_systems.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.apache.commons.codec.digest.DigestUtils;
import org.json.JSONObject;

public class UsersRepository {

    private Connection connection;

    public UsersRepository() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/web_systems", "root", "password");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public String createUser(String name, String surname, int gender, String email, String password) {
        try {
            String sql = "INSERT INTO users (name, surname, gender, email, password) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement pstmt = this.connection.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, surname);
            pstmt.setInt(3, gender);
            pstmt.setString(4, email);
            pstmt.setString(5, password);
            String hashedPassword = DigestUtils.md5Hex(password);
            pstmt.setString(5, hashedPassword);
            pstmt.executeUpdate();
            return "User created successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating user.";
        }
    }

    public String getUser(int id) {
        try {
            String sql = "SELECT * FROM users WHERE id = ?";
            PreparedStatement pstmt = this.connection.prepareStatement(sql);
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            JSONObject userJson = new JSONObject();
            if (rs.next()) {
                userJson.put("id", rs.getInt("id"));
                userJson.put("name", rs.getString("name"));
                userJson.put("surname", rs.getString("surname"));
                userJson.put("gender", rs.getInt("gender"));
                userJson.put("email", rs.getString("email"));
                userJson.put("password", rs.getString("password"));
                return userJson.toString();
            }
            return "User not found.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error getting user.";
        }
    }

    public String updateUser(int id, String name, String surname, int gender, String email, String password) {
        try {
            String sql = "UPDATE users SET name = ?, surname = ?, gender = ?, email = ?";
            if (password != null) {
                sql += ", password = ?";
            }
            sql += " WHERE id = ?";
            PreparedStatement pstmt = this.connection.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, surname);
            pstmt.setInt(3, gender);
            pstmt.setString(4, email);
            if (password != null) {
                String hashedPassword = DigestUtils.md5Hex(password);
                pstmt.setString(5, hashedPassword);
                pstmt.setInt(6, id);
            } else {
                pstmt.setInt(5, id);
            }
            pstmt.executeUpdate();
            return "User updated successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error updating user.";
        }
    }
}
