import { useEffect, useState } from 'react'
import { Card, List, ListItem } from '@mui/material'
import { graphQLQuery } from '../gql'

function detectFileType(fileName) {
  const parts = fileName.split(".")
  if (parts.length === 1) {
    return "DIR"
  }
  const ext = parts[parts.length - 1]
  const mapping = {
    "py": "PYTHON",
    "json": "CONFIG",
  }
  return mapping[ext] || "FILE"
}

function FileItems({ file }) {
  return (
    <ListItem>
      {file} ({detectFileType(file)})
    </ListItem>
  )
}

function Files({ deviceId }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const runRemoteCode = (command) => {
    const query = `
      mutation Exec($deviceId: String!, $pythonCode: String!, $timeoutSeconds: Int!) {
        deviceExec(
          deviceId: $deviceId,
          pythonCode: $pythonCode,
          timeoutSeconds: $timeoutSeconds,
        )
      }`
    return graphQLQuery({ query, variables: { deviceId, pythonCode: command, timeoutSeconds: 10 } })
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    setLoading(true)
    runRemoteCode("import os; import json") // Prepare environment
      .then(() => delay(1000)) // Wait 1 second after first command completes
      .then(() => runRemoteCode("json.dumps(os.listdir())"))
      .then(response => {
        setLoading(false)
        // The Java backend encodes RPC calls to the device as JSON strings
        const result = JSON.parse(response?.data?.deviceExec)
        const deviceResponse = result?.result?.output || "[]"
        // The device also encodes results of executed code as JSON strings
        console.log({deviceResponse})
        
        const listArray = JSON.parse(deviceResponse)
        setFiles(listArray)
      })
      .catch(err => {
        console.error("Error fetching files:", err)
        setLoading(false)
        setFiles([])
      })
  }, [deviceId])
  
  if (loading) return <>Loading files...</>

  return (
    
    <Card style={{
        padding: 10,
    }}>
        Shell for device { deviceId }
       
        <List style={{ maxHeight: 400, overflow: "auto" }}>
          {Array.isArray(files) && files.map((file, index) => 
            <FileItems key={index} file={file} />
          )}
        </List>

    </Card>
  )
}

export default Files
