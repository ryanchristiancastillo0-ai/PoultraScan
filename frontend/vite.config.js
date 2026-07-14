import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      manifest: {
        name: "Poultry Scanner",
        short_name: "Poultry",
        description: "AI-powered poultry health monitoring system",
        theme_color: "#2E7D32",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB

        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],

        runtimeCaching: [
          {
            // Cloudinary/cross-origin images: always try network first so
            // updated/replaced images don't get stuck on a broken cached entry
            urlPattern: ({ url }) => url.origin === "https://res.cloudinary.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "cloudinary-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Your own static/local images: fine to cache-first
            urlPattern: ({ request, url }) =>
              request.destination === "image" && url.origin === self.location.origin,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets",
            },
          },
        ],
      },
    }),
  ],

  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
});