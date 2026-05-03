/*
    *  --------------------------------------------------------------------------  *
    *  -----  register-service-worker.ts  --  /src/scripts/register-service-worker.ts  -----  *
    *  --------------------------------------------------------------------------  *
*/


let serviceWorkerRegistrationStarted = false;

export const registerServiceWorker = () => {
    if (serviceWorkerRegistrationStarted) {
        return;
    }

    if (!import.meta.env.PROD) {
        return;
    }

    if (!('serviceWorker' in navigator)) {
        return;
    }

    serviceWorkerRegistrationStarted = true;

    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        serviceWorkerRegistrationStarted = false;
    });
};