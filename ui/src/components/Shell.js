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
  return (
    <Card style={{
        padding: 10,
    }}>
        Shell for device { deviceId }
    
      <RestartButton deviceId={deviceId} />
      
      <Input
        multiline
        fullWidth
        minRows={20}
        variant="outlined"
      />
      <Button variant="contained" color="primary" style={{ marginTop: 10 }}>
        Send Command
      </Button>

    </Card>
  )
}

export default Shell
