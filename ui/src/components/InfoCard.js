import Card from '@mui/material/Card'

function InfoTile({ deviceId }) {
  return (
    <Card style={{
      width: 200,
      height: 200,
      margin: 20,
      padding: 5,
    }}>
      Device Info tile {deviceId}
    </Card>
  )
}

export default InfoTile
