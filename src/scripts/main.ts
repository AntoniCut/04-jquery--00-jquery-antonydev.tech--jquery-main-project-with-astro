/*
    *  -----------------------------------------------  *
    *  -----  main.ts  --  /src/scripts/main.ts  -----  *
    *  -----------------------------------------------  *
*/

import { loadJQueryAndJQueryUi } from './load-jquery-jquery-ui';
import { registerServiceWorker } from './register-service-worker';


let loaderLifecycleReady = false;

const getLoaderElement = () => document.getElementById('loader');

export const hidePageLoader = () => {
    getLoaderElement()?.classList.add('fade-out');
};


export const initializePageLoader = () => {
    if (loaderLifecycleReady) {
        return;
    }

    document.addEventListener('astro:after-swap', () => {
        hidePageLoader();
    });

    loaderLifecycleReady = true;
};


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
