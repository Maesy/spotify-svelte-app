## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

The application can be deployed to a node server environment. The svelte.config.js contains the basic configuration of a node adapter. You only need to run:

```bash
npm run build
```
In order to be able to model how the application runs in a production environment, I created a docker container and a compose file. To try out the dockerized version, after building the app, you need to run:

```bash
npm run build:docker
```

which creates the container with the application, and to start it you just run:

```bash
npm run start:docker
```
If you want to shut down the app, run:

```bash
npm run stop:docker
```
