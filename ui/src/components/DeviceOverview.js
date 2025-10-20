import { Card } from '@mui/material'
import Heartbeat from './Heartbeat'

function DeviceOverview({ deviceId }) {
  return (
    <Card style={{
        padding: 10,
    }}>
      Overview for device { deviceId }
    
    <b>
    
    <br />
    TODO: Add graphs
    <br />
    TODO: Make stats prettier
    </b>

      <Heartbeat deviceId={deviceId} />

    </Card>
  )
}

export default DeviceOverview
