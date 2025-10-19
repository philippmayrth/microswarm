import { Card, Input, Button } from '@mui/material'

function Shell({ deviceId }) {
  return (
    <Card style={{
        padding: 10,
    }}>
        Shell for device { deviceId }
      
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
