package com.example.graphql.model;

public class HeartbeatMemory {
    private Integer totalFlash;
    private Integer freeFlash;
    private Integer freeRam;
    private Integer usedFlash;
    private Integer totalRam;
    private Integer allocatedRam;

    public HeartbeatMemory() {
    }

    public Integer getTotalFlash() {
        return totalFlash;
    }

    public void setTotalFlash(Integer totalFlash) {
        this.totalFlash = totalFlash;
    }

    public Integer getFreeFlash() {
        return freeFlash;
    }

    public void setFreeFlash(Integer freeFlash) {
        this.freeFlash = freeFlash;
    }

    public Integer getFreeRam() {
        return freeRam;
    }

    public void setFreeRam(Integer freeRam) {
        this.freeRam = freeRam;
    }

    public Integer getUsedFlash() {
        return usedFlash;
    }

    public void setUsedFlash(Integer usedFlash) {
        this.usedFlash = usedFlash;
    }

    public Integer getTotalRam() {
        return totalRam;
    }

    public void setTotalRam(Integer totalRam) {
        this.totalRam = totalRam;
    }

    public Integer getAllocatedRam() {
        return allocatedRam;
    }

    public void setAllocatedRam(Integer allocatedRam) {
        this.allocatedRam = allocatedRam;
    }
}
