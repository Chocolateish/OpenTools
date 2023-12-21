import { resolve, } from 'path'
import { defineConfig } from 'vite'
import { name, dependencies } from "./package.json"
import dts from "vite-plugin-dts"
import libCss from 'vite-plugin-libcss';

export default defineConfig(({ command, mode, ssrBuild }) => {
    console.log(command, mode);

    switch (command) {
        case 'serve':
            if (mode === 'pages') {
                return {
                    server: {
                        host: true,
                        port: 666,
                    },
                    build: {
                        outDir: "../docs",
                        emptyOutDir: true,
                    },
                    preview: {
                        port: 666
                    },
                    root: "./pages",
                    base: "/pages/",
                }
            } else {
                return {
                    server: {
                        host: true,
                        port: 999
                    },
                    build: {
                        outDir: "./dist"
                    },
                    preview: {
                        port: 999
                    },
                    root: "./cypress/pages",
                }
            }
        case 'build':
            if (mode === 'pages') {
                return {
                    root: "./pages",
                    build: {
                        outDir: "../docs",
                        emptyOutDir: true,
                    },
                    base: '',
                }
            } else if (mode === 'tests' || mode === 'production') {
                return {
                    root: "./cypress/pages",
                    build: {
                        outDir: "./dist",
                        target: "esnext"
                    },
                    base: ''
                }
            } else {
                return {
                    build: {
                        lib: {
                            entry: resolve(__dirname, 'src/index.ts'),
                            name: name,
                            fileName: 'index',
                            formats: ['es', 'cjs'],
                        },
                        rollupOptions: {
                            external: Object.keys(dependencies),
                        },
                        target: "es2022",
                    },
                    plugins: [
                        dts({ rollupTypes: true, }),
                        libCss()
                    ]
                }
            }
    }
})