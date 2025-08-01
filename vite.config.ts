import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        define: {
            'process.env.BINANCE_API_KEY': JSON.stringify(env.BINANCE_API_KEY),
            'process.env.BINANCE_API_SECRET': JSON.stringify(env.BINANCE_API_SECRET)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
