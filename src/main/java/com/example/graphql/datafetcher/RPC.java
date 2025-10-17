package com.example.graphql.datafetcher;

import com.example.base.businesslogic.MQTT;
import com.example.graphql.model.Heartbeat;
import com.example.graphql.model.HeartbeatMemory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.InputArgument;

@DgsComponent
public class RPC {
    String mqttConfigPath = "src/main/resources/mqtt.json";

    public RPC() {
        
    }

    private String _invokeDeviceRPC(
            String deviceId, 
            String message, 
            int timeoutSeconds) {

        var mqtt = new MQTT(mqttConfigPath);
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
    public String deviceRestart(@InputArgument String deviceId) {
            String pythonCode = "import machine; machine.reset()";
            try {
                return _deviceExec(deviceId, pythonCode, 1);
            } catch (Exception e) {
                return "Device restart command sent (device will not respond as it's restarting)";
            }
    }

    @DgsMutation
    public Heartbeat deviceRequestHeartbeat(
            @InputArgument String deviceId,
            @InputArgument int timeoutSeconds) {
        
        var mqtt = new MQTT(mqttConfigPath);
        mqtt.connect();
        
        String heartbeatJson = mqtt.requestHeartbeat(deviceId, timeoutSeconds);
        
        mqtt.disconnect();
        
        if (heartbeatJson != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(heartbeatJson);
                
                System.out.println("Received heartbeat JSON: " + heartbeatJson);
                System.out.println("Field names in JSON: " + root.fieldNames());
                
                Heartbeat heartbeat = new Heartbeat();
                heartbeat.setUptimeSeconds(root.path("uptime").asInt(0));
                heartbeat.setFirmware(getStringField(root, "firmware"));
                heartbeat.setCpuTemp(getIntFromDouble(root, "cpu_temp", "cpuTemp"));
                heartbeat.setAppVersion(getStringField(root, "app_version", "appVersion"));
                heartbeat.setAppName(getStringField(root, "app_name", "appName"));
                
                if (root.has("memory")) {
                    JsonNode memNode = root.path("memory");
                    HeartbeatMemory memory = new HeartbeatMemory();
                    memory.setTotalFlash(getIntField(memNode, "total_flash", "totalFlash"));
                    memory.setFreeFlash(getIntField(memNode, "free_flash", "freeFlash"));
                    memory.setFreeRam(getIntField(memNode, "free_ram", "freeRam"));
                    memory.setUsedFlash(getIntField(memNode, "used_flash", "usedFlash"));
                    memory.setTotalRam(getIntField(memNode, "total_ram", "totalRam"));
                    memory.setAllocatedRam(getIntField(memNode, "allocated_ram", "allocatedRam"));
                    heartbeat.setMemory(memory);
                }
                
                return heartbeat;
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse heartbeat JSON: " + e.getMessage(), e);
            }
        } else {
            throw new RuntimeException("Device '" + deviceId + "' did not send heartbeat within " + timeoutSeconds + " seconds");
        }
    }
    
    private String getStringField(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.path(fieldName).isNull()) {
                return node.path(fieldName).asText();
            }
        }
        return null;
    }
    
    private Integer getIntFromDouble(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.path(fieldName).isNull()) {
                return (int) node.path(fieldName).asDouble();
            }
        }
        return null;
    }
    
    private Integer getIntField(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            if (node.has(fieldName) && !node.path(fieldName).isNull()) {
                return node.path(fieldName).asInt();
            }
        }
        return null;
    }
}
