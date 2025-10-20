import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Tab } from '@mui/material'
import Shell from '../components/Shell'
import Files from '../components/Files'
import DeviceOverview from '../components/DeviceOverview'
import Navigation from '../components/Navigation'
import { graphQLQuery } from '../gql'

function DeviceDetailPage() {
  const { id } = useParams()
  const [tab, setTab] = useState(0)
  const [deviceMasterData, setDeviceMasterData] = useState(null)

  useEffect(() => {
    const query = `
      query Device($id: String!) {
        device(id: $id) {
          name
        }
      }
    `
    graphQLQuery({ query, variables: { id } }).then(response => {
      console.log('Device query response:', response)
      setDeviceMasterData(response?.data?.device ?? null)
    })
  }, [id])


  return (
    <div>
      <Navigation />
      <div style={{
        marginTop: 40,
        margin: 10,
      }}>
        <h1>{deviceMasterData ? deviceMasterData.name : id}</h1>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Overview" />
          <Tab label="Shell" />
          <Tab label="Files" />
        </Tabs>

        <div style={{
          marginTop: 20,
          padding: 10,
        }}>
          {tab === 0 && <DeviceOverview deviceId={id} />}
          {tab === 1 && <Shell deviceId={id} />}
          {tab === 2 && <Files deviceId={id} />}
        </div>
      </div>

    </div>
  )
}

export default DeviceDetailPage
