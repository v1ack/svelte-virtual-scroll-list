import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import livereload from "rollup-plugin-livereload"
import css from "rollup-plugin-css-only"

const production = !process.env.ROLLUP_WATCH

function serve() {
    let server

    function toExit() {
        if (server) server.kill(0)
    }

    return {
        writeBundle() {
            if (server) return
            server = require("child_process").spawn("npm", ["run", "start:dev", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true,
            })

            process.on("SIGTERM", toExit)
            process.on("exit", toExit)
        },
    }
}

export default {
    input: "test/main.js",
    output: {
        sourcemap: true,
        format: "es",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: !production,
            },
        }),
        css({output: "bundle.css"}),
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        !production && serve(),
        !production && livereload("public"),
    ],
    watch: {
        clearScreen: false,
    },
}
