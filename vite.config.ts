import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
    server: {
        // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
        port: 10005,
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'express',
            appPath: './src/index.ts',
            exportName: 'viteNodeApp',
            tsCompiler: 'esbuild'
        })
    ],
    build: {
        target: 'esnext',
        copyPublicDir: false
    },
});
