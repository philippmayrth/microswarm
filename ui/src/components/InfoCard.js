import { Card, Button, Link } from '@mui/material'
import Heartbeat from './Heartbeat'

function InfoTile({ id, name, editMode, onDelete }) {
  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(id);
  };

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
      {editMode && (
        <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: 10 }}>
          DELETE
        </Button>
      )}
    </Card>
  )
}

export default InfoTile
