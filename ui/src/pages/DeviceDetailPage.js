import { useParams } from 'react-router-dom'

function DeviceDetailPage() {
  const { id } = useParams()

  return (
    <>
      device detail page for { id }
    </>
  )
}

export default DeviceDetailPage
