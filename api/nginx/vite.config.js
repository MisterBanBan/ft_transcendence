import { defineConfig } from 'vite'

export default defineConfig({
    // Si index.html est dans public/
    build: {
        rollupOptions: {
            input: './src/index.html'
        }
    }
})
