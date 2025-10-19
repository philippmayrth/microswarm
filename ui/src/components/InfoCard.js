import { Card, Button, Link } from '@mui/material'

function InfoTile({ id, name }) {
  return (
    <Card style={{
      width: 300,
      minHeight: 200,
      margin: 20,
      padding: 5,
    }}>
      <h1>{name}</h1>
      <br />
      (id: {id})

      <Link to={`/device/${id}`} style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary">
          View Details
        </Button>
      </Link>
    </Card>
  )
}

export default InfoTile
