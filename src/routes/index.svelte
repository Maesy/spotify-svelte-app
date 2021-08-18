<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `/api/token`;
		const auth = await fetch(url, { method: 'POST' });
		if (auth.ok) {
			return {
				status: auth.status,
				props: {
					tracks: null
				}
			};
		}

		return {
			status: auth.status,
			error: new Error(`Authorisation failed!`)
		};
	}
</script>

<script>
	import { getRandomSearch } from '../utils';
	import { goto } from '$app/navigation';
	import { selectedTrackId, selectedTrackAlbumId, lastQueryParams } from '../stores.js';
	import { onMount } from 'svelte';

	let query;
	export let tracks;

	async function search(q, offset = 0, limit = 20, append = false) {
		const query = new URLSearchParams({ q, offset, limit });
		const url = new URL(import.meta.env.VITE_PUBLIC_BASE_PATH);
		url.pathname = '/api/search';
		url.search = query.toString();

		const res = await fetch(url);

		if (res.ok) {
			const results = await res.json();
			// Decide to extend(append) or replace the tracklist shown on page
			if (append) {
				tracks = [...(tracks || []), ...results.tracks.items];
			} else {
				tracks = results.tracks.items;
			}
			$lastQueryParams = query.toString();
		} else if (res.status === 401) {
			goto('/');
		} else {
			throw new Error('Search failed!');
		}
	}

	async function showMore() {
		// Read last query params
		const query = new URLSearchParams($lastQueryParams);
		const q = query.get('q');
		const limit = query.get('limit');
		// Update tracklist shown on page
		await search(q, tracks.length, limit, true);
	}

	async function listen(track) {
		$selectedTrackId = track.id;
		$selectedTrackAlbumId = track.album.id;
		$lastQueryParams = '';
		goto(`/track/${track.id}`);
	}

    function inputKeydownHandler(event) {
        if (event.key === 'Enter' && !!query) {
            search(query)
        }
    }

    function searchButtonClickHandler(event) {
        if (!!query) {
            search(query)
        }
    }

	onMount(async () => {
		search(getRandomSearch());
	});
</script>

<main class="flex-grow">
	<section id="search">
		<div class="p-8">
			<div class="bg-white flex items-center rounded-full shadow-xl ring-2 ring-gray-900">
				<input
					id="search"
                    on:keydown="{inputKeydownHandler}"
					bind:value={query}
					class="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
					type="text"
					placeholder="Search for artist, or track title"
				/>

				<div class="p-4">
					<button
                        id="search-button"
						on:click={searchButtonClickHandler}
						class="bg-green-500 text-white rounded-full p-2 hover:bg-green-400 focus:outline-none w-12 h-12 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</section>
	{#if !tracks}
		<div class="flex flex-row items-center justify-center gap-3">
			<div
				class="bg-gray-600 p-2  w-4 h-4 rounded-full animate-bounce"
				style="animation-delay: 0.1s"
			/>
			<div
				class="bg-gray-600 p-2 w-4 h-4 rounded-full animate-bounce"
				style="animation-delay: 0.2s"
			/>
			<div
				class="bg-gray-600 p-2  w-4 h-4 rounded-full animate-bounce"
				style="animation-delay: 0.3s"
			/>
		</div>
	{:else}
		<section id="results" class="px-3 py-3 mx-auto">
			<div
				class="p-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-5"
			>
				{#each tracks as track}
					<div
						class="rounded-md overflow-hidden shadow-lg bg-gray-800 border-gray-600 border-opacity-10 border-2 hover:transition-colors duration-300 hover:bg-gray-700 relative"
						on:click={() => listen(track)}
					>
						<div class="flex-auto justify-center items-center relative hover:cursor-pointer fill-current text-gray-100">
							<img
								class="w-full hover:brightness-125"
								src={track.album.images[1].url}
								alt="track-album"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								class="absolute inset-0 z-50 opacity-0 hover:transition-opacity duration-300 hover:opacity-50"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div class="px-6 py-4">
							<div class="font-bold text-gray-300 text-xl mb-2">
								{track.artists[0].name} - {track.album.name}
							</div>
							<p class="text-gray-500 text-base">
								{track.name}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
	{#if tracks}
		<div class="flex justify-center p-3">
			<button
				on:click={() => showMore()}
				class="flex items-center bg-green-500 hover:bg-green-400 text-white rounded-full h-12 shadow-md p-6"
			>
				Show more tracks
			</button>
		</div>
	{/if}
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
