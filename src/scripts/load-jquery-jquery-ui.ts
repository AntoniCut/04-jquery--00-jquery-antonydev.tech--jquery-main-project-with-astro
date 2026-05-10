/*
    *  ---------------------------------------------------------------------------------  *
    *  -----  load-jquery-jquery-ui.ts  --  /src/scripts/load-jquery-jquery-ui.ts  -----  *
    *  ---------------------------------------------------------------------------------  *
*/


import $ from 'jquery';


/** -----  `Tipos globales para jQuery` ----- */
declare global {

    interface Window {

        $?: JQueryStatic;
        jQuery?: JQueryStatic;
    }
}


/** 
 * -----------------------------
 * -----  `librariesReady` -----
 * -----------------------------
 * - `Sì jQuery y jQuery UI estan cargados` devuelve una promesa 
 *    que se resuelve cuando ambas bibliotecas están listas para usar.
 * - `En caso contrario` se resuelve inmediatamente
 */
let librariesReady: Promise<void> | null = null;


/**
 * - `Carga las bibliotecas jQuery y jQuery UI dinámicamente`
 * - `Sì jQuery y jQuery UI estan cargados` devuelve una promesa 
 *    que se resuelve cuando ambas bibliotecas están listas para usar.
 * - `En caso contrario` se resuelve inmediatamente
 */
export const loadJQueryAndJQueryUi = async () => {

    librariesReady ??= (async () => {


        /** -----  `Asignar jQuery a las variables globales` ----- */
        window.$ = $;
        window.jQuery = $;

        if (!window.$ || !window.jQuery) {
            throw new Error('Failed to assign jQuery to global variables.');
        }

        console.log(
            '%c jQuery version:',
            'color: white; background-color: #0868ac; font-weight: bold; padding: 5px 10px;', $.fn.jquery
        );

        /// -----  `Cargar jQuery UI dinámicamente` -----
        await import('jquery-ui/dist/jquery-ui.js');

        // -----  `Verificar que jQuery UI se haya cargado correctamente` -----
        if (!$.ui || !$.ui.version) {
            throw new Error('Failed to load jQuery UI or retrieve its version.');
        }

        console.log(
            '%c jQuery UI version:',
            'color: white; background-color: #f89c15; font-weight: bold; padding: 5px 10px;', $.ui.version
        );



    })();

    return librariesReady;

};
