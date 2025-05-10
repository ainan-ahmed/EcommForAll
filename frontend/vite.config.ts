import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
    plugins: [
        TanStackRouterVite({
            target: "react",
            virtualRouteConfig: "./src/routes.ts",
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@tabler/icons-react":
                "@tabler/icons-react/dist/esm/icons/index.mjs",
        },
    },
    server: {
        host: "0.0.0.0",
    },
});
