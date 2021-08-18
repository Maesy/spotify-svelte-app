import * as cookie from 'cookie'

import {config} from '$lib/config'

export async function get({ headers, params }) {
    const { accessToken } = cookie.parse(headers.cookie)

    if (accessToken) {
        const { SPOTIFY_WEB_API } = config
        const url = new URL(`${SPOTIFY_WEB_API}/albums/${params.id}`)

        const res = await fetch(
            url,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )
        
        return {
            status: res.status,
            body: await res.json()
        }
    } else {
        return {
            status: 401,
            error: new Error('Unauthorised')
        }
    }
}
