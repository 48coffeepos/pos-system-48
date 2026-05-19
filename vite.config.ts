import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools({
			editor: {
				name: "custom",
				open: async (path, lineNumber, columnNumber) => {
					const { exec } = await import("node:child_process");
					const editor = process.env.VITE_TANSTACK_DEVTOOLS_EDITOR;

					console.log(editor);

					const command = `${editor} "${(path).replaceAll("$", "\\$")}${lineNumber ? `:${lineNumber}` : ""}${columnNumber ? `:${columnNumber}` : ""}"`;

					console.log(command);
					exec(command);
				},
			},
			injectSource: {
				enabled: true,
				ignore: {
					// files to ignore source injection ford
					files: ["node_modules", /.*\.test\.(js|ts|jsx|tsx)$/],
				},
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
