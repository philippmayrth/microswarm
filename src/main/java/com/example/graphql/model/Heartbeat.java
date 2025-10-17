package com.example.graphql.model;

public class Heartbeat {
    private Integer uptimeSeconds;
    private String firmware;
    private Integer cpuTemp;
    private String appVersion;
    private HeartbeatMemory memory;
    private String appName;

    public Heartbeat() {
    }

    public Integer getUptimeSeconds() {
        return uptimeSeconds;
    }

    public void setUptimeSeconds(Integer uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getFirmware() {
        return firmware;
    }

    public void setFirmware(String firmware) {
        this.firmware = firmware;
    }

    public Integer getCpuTemp() {
        return cpuTemp;
    }

    public void setCpuTemp(Integer cpuTemp) {
        this.cpuTemp = cpuTemp;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public HeartbeatMemory getMemory() {
        return memory;
    }

    public void setMemory(HeartbeatMemory memory) {
        this.memory = memory;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }
}
