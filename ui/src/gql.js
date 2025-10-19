import  { getApiEndpoint } from './globalconsts'

export function graphQLQuery({query, variables}) {
    return fetch(getApiEndpoint(), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ query, variables })
    }).then((res) => res.json())
}
