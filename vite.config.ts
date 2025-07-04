import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: "jsdom", // Simule le DOM pour les tests React et localStorage
        setupFiles: "./src/setupTests.js", // Fichier de configuration des tests
        globals: true, // Permet d'utiliser describe, it, expect sans les importer
    },
});
