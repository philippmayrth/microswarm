import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Tab } from '@mui/material'
import Shell from '../components/Shell'
import Files from '../components/Files'

function DeviceDetailPage() {
  const { id } = useParams()
  const [tab, setTab] = useState(1)

  return (
    <div>
      device detail page for { id }

    
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Overview" />
        <Tab label="Shell" />
        <Tab label="Files" /> 
      </Tabs>

      <div style={{
        marginTop: 20,
        padding: 10,
      }}>
        { tab === 1 && <Shell deviceId={id} /> }
        { tab === 2 && <Files deviceId={id} /> }
      </div>

    </div>
  )
}

export default DeviceDetailPage
