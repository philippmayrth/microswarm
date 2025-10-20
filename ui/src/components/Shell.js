import { useState } from "react"
import { Card, Input, Button } from "@mui/material"
import { graphQLQuery } from "../gql"

function RestartButton({ deviceId }) {
  const handleRestart = () => {
    const query = `
      mutation Restart($deviceId: String!) {
        deviceRestart(deviceId: $deviceId)
      }`
    // Restart does not provide a response because the device is busy restarting
    graphQLQuery({ query, variables: { deviceId } })
  }

  return (
    <Button variant="contained" color="secondary" onClick={handleRestart}>
      Restart Device
    </Button>
  )
}

function Shell({ deviceId }) {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const runRemoteCode = (command) => {
    if (!command.trim()) return

    setIsLoading(true)
    const query = `
      mutation Exec($deviceId: String!, $pythonCode: String!, $timeoutSeconds: Int!) {
        deviceExec(
          deviceId: $deviceId,
          pythonCode: $pythonCode,
          timeoutSeconds: $timeoutSeconds,
        )
      }`
    graphQLQuery({ query, variables: { deviceId, pythonCode: command, timeoutSeconds: 10 } }).then(response => {
      if (response?.errors && response.errors.length > 0) {
        const errorMessage = response.errors[0].message
        setHistory(prev => [...prev, { command, output: errorMessage, isError: true }])
        setCommand("")
        setIsLoading(false)
        return
      }
      
      const rawOutput = response?.data?.deviceExec || "No response"
      
      let parsedResult = null
      let isError = false
      let displayOutput = rawOutput
      
      try {
        const parsed = JSON.parse(rawOutput)
        if (parsed.result) {
          parsedResult = parsed.result
          if (parsedResult.success && parsedResult.output !== null) {
            displayOutput = parsedResult.output
            isError = false
          } else if (!parsedResult.success && parsedResult.error) {
            displayOutput = parsedResult.error
            isError = true
          }
        }
      } catch (e) {
        // Check server side error messages from graphql api
        if (rawOutput.includes("Exception") || rawOutput.includes("Error") || rawOutput.includes("did not respond")) {
          isError = true
        }
        displayOutput = rawOutput
      }
      
      setHistory(prev => [...prev, { command, output: displayOutput, isError }])
      setCommand("")
      setIsLoading(false)
    }).catch(error => {
      setHistory(prev => [...prev, { command, output: `Error: ${error.message}`, isError: true }])
      setIsLoading(false)
    })
  }

  return (
    <Card style={{
      padding: 10,
    }}>
    TODO: Add RPC
    <br />

      <RestartButton deviceId={deviceId} />

      <div style={{
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        minHeight: 200,
        maxHeight: 400,
        overflowY: "auto",
        fontFamily: "monospace",
        fontSize: 14,
        borderRadius: 4,
      }}>
        {history.length === 0 && (
          <div style={{ color: "#888" }}>Command history will appear here...</div>
        )}
        {history.map((entry, index) => (
          <div key={index} style={{ marginBottom: 15 }}>
            <div style={{ color: "#4ec9b0" }}>{">>> "}{entry.command}</div>
            <div style={{ 
              whiteSpace: "pre-wrap", 
              marginTop: 5, 
              paddingLeft: 10,
              color: entry.isError ? "#ff6b6b" : "#d4d4d4"
            }}>
              {entry.output}
            </div>
          </div>
        ))}
      </div>

      <Input
        multiline
        fullWidth
        minRows={5}
        variant="outlined"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter Python code..."
        disabled={isLoading}
      />
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginTop: 10 }} 
        onClick={() => runRemoteCode(command)}
        disabled={isLoading || !command.trim()}
      >
        {isLoading ? "Executing..." : "Send Command"}
      </Button>

    </Card>
  )
}

export default Shell
