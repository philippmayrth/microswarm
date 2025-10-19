import { Card, List, ListItem } from '@mui/material'

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
  const files = [
    {
      name: "main.py",
    },
    {
      name: "app.py",
    },
    {
      name: "wifi.json",
    },
    {
      name: "lib",
    }
  ]

  return (
    
    <Card style={{
        padding: 10,
    }}>
        Shell for device { deviceId }
    
        <List style={{ maxHeight: 400, overflow: "auto" }}>
          {files.map((file, index) => 
            <FileItems key={index} file={file.name} />
          )}
        </List>

    </Card>
  )
}

export default Files
