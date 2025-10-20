import { useEffect, useState } from "react"
import InfoTile from "./InfoCard";
import { graphQLQuery } from "../gql"
import { Button } from "@mui/material";

function DeviceList() {
  const [devices, setDevices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  
  const deleteDevice = (deviceId) => {
    const query = `
      mutation DeleteDevice($deviceId: String!) {
        deleteDevice(id: $deviceId)
      }
    `
    graphQLQuery({ query, variables: { deviceId } }).then(response => {
      setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId))
    })
  }

  useEffect(() => {
    setIsLoading(true)
    const query = `
        query {
          me {
            devices {
              id
              name
            }
          }
        }
        `
    graphQLQuery({ query }).then(response => {
      console.log({ response })
      setDevices(response?.data?.me?.devices ?? [])
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <>Loading...</>

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20pt",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10pt",
        marginBottom: "20pt",
      }}>
        <Button variant="contained" color="primary" onClick={() => {
          window.location.href = "/#/device/add"
        }}>
          Add
        </Button>
        <Button variant="contained" color="primary" onClick={() => {
          setEditMode(!editMode)
        }}>
          {editMode ? "Done" : "Edit"}
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10pt",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {devices.map(device => (
          <InfoTile
            key={device.id}
            id={device.id}
            name={device.name}
            editMode={editMode}
            onDelete={id => {
              deleteDevice(id);
            }}
            style={{ minWidth: 220, flex: "1 1 220px", maxWidth: "100%" }}
          />
        ))}
      </div>
    </div>
  )
}

export default DeviceList
