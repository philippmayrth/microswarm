package com.example.graphql.datafetcher;

import com.example.base.businesslogic.MQTT;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class RPC {

    public RPC() {
    }

    private String _invokeDeviceRPC(
            String deviceId, 
            String message, 
            int timeoutSeconds) {

        var mqtt = new MQTT("src/main/resources/mqtt.json");
        mqtt.connect();
        
        String response = mqtt.invokeDeviceRPC(deviceId, message, timeoutSeconds);
        
        mqtt.disconnect();
        
        if (response != null) {
            return response;
        } else {
            throw new RuntimeException("Device '" + deviceId + "' did not respond within " + timeoutSeconds + " seconds");
        }
    }

    @DgsMutation
    public String deviceInvokeRPC(
            @InputArgument String deviceId, 
            @InputArgument String message, 
            @InputArgument int timeoutSeconds) {
            return _invokeDeviceRPC(deviceId, message, timeoutSeconds);
    }
    
    private String _deviceExec(
            @InputArgument String deviceId,
            @InputArgument String pythonCode,
            @InputArgument int timeoutSeconds) {
        String rpcMessage = "{\"method\":\"_exec\", \"params\":[\"" + pythonCode + "\"]}";
        return _invokeDeviceRPC(deviceId, rpcMessage, timeoutSeconds); 
    }
    
    @DgsMutation
    public String deviceExec(
            @InputArgument String deviceId,
            @InputArgument String pythonCode,
            @InputArgument int timeoutSeconds) {
            return _deviceExec(deviceId, pythonCode, timeoutSeconds);
    }
    
    @DgsMutation
    public Void deviceRestart(@InputArgument String deviceId) {
            String pythonCode = "import machine; machine.reset()";
            try {
                _deviceExec(deviceId, pythonCode, 0);
            } catch (Exception e) {
                // NOTE: SINCE THIS RESTARTS THE DEVICE, IT WILL NOT RESPOND. So no error handling needed.
            }
            return null;
    }

    @DgsMutation
    public String deviceRequestHeartbeat(
            @InputArgument String deviceId,
            @InputArgument int timeoutSeconds) {
        String rpcMessage = "{\"method\":\"_send_heartbeat\", \"params\": []}";
        // TODO: Listen and return heartbeat data
        return _invokeDeviceRPC(deviceId, rpcMessage, timeoutSeconds);
    }

}
