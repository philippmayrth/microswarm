package com.example.graphql.datafetcher;

import com.example.graphql.model.User;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class UserDataFetcher {

    public UserDataFetcher() {
    }
    
    @DgsQuery
    public User me() {
        // Mockup user account
        return new User("1", "user1@example.com");
    }

    @DgsQuery
    public User user(@InputArgument String id) {
        // Mockup user account
        return new User(id, "user" + id + "@example.com");
    }

}
