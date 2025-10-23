import { useEffect, useState } from 'react'
import { Button, Card, List, ListItem } from '@mui/material'
import Editor from "@monaco-editor/react"
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

const runRemoteCommand = ({ method, deviceId, params }) => {
  if (!Array.isArray(params)) {
    console.log("WARNING: Params is not an array, defaulting to empty array")
    params = []
  }
  const message = JSON.stringify({
    method: method,
    params: params
  })
  const query = `
    mutation RunCommand($message: String!, $deviceId: String!, $timeoutSeconds: Int!) {
      deviceInvokeRPC(deviceId: $deviceId,
      message: $message,
      timeoutSeconds: $timeoutSeconds)
    }`
  return graphQLQuery({ query, variables: { message, deviceId, timeoutSeconds: 10 } })
}

const saveFile = ({ path, content, deviceId }) => {
  const b64encodedContent = btoa(content)
  return runRemoteCommand({ method: "_upload_file", deviceId, params: [path, b64encodedContent] })
}

function getLanguageFromPath(path) {
  const defaultLanguage = "python"
  if (!path) return defaultLanguage
  if (path.endsWith(".py")) return "python"
  if (path.endsWith(".json")) return "json"
  return defaultLanguage
}

function FileViewer({ path, deviceId }) {
  const [fileContent, setFileContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!path) return;
    setLoading(true)
    setFileContent(null)
    runRemoteCode({command: `open('${path}').read()`, deviceId}).then(response => {
      const deviceResponse = JSON.parse(response?.data?.deviceExec)
      const content = deviceResponse?.result?.output || "<Empty File>"
      deviceResponse && setFileContent(content)
      setLoading(false)
    })
  }, [path])

  if (!path) return <div style={{marginTop: 20, color: '#888'}}>Select a file to view its contents.</div>;
  if (loading) return <div style={{marginTop: 20}}>Loading file...</div>;

  return (
    <div style={{marginTop: 20}}>
    <Button disabled={saving} variant="contained" onClick={() => {
      setSaving(true)
      saveFile({ path, content: fileContent, deviceId }).then(response => {
        setSaving(false)
      })
      }}>{saving ? "Saving..." : "Save to device"}</Button>
      <Editor
        height="400px"
        language={getLanguageFromPath(path)}
        value={fileContent ?? ''}
        onChange={(value) => setFileContent(value)}
        options={{ readOnly: false , minimap: { enabled: true } }}
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

  if (loading) return <>⏳ Loading files...</>

  return (
    <Card style={{ padding: 10 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <List style={{ maxHeight: 400, overflow: "auto", minWidth: 200, flex: "0 0 200px" }}>
          {Array.isArray(files) && files.map((file, index) => (
            <FileItems
              key={index}
              file={file}
              active={activeFile === file}
              onClick={() => {
                if (detectFileType(file) !== "DIR") {
                  setActiveFile(file);
                }
              }}
            />
          ))}
        </List>
        <div style={{ flex: 1, minWidth: 320 }}>
          <FileViewer path={activeFile} deviceId={deviceId} />
        </div>
      </div>
    </Card>
  );
}

export default Files
