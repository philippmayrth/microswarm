package com.example.graphql.model;

import java.util.List;

public class User {
    private String id;
    private String email;
    private List<Device> devices;

    public User() {
    }

    public User(String id, String email, List<Device> devices) {
        this.id = id;
        this.email = email;
        this.devices = devices;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public List<Device> getDevices() {
        return devices;
    }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }

}
