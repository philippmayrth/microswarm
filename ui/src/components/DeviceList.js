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
            {devices.map(device => 
                <InfoTile id={device.id} name={device.name} />
            )}
        </div>
    )
}

export default App
