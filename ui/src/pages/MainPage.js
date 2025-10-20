import DeviceList from "../components/DeviceList"
import Navigation from "../components/Navigation"

function MainPage() {
  return (
    <>
      <Navigation />
      <div style={{
        marginTop: 40,
        margin: 10,
        display: "flex",
        justifyContent: "center",
        gap: "10pt",
      }}>
        <DeviceList />
      </div>
    </>
  )
}

export default MainPage
