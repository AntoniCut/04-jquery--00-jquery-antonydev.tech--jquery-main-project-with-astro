/*
    *  --------------------------------------------------------------------------  *
    *  -----  register-service-worker.ts  --  /src/scripts/register-service-worker.ts  -----  *
    *  --------------------------------------------------------------------------  *
*/


/**
 * ------------------------------------------------
 * -----  `serviceWorkerRegistrationStarted`  -----
 * ------------------------------------------------
 * - Bandera que indica si el registro del Service Worker ya ha comenzado.
 * - Evita registrar el Service Worker más de una vez durante el ciclo de vida de la app.
 */

let serviceWorkerRegistrationStarted = false;



/**
 * ---------------------------------------
 * -----  `registerServiceWorker()`  -----
 * ---------------------------------------
 * - Registra el Service Worker (`/sw.js`) solo en producción y si el navegador lo soporta.
 * - Usa la bandera `serviceWorkerRegistrationStarted` para ejecutar el registro una única vez.
 * - En caso de error en el registro, restablece la bandera para permitir un reintento.
 */

export const registerServiceWorker = () => {
    
    if (serviceWorkerRegistrationStarted) 
        return;
    
    if (!import.meta.env.PROD) 
        return;
    
    if (!('serviceWorker' in navigator)) 
        return;
    
    serviceWorkerRegistrationStarted = true;

    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        serviceWorkerRegistrationStarted = false;
    });

};
