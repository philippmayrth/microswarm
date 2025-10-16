package com.example.graphql.datafetcher;

import com.example.base.businesslogic.MQTT;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class RPC {

    public RPC() {
        // read config from mqtt.json
    }
    
    
    @DgsMutation
    public String sendMQTTMessage(@InputArgument String topic, @InputArgument String payload) {
        var mqtt = new MQTT("src/main/resources/mqtt.json");
        mqtt.connect();
        mqtt.publish(topic, payload);
        mqtt.disconnect();

        return "Message sent to topic: " + topic + " with payload: " + payload;
    }

}
