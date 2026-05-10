/*
    *  -----------------------------------------------------  *
    *  -----  astro.config.mjs  --  /astro.config.mjs  -----  *
    *  -----------------------------------------------------  *
*/



import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


/**  -----  `ruta absoluta del directorio actual`  -----  */
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// https://astro.build/config
export default defineConfig({

    base: '',

    // devToolbar: {
    //      enabled: true,
    // },

    vite: {

        // optimizeDeps: {
        //     force: true,
        // },

        resolve: {
            alias: {
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@src': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@layouts': path.resolve(__dirname, 'src/layouts'),
                '@libs': path.resolve(__dirname, 'src/libs'),
                '@config': path.resolve(__dirname, 'src/config'),
                '@consts': path.resolve(__dirname, 'src/consts'),
                '@scripts': path.resolve(__dirname, 'src/scripts'),
                '@styles': path.resolve(__dirname, 'src/styles'),
            }
        }
    }

});
