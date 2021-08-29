import * as cookie from 'cookie'

import { config } from '$lib/config'

export async function get({ headers, query }) {
    const { accessToken } = headers.cookie ? cookie.parse(headers.cookie) : {}

    if (accessToken) {
        const { SPOTIFY_WEB_API } = config
        const url = new URL(`${SPOTIFY_WEB_API}/search`)
        // Extend query params with required search target
        query.append('type', 'track')

        url.search = query.toString();

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
