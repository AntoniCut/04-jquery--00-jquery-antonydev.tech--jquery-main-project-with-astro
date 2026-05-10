/*
    *  -----------------------------------------------  *
    *  -----  main.ts  --  /src/scripts/main.ts  -----  *
    *  -----------------------------------------------  *
*/

import { loadJQueryAndJQueryUi } from './load-jquery-jquery-ui';
import { registerServiceWorker } from './register-service-worker';


/**
 * ------------------------------------
 * -----  `loaderLifecycleReady`  -----
 * ------------------------------------
 * - Bandera que indica si el ciclo de vida del loader ya ha sido inicializado.
 * - Evita registrar múltiples listeners del evento `astro:after-swap` en navegaciones sucesivas.
 */

let loaderLifecycleReady = false;



/**
 * ----------------------------------
 * -----  `getLoaderElement()`  -----
 * ----------------------------------
 * - Devuelve el elemento `#loader` del DOM.
 * - Devuelve `null` si el elemento no existe en el documento actual.
 * @returns El elemento HTML del loader, o `null` si no se encuentra.
 */
const getLoaderElement = () => document.getElementById('loader');


/**
 * --------------------------------
 * -----  `hidePageLoader()`  -----
 * --------------------------------
 * - Oculta el loader de página añadiendo la clase `fade-out` al elemento `#loader`.
 * - Si el elemento no existe en el DOM, no hace nada.
 */

export const hidePageLoader = () => {
    getLoaderElement()?.classList.add('fade-out');
};



/**
 * --------------------------------------
 * -----  `initializePageLoader()`  -----
 * --------------------------------------
 * - Registra el listener del evento `astro:after-swap` para ocultar el loader
 *   después de cada navegación con View Transitions de Astro.
 * - Usa la bandera `loaderLifecycleReady` para registrar el listener solo una vez,
 *   evitando duplicados en navegaciones sucesivas.
 */

export const initializePageLoader = () => {
    
    if (loaderLifecycleReady) 
        return;
    

    document.addEventListener('astro:after-swap', () => {
        hidePageLoader();
    });

    loaderLifecycleReady = true;

};



/**
 * --------------------------------
 * -----  `initializeMain()`  -----
 * --------------------------------
 * @async
 * - Punto de entrada principal de la aplicación. Se ejecuta en cada navegación con Astro.
 * - Registra el Service Worker, carga jQuery y jQuery UI, e inicializa los navbars.
 * - Oculta el loader de página en el bloque `finally` para garantizar que desaparece
 *   incluso si alguna de las cargas falla.
 */
export const initializeMain = async () => {

    registerServiceWorker();
    
    try {
        await loadJQueryAndJQueryUi();

        const { actionsNavbars } = await import('./actions-navbars');

        actionsNavbars();
    
    } finally {
        
        requestAnimationFrame(() => {
            hidePageLoader();
        });

    }

};
