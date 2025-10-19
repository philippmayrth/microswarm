import Card from '@mui/material/Card'

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
    </Card>
  )
}

export default InfoTile
