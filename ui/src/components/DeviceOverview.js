import { useEffect, useState } from "react"
import { Card } from "@mui/material"
import Heartbeat from "./Heartbeat"
import MemoryChart from "./MemoryChart"
import CPUTempChart from "./CPUTempChart"
import { graphQLQuery } from "../gql"

function DeviceOverview({ deviceId }) {
  const [heartbeat, setHeartbeat] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const query = `
    mutation RequestHeartbeat($deviceId: String!, $timeoutSeconds: Int!) {
      deviceRequestHeartbeat(
        deviceId: $deviceId,
        timeoutSeconds: $timeoutSeconds) {
        cpuTemp
        memory {
          totalFlash
          freeFlash
          freeRam
          usedFlash
          totalRam
          allocatedRam
        }
      }
    }
    `
    graphQLQuery({ query, variables: { deviceId: deviceId, timeoutSeconds: 3 } }).then(response => {
      setLoading(false)
      setHeartbeat(response?.data?.deviceRequestHeartbeat ?? null)
    })

  }, [deviceId])
  return (
    <Card style={{
      padding: 10,
    }}>
      <Heartbeat deviceId={deviceId} />

      {loading ? "⏳ Loading charts" : heartbeat && <><div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        gap: "10px",
        marginTop: "20px",
      }}>
        <div style={{ flex: "0 0 auto", minWidth: "250px" }}>
          <MemoryChart label="RAM" free={heartbeat?.memory?.freeRam} used={heartbeat?.memory?.usedRam} />
        </div>
        <div style={{ flex: "0 0 auto", minWidth: "250px" }}>
          <MemoryChart label="Flash" free={heartbeat?.memory?.freeFlash} used={heartbeat?.memory?.usedFlash} />
        </div>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        marginTop: 30,
        paddingLeft: 40, // center under teh ram chart so it looks better
      }}>
        <CPUTempChart temperature={heartbeat?.cpuTemp} />
      </div>
    </>}

    </Card >
  )
}

export default DeviceOverview
