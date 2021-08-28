import dotenv from 'dotenv'

dotenv.config({ debug: true })

export const config = {
    SPOTIFY_WEB_API: process.env["SPOTIFY_WEB_API"],
    SPOTIFY_ACCOUNTS_API: process.env["SPOTIFY_ACCOUNTS_API"],
    SPOTIFY_CLIENT_ID: process.env["SPOTIFY_CLIENT_ID"],
    SPOTIFY_CLIENT_SECRET: process.env["SPOTIFY_CLIENT_SECRET"],
    SPOTIFY_GRANT_TYPE: process.env["SPOTIFY_GRANT_TYPE"],
    VITE_PUBLIC_BASE_PATH: process.env["VITE_PUBLIC_BASE_PATH"]
}
