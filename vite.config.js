import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'public',
        emptyOutDir: false,
        rollupOptions: {
            input: 'src/js/main.js',
            output: {
                assetFileNames: 'assets/[name].css',
                entryFileNames: 'assets/[name].js',
            },
        },
    },
});
