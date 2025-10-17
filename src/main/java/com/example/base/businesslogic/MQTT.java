package com.example.base.businesslogic;

import java.io.File;
import java.io.IOException;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MQTT {
    public MqttClient client;
    private String brokerUrl;
    private String username;
    private String password;

    public MQTT(String brokerUrl, String username, String password) {
        this.brokerUrl = brokerUrl;
        this.username = username;
        this.password = password;
    }
    
    public MQTT(String configFilePath) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode config = mapper.readTree(new File(configFilePath));
            String server = config.get("server").asText();
            int port = config.get("port").asInt();
            this.brokerUrl = "tcp://" + server + ":" + port;
            this.username = config.get("user").asText();
            this.password = config.get("password").asText();
        } catch (IOException e) {
            System.err.println("ERROR: CONFIG FILE INVALID OR MISSING" + configFilePath);
            e.printStackTrace();
        }
    }

    public void connect() {
        try {
            client = new MqttClient(brokerUrl, MqttClient.generateClientId());
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setAutomaticReconnect(true);
            options.setUserName(username);
            options.setPassword(password.toCharArray());
            client.connect(options);
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public void disconnect() {
        try {
            if (client != null && client.isConnected()) {
                client.disconnect();
                client.close();
            }
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public void publish(String topic, String message) {
        try {
            if (client != null && client.isConnected()) {
                MqttMessage mqttMessage = new MqttMessage(message.getBytes());
                mqttMessage.setQos(1);
                client.publish(topic, mqttMessage);
            }
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    public String invokeDeviceRPC(String deviceId, String message, int timeoutSeconds) {
        final String topic = "iot/" + deviceId + "/command";
        final String responseTopic = "iot/" + deviceId + "/response";
        final String[] response = new String[1];
        final Object lock = new Object();
        
        try {
            if (client != null && client.isConnected()) {
                client.subscribe(responseTopic, (receivedTopic, mqttMessage) -> {
                    synchronized (lock) {
                        response[0] = new String(mqttMessage.getPayload());
                        lock.notify();
                    }
                });
                
                MqttMessage mqttMessage = new MqttMessage(message.getBytes());
                mqttMessage.setQos(1);
                client.publish(topic, mqttMessage);
                
                synchronized (lock) {
                    lock.wait(timeoutSeconds * 1000L);
                }
                
                client.unsubscribe(responseTopic);
                
                return response[0];
            }
        } catch (MqttException | InterruptedException e) {
            e.printStackTrace();
        }
        
        return null;
    }
    
    public String requestHeartbeat(String deviceId, int timeoutSeconds) {
        final String commandTopic = "iot/" + deviceId + "/command";
        final String heartbeatTopic = "iot/" + deviceId + "/_heartbeat";
        final String[] response = new String[1];
        final Object lock = new Object();
        
        try {
            if (client != null && client.isConnected()) {
                client.subscribe(heartbeatTopic, (receivedTopic, mqttMessage) -> {
                    synchronized (lock) {
                        response[0] = new String(mqttMessage.getPayload());
                        lock.notify();
                    }
                });
                
                String heartbeatCommand = "{\"method\":\"_send_heartbeat\", \"params\": []}";
                MqttMessage mqttMessage = new MqttMessage(heartbeatCommand.getBytes());
                mqttMessage.setQos(1);
                client.publish(commandTopic, mqttMessage);
                
                synchronized (lock) {
                    lock.wait(timeoutSeconds * 1000L);
                }
                
                client.unsubscribe(heartbeatTopic);
                
                return response[0];
            }
        } catch (MqttException | InterruptedException e) {
            e.printStackTrace();
        }
        
        return null;
    }
}

