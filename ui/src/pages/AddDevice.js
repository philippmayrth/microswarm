import { useState } from "react"
import { TextField, Card, Button } from "@mui/material"
import Navigation from "../components/Navigation"
import { graphQLQuery } from "../gql"

function AddDevice() {
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");

  return (
    <div>
      <Navigation />
      <div style={{
        marginTop: 40,
        margin: 10,
      }}>
        <h1>Add Device</h1>
        <Card style={{
          padding: 20,
          maxWidth: 400,
        }}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const query = `
                mutation AddDevice($deviceId: String!, $deviceName: String!) {
                  addDevice(id: $deviceId, name: $deviceName) {
                    id
                    name
                  }
                }
              `;
              await graphQLQuery({ query, variables: { deviceId, deviceName } });
              window.location.href = "/#/";
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <TextField
                label="Device ID"
                variant="outlined"
                required
                fullWidth
                value={deviceId}
                onChange={e => setDeviceId(e.target.value)}
                name="deviceId"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <TextField
                label="Device Name"
                variant="outlined"
                required
                fullWidth
                value={deviceName}
                onChange={e => setDeviceName(e.target.value)}
                name="deviceName"
              />
            </div>
            <Button type="submit" variant="contained" color="primary">
              Add Device
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AddDevice
