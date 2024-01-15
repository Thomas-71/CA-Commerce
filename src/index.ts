import { Server } from './application/api/server';

const server = new Server();
server.init();

if (process.env.NODE_ENV === 'production') {
    server.launch(10005);
}

export const viteNodeApp = server.app;
