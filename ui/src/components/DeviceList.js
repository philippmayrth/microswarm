import InfoTile from './InfoCard';

function App() {
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10pt',
        marginBottom: '20pt',
      }}>
      <InfoTile deviceId="mockup-device-id" />
      <InfoTile deviceId="mockup-device-id" />
      <InfoTile deviceId="mockup-device-id" />
    </div>
  )
}

export default App
