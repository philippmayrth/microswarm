package com.example.graphql.datafetcher;

import com.example.graphql.model.Device;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class DeviceDataFetcher {

    public DeviceDataFetcher() {
    }
    
    @DgsQuery
    public Device device(@InputArgument String id) {
        return new Device(id);
    }

}
