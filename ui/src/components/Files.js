import { useEffect, useState } from 'react'
import { Card, List, ListItem, TextareaAutosize } from '@mui/material'
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

function FileIcon({ fileType }) {
  switch (fileType) {
    case "DIR":
      return "📁"
    case "PYTHON":
      return "⚡"
    case "CONFIG":
      return "⚙️"
    default:
      return "📄"
  }
}

function FileItems({ file, active, onClick }) {
  return (
    <ListItem onClick={onClick} style={{
      cursor: 'pointer',
    }}>
      <FileIcon fileType={detectFileType(file)} />
      {" "}
      {active ? <strong>{file}</strong> : file}
    </ListItem>
  )
}


  const runRemoteCode = ({ command, deviceId }) => {
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

function FileViewer({ path, deviceId }) {
  const [fileContent, setFileContent] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    runRemoteCode({command: `open('${path}').read()`, deviceId}).then(response => {
      console.log({ response })
      const deviceResponse = JSON.parse(response?.data?.deviceExec)
      const content = deviceResponse?.result?.output || "<Empty File>"
      deviceResponse && setFileContent(content)
      setLoading(false)
    })
  }, [path])

  return (
    <div>
      <TextareaAutosize
        minRows={10}
        style={{ width: "100%", marginTop: 10 }}
        value={fileContent ? fileContent : "<Loading...>"}
        readOnly
      />
    </div>
  )
}

function Files({ deviceId }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFile, setActiveFile] = useState(null)

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    setLoading(true)
    runRemoteCode({ command: "import os; import json", deviceId })
      .then(() => delay(1000)) // Wait 1 second after first command completes
      .then(() => runRemoteCode({ command: "json.dumps(os.listdir())", deviceId }))
      .then(response => {
        setLoading(false)
        // The Java backend encodes RPC calls to the device as JSON strings
        const result = JSON.parse(response?.data?.deviceExec)
        const deviceResponse = result?.result?.output || "[]"
        // The device also encodes results of executed code as JSON strings
        console.log({ deviceResponse })

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
    TODO: Add upload functionality
    <br />
    TODO: Add delete functionality
    <br />
    TODO: Add edit functionality
    <br />
    TODO: Add syntax highlighting

      <List style={{ maxHeight: 400, overflow: "auto" }}>
        {Array.isArray(files) && files.map((file, index) =>
          <FileItems key={index} file={file} active={activeFile === file} onClick={() => {
            if (detectFileType(file) !== "DIR") {
              setActiveFile(file)
            }
          }} />
        )}
      </List>
    
      <FileViewer path={activeFile} deviceId={deviceId} />


    </Card>
  )
}

export default Files
