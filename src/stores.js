import { persist, sessionStorage } from "@macfja/svelte-persistent-store"

import { writable } from 'svelte/store'

const storage = sessionStorage()

export let lastQueryParams = persist(writable(null), storage, 'lastQueryParams')
export let selectedTrackId = persist(writable(null), storage, 'selectedTrackId')
export let selectedTrackAlbumId = persist(writable(null), storage, 'selectedTrackAlbumId')