/*
    *  ---------------------------------------------------------------------------------  *
    *  -----  load-jquery-jquery-ui.ts  --  /src/scripts/load-jquery-jquery-ui.ts  -----  *
    *  ---------------------------------------------------------------------------------  *
*/


import $ from 'jquery';


declare global {
    interface Window {
        $?: JQueryStatic;
        jQuery?: JQueryStatic;
    }
}


let librariesReady: Promise<void> | null = null;

export const loadJQueryAndJQueryUi = async () => {
    
    librariesReady ??= (async () => {
    
        window.$ = $;
        window.jQuery = $;

        await import('jquery-ui-dist/jquery-ui.js');

    })();

    return librariesReady;
    
};


