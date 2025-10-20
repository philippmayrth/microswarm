import { useEffect, useState } from 'react'
const { graphQLQuery } = require('../gql')

function Heartbeat({ deviceId}) {
  const [heartbeat, setHeartbeat] = useState(null)
  const [loading, setLoading] = useState(false)

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`)
    
    return parts.join(' ')
  }

  useEffect(() => {
    setLoading(true)
    const query = `
    mutation RequestHeartbeat($deviceId: String!, $timeoutSeconds: Int!) {
      deviceRequestHeartbeat(
        deviceId: $deviceId,
        timeoutSeconds: $timeoutSeconds) {
        uptimeSeconds
        firmware
        cpuTemp
        appName
        appVersion
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
    graphQLQuery({ query, variables: { deviceId: deviceId, timeoutSeconds: 10 } }).then(response => {
      setLoading(false)
      setHeartbeat(response?.data?.deviceRequestHeartbeat ?? null)
    })

  }, [deviceId])

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      {heartbeat && (<>
        <div>🟢 Online </div>
        <br />

        {heartbeat?.firmware?.includes("recovery") && <div>⚠️ Recovery Mode Active</div>}

        <div>⏱️ Uptime:       {formatUptime(heartbeat.uptimeSeconds)}</div>
        <div>💾 Firmware:     {heartbeat.firmware}</div>
        <div>🌡️ CPU Temp:     {heartbeat.cpuTemp} °C</div>
        <div>📱 App:          {heartbeat.appName} v{heartbeat.appVersion}</div>
        <div>🧠 RAM:          {Math.floor(heartbeat.memory?.allocatedRam / 1024)} KB / {Math.floor(heartbeat.memory?.totalRam / 1024)} KB</div>
        <div>💿 Flash:        {Math.floor(heartbeat.memory?.usedFlash / 1024)} KB / {Math.floor(heartbeat.memory?.totalFlash / 1024)} KB</div>
      </>)}
    
    {!heartbeat && !loading && (
      <div>🔴 Offline </div>
    )}
    
    {loading && (
      <div>⏳ Loading...</div>
    )}
   
    </div>
  )
}

export default Heartbeat
