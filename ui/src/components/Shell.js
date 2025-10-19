import { useState } from 'react'
import { Card, Input, Button } from '@mui/material'
import { graphQLQuery } from '../gql'

function RestartButton({ deviceId }) {
  const handleRestart = () => {
    const query = `
      mutation Restart($deviceId: String!) {
        deviceRestart(deviceId: $deviceId)
      }`
    // Restart does not provide a response because the device is busy restarting
    graphQLQuery({ query, variables: { deviceId } })
  }

  return (
    <Button variant="contained" color="secondary" onClick={handleRestart}>
      Restart Device
    </Button>
  )
}

function Shell({ deviceId }) {
  const [command, setCommand] = useState("")
  const runRemoteCode = (command) => {
    const query = `
      mutation Exec($deviceId: String!, $pythonCode: String!, $timeoutSeconds: Int!) {
        deviceExec(
          deviceId: $deviceId,
          pythonCode: $pythonCode,
          timeoutSeconds: $timeoutSeconds,
        )
      }`
    graphQLQuery({ query, variables: { deviceId, pythonCode: command, timeoutSeconds: 10 } }).then(response => {
      console.log({ response })
    })
  }

  return (
    <Card style={{
      padding: 10,
    }}>
      <RestartButton deviceId={deviceId} />

      <Input
        multiline
        fullWidth
        minRows={20}
        variant="outlined"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <Button variant="contained" color="primary" style={{ marginTop: 10 }} onClick={() => runRemoteCode(command)}>
        Send Command
      </Button>

    </Card>
  )
}

export default Shell
