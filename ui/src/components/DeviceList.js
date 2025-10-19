import { useEffect, useState } from 'react'
import InfoTile from './InfoCard';
import { graphQLQuery } from '../gql'

function App() {
    const [devices, setDevices] = useState([])
    const [isLoading, setIsLoading] = useState(false)

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
        graphQLQuery({query}).then(response => {
            console.log({response})
            setDevices(response?.data?.me?.devices ?? [])
            setIsLoading(false)
        })
    }, [])

    if (isLoading) return <>Loading...</>

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10pt',
            marginBottom: '20pt',
        }}>

            {JSON.stringify(devices)}

            <InfoTile deviceId="mockup-device-id" />
            <InfoTile deviceId="mockup-device-id" />
            <InfoTile deviceId="mockup-device-id" />
        </div>
    )
}

export default App
