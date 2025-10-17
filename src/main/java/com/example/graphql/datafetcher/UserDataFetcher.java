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
        return this.user("1");
    }

    @DgsQuery
    public User user(@InputArgument String id) {
        User user = new User();
        user.setId(id);
        user.setEmail("user" + id + "@example.com");
        return user;
    }

}
