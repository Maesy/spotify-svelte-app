<script context="module">
	export async function load({ page, fetch, session, context }) {
		return {
			props: { id: page.params.id }
		};
	}
</script>

<script>
	import { goto } from '$app/navigation';
	import { selectedTrackAlbumId, selectedTrackId } from '../../stores.js';

	export let id;
	$: tracks = null;
	$: artist = '';
	$: albumName = '';
	$: albumImage = '';
	$: albumId = $selectedTrackAlbumId;

	async function listen(trackId) {
		$selectedTrackId = trackId;
		goto(`/track/${trackId}`);
	}

	async function getAlbumTracks(albumId) {
		const res = await fetch(`/api/albums/${albumId}`);
		const album = await res.json();

		if (res.ok) {
			tracks = album.tracks.items;
			artist = album.artists[0].name;
			albumName = album.name;
			albumImage = album.images[1].url;
			albumId = album.id;
		} else if (res.status === 401) {
			goto('/')
		} else {
			throw new Error('Unable to get album tracks!');
		}
	}
</script>

<section id="listen-to-track">
	<div class="flex justify-center p-3">
		<div class="flex items-center">
			<iframe
				title="embedded-spotify-track"
				src={`https://open.spotify.com/embed/track/${id}`}
				width="600"
				height="680"
				frameborder="0"
				allowtransparency="true"
				allow="encrypted-media"
			/>
		</div>
	</div>
	{#if !tracks}
		<div class="flex justify-center p-3">
			<button
				on:click={() => getAlbumTracks(albumId)}
				class="flex items-center bg-green-500 hover:bg-green-400 text-white rounded-full h-12 shadow-md p-6"
			>
				Show more tracks from the same album
			</button>
		</div>
	{/if}
</section>

{#if tracks}
	<section id="tracks" class="container px-6 py-4 mx-auto">
		<div
			class="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5"
		>
			{#each tracks as track}
				<div class="w-full p-3 hover:cursor-pointer" on:click={() => listen(track.id)}>
					<div
						class="flex flex-row rounded-md overflow-hidden h-auto lg:h-32 shadow-lg hover:transition-colors duration-300 hover:bg-gray-700 border-2"
					>
						<div class="p-4 text-gray-300">
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
									d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
								/>
							</svg>
						</div>
						<div
							class="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
						>
							<div class="text-gray-300 font-bold text-xl mb-2 leading-tight">
								{artist} - {albumName}
							</div>
							<p class="text-gray-500 text-base">
								{track.name}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
