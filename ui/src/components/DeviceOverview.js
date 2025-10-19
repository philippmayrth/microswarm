import { Card } from '@mui/material'
import Heartbeat from './Heartbeat'

function DeviceOverview({ deviceId }) {
  return (
    <Card style={{
        padding: 10,
    }}>
      Overview for device { deviceId }

      <Heartbeat deviceId={deviceId} />

    </Card>
  )
}

export default DeviceOverview
