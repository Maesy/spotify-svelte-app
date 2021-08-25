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

	function formatDuration(durationInMs) {
		const min = (durationInMs / 60000) | 0
		const sec = (durationInMs % (min * 60000)) / 1000 | 0

		return `${min < 10 ? min.toString().padStart(2, '0') : min}:${sec < 10 ? sec.toString().padStart(2, '0') : sec}`
	}

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
	<section id="tracks_new" class="container px-6 py-4 mx-auto">
		<!-- song list header -->
		<div class="flex text-gray-600">
			<div class="p-2 w-8 flex-shrink-0"></div>
			<div class="p-2 w-8 flex-shrink-0"></div>
			<div class="p-2 w-full">Title</div>
			<div class="p-2 w-full">Artist</div>
			<div class="p-2 w-full">Album</div>
			<div class="p-2 w-12 flex-shrink-0 text-right">⏱</div>
		</div>
		{#each tracks as track}
			<div class="flex border-b text-gray-400 border-gray-600 hover:transition-colors duration-300 hover:bg-gray-700 hover:cursor-pointer" on:click={() => listen(track.id)}>
				<div class="p-3 w-8 flex-shrink-0">▶️</div>
				<div class="p-3 w-full">{track.name}</div>
				<div class="p-3 w-full">{artist}</div>
				<div class="p-3 w-full">{albumName}</div>
				<div class="p-3 w-12 flex-shrink-0 text-right">{formatDuration(track.duration_ms)}</div>
			</div>
		{/each}
		<div class="flex justify-center p-3">
			<button
				on:click={() => goto('/')}
				class="flex items-center bg-green-500 hover:bg-green-400 text-white rounded-full h-12 shadow-md p-6"
			>
				Search another track, or artist
			</button>
		</div>
	</section>
{/if}
