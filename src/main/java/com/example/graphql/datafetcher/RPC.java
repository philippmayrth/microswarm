package com.example.graphql.datafetcher;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class RPC {

    public RPC() {
    }
    
    @DgsMutation
    public String sendMQTTMessage(@InputArgument String topic, @InputArgument String payload) {
        // return mqttService.publishMessage(topic, payload);
        return "Message sent to topic: " + topic + " with payload: " + payload;
    }

}
