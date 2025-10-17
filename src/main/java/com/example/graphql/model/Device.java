package com.example.graphql.model;

public class Device {
    
    private String id;
    private String name;
    private String userId;

    public Device() {
    }

    public Device(String id) {
        this.id = id;
    }
    
    public Device(String id, String name, String userId) {
        this.id = id;
        this.name = name;
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
