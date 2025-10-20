import { Card, Button, Link } from '@mui/material'
import Heartbeat from './Heartbeat'

function InfoTile({ id, name }) {

  return (
    <Card style={{
      width: 300,
      minHeight: 200,
      margin: 20,
      padding: 10,
    }}>
      <h1>{name}</h1>
      <i>{id}</i>
      <br />
      <br />

      <Heartbeat deviceId={id} />

      <br />

      <Link to={`/device/${id}`} style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary">
          View Details
        </Button>
      </Link>
    </Card>
  )
}

export default InfoTile
