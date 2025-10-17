package com.example.graphql.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.example.graphql.model.Device;

public class DeviceDB {
    
    private Connection getConnection() throws SQLException {
        String url = "jdbc:postgresql://localhost:5432/microswarm";
        String user = "postgres";
        String password = "";
        return DriverManager.getConnection(url, user, password);
    }
    
    public Device addDevice(String id, String userId, String name) {
        String sql = "INSERT INTO devices (id, user_id, name) VALUES (?, ?, ?)";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, id);
            stmt.setString(2, userId);
            stmt.setString(3, name);
            stmt.executeUpdate();
            
            return new Device(id, name, userId);
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add device", e);
        }
    }
    
    public Device getDeviceById(String id) {
        String sql = "SELECT * FROM devices WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, id);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return new Device(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getString("user_id")
                );
            }
            return null;
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get device", e);
        }
    }
    
    
    public List<Device> getDevicesByUserId(String userId) {
        String sql = "SELECT * FROM devices WHERE user_id = ?";
        List<Device> devices = new ArrayList<>();
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                devices.add(new Device(
                    rs.getString("id"),
                    rs.getString("name"),
                    rs.getString("user_id")
                ));
            }
            return devices;
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get devices for user", e);
        }
    }
    
    public Device updateDevice(String id, String name) {
        String sql = "UPDATE devices SET name = ? WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, name);
            stmt.setString(2, id);
            stmt.executeUpdate();
            
            return this.getDeviceById(id);
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to update device", e);
        }
    }
    
    public Void deleteDevice(String id) {
        String sql = "DELETE FROM devices WHERE id = ?";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            stmt.executeUpdate();
            return null;

        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete device", e);
        }
    }
    
}
