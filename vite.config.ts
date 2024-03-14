import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: "src",
      filename: "sw.ts",
      manifest: {
        short_name: "TestNotif",
        name: "Test Notification",
        icons: [
          {
            src: "/notification.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png"
          },
          {
            src: "/notification.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/notification.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff"
      },
    })
  ],
})
