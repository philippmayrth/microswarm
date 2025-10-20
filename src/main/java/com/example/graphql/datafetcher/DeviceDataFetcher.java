package com.example.graphql.datafetcher;

import java.util.List;

import com.example.graphql.db.DeviceDB;
import com.example.graphql.model.Device;
import com.example.graphql.model.User;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

import graphql.schema.DataFetchingEnvironment;

@DgsComponent
public class DeviceDataFetcher {
    
    private final DeviceDB db = new DeviceDB();

    public DeviceDataFetcher() {
    }
    
    @DgsQuery
    public Device device(@InputArgument String id) {
        return db.getDeviceById(id);
    }
    
    @DgsMutation
    public Device addDevice(
            @InputArgument String id,
            @InputArgument String name) {
        String userId = "1"; // Default user ID KISS, for now
        return db.addDevice(id, userId, name);
    }
    
    @DgsMutation
    public Boolean deleteDevice(@InputArgument String id) {
        db.deleteDevice(id);
        return true;
    }
    
    @DgsMutation
    public Device updateDeviceName(@InputArgument String id, @InputArgument String name) {
        return db.updateDevice(id, name);
    }
    
    @DgsData(parentType = "User", field = "devices")
    public List<Device> devices(DataFetchingEnvironment dfe) {
        User user = dfe.getSource();
        if (user == null) {
            throw new RuntimeException("User is null in devices resolver");
        }
        return db.getDevicesByUserId(user.getId());
    }
}
