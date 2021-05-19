import svelte from "rollup-plugin-svelte"

export default {
    input: "src/index.js",
    output: {
        sourcemap: true,
        format: "es",
        name: "app",
        file: "index.js",
    },
    plugins: [
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: false,
            },
        }),
    ],
}
