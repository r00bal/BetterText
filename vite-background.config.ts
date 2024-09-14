import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    build:{
        emptyOutDir: false,
        rollupOptions:{
        input:{
            background: "./src/background/index.ts",
        },
        output:{
            entryFileNames: "[name].js"
        }
        },
    },
})
