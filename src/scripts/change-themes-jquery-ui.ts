/*
    *  -------------------------------------------------------------------------------------  *
    *  -----  change-themes-jquery-ui.ts  --  /src/scripts/change-themes-jquery-ui.ts  -----  *
    *  -------------------------------------------------------------------------------------  *
*/


import {
    defaultJQueryUiThemeHref,
    defaultJQueryUiThemeName,
    jqueryUiThemeHrefs,
    type JQueryUiThemeName,
} from './jquery-ui-theme-urls';


/** Clave usada para persistir el href del tema en localStorage. */
const THEME_STORAGE_KEY = 'jqui-theme-href';


const getJQuery = () => {
    const jqueryInstance = window.jQuery ?? window.$;

    if (!jqueryInstance) {
        throw new Error('jQuery no esta cargado antes de inicializar el cambio de temas.');
    }

    return jqueryInstance;
};

const $ = getJQuery();


// ----- Helpers de DOM -----

const getThemeLink = () => $('#theme');

const getThemeButtonsContainer = () => $('#linksThemesContainer');


// ----- Estado visual del tema activo -----

const markActiveTheme = (themeName: JQueryUiThemeName) => {
    const $linksThemesContainer = getThemeButtonsContainer();

    $linksThemesContainer.find('a').removeClass('active');
    $linksThemesContainer.find(`[data-theme="${themeName}"]`).addClass('active');
};


/**
 * Resuelve el nombre de tema a partir del href del `<link>` actual.
 * Si no coincide con ningún tema conocido devuelve el tema por defecto.
 */
export const getThemeNameFromHref = (themeHref?: string): JQueryUiThemeName => {
    if (!themeHref) {
        return defaultJQueryUiThemeName;
    }

    const themeEntries = Object.entries(jqueryUiThemeHrefs) as Array<[JQueryUiThemeName, string]>;
    const matchingTheme = themeEntries.find(([, href]) => href === themeHref);

    return matchingTheme?.[0] ?? defaultJQueryUiThemeName;
};


// ----- Gestión de tooltips -----

export const destroyTooltips = () => {
    const $document = $(document);

    if (typeof $document.tooltip !== 'function') {
        return;
    }

    try {
        $document.tooltip('destroy');
    } catch {
        // El widget no estaba inicializado
    }
};

export const initializeTooltips = () => {
    const $document = $(document);

    if (typeof $document.tooltip !== 'function') {
        return;
    }

    $document.tooltip();
};

const refreshTooltips = () => {
    destroyTooltips();
    initializeTooltips();
};


/**
 * Devuelve el tema guardado en localStorage; si no hay ninguno, lee el
 * href del `<link id="theme">` actual; si tampoco hay, devuelve el tema por defecto.
 * Usar esto en `syncInitialState` para sobrevivir a las View Transitions de Astro.
 */
export const getRestoredThemeName = (): JQueryUiThemeName => {
    try {
        const savedHref = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedHref) {
            return getThemeNameFromHref(savedHref);
        }
    } catch { /* localStorage no disponible */ }

    return getThemeNameFromHref($('#theme').attr('href') ?? undefined);
};


/**
 * Aplica el tema de jQuery UI indicado:
 * actualiza el `href` del `<link id="theme">`, persiste la elección en
 * localStorage (para sobrevivir a View Transitions), marca el botón activo
 * y reinicia los tooltips para que adopten el nuevo tema.
 */
export const applyTheme = (themeName: JQueryUiThemeName) => {
    const $theme = getThemeLink();
    const themeHref = jqueryUiThemeHrefs[themeName] ?? defaultJQueryUiThemeHref;

    if (!$theme.length) {
        return;
    }

    if ($theme.attr('href') !== themeHref) {
        $theme.attr('href', themeHref);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeHref);
        } catch { /* localStorage no disponible */ }
        refreshTooltips();
    }

    markActiveTheme(themeName);
};
