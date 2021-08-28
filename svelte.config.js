import node from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		// adapter: adapter({ out: 'build',	precompress: false,	env: { host: 'HOST', port: 'PORT' }	})
		adapter: node({ out: 'dist' })
	}
};

export default config;
