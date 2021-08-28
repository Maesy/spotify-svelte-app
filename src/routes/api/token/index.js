import * as cookie from 'cookie'

export async function post(request) {
    const { accessToken } = request.headers.cookie ? cookie.parse(request.headers.cookie): {}
    
    if (!accessToken) {
        const { SPOTIFY_ACCOUNTS_API, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_GRANT_TYPE } = process.env
        const basicAuthHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
        const url = new URL(`${SPOTIFY_ACCOUNTS_API}/token`)

        const res = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${basicAuthHeader}`
                },
                body: new URLSearchParams({
                    grant_type: SPOTIFY_GRANT_TYPE
                })
            }
        )

        const { expires_in, access_token } = await res.json()

        return {
            status: res.status,
            headers: {
                'Set-Cookie': cookie.serialize('accessToken', access_token, { httpOnly: true, maxAge: expires_in, path: '/api' })
            }
        }
    }

    return {
        status: 200,
    }
}

