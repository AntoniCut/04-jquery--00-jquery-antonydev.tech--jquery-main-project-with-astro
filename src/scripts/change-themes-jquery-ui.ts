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


/**
 * ----------------------------------
 * -----  `THEME_STORAGE_KEY`  -----
 * ----------------------------------
 * - Clave usada en `localStorage` para persistir el href del tema activo entre navegaciones.
 * - Permite sobrevivir a las View Transitions de Astro, que reinician el `<head>` en cada página.
 */
const THEME_STORAGE_KEY = 'jqui-theme-href';


/**
 * ---------------------------
 * -----  `getJQuery()`  -----
 * ---------------------------
 * - Obtiene la instancia de jQuery disponible en el objeto `window`.
 * - Lanza un error si jQuery no está cargado.
 * @returns La instancia de jQuery.
 * @throws Error si jQuery no está cargado.
 */

const getJQuery = () => {
    
    const jqueryInstance = window.jQuery ?? window.$;

    if (!jqueryInstance) {
        throw new Error('jQuery no esta cargado antes de inicializar el cambio de temas.');
    }

    return jqueryInstance;
};


/**  -----  Obtenemos la `instancia de jQuery` disponible en el objeto `window`  ----- */
const $ = getJQuery();


// ----- Helpers de DOM -----


/**
 * ----------------------------
 * -----  `getThemeLink()`  -----
 * ----------------------------
 * - Devuelve el elemento `<link id="theme">` del `<head>` como objeto jQuery.
 * - Es la referencia al nodo que controla el CSS del tema activo de jQuery UI.
 * @returns Elemento jQuery correspondiente a `#theme`.
 */
const getThemeLink = () => $('#theme');



/**
 * -------------------------------------------
 * -----  `getThemeButtonsContainer()`  -----
 * -------------------------------------------
 * - Devuelve el contenedor `#linksThemesContainer` como objeto jQuery.
 * - Es el elemento padre que agrupa todos los botones/links de selección de tema.
 * @returns Elemento jQuery correspondiente a `#linksThemesContainer`.
 */

const getThemeButtonsContainer = () => $('#linksThemesContainer');


// ----- Estado visual del tema activo -----


/**
 * --------------------------------
 * -----  `markActiveTheme()`  -----
 * --------------------------------
 * - Actualiza el estado visual de los botones de tema marcando como activo el seleccionado.
 * - Elimina la clase `active` de todos los links y la añade únicamente al que corresponde
 *   al `themeName` indicado mediante el atributo `data-theme`.
 * @param themeName - Nombre del tema a marcar como activo.
 */

const markActiveTheme = (themeName: JQueryUiThemeName) => {
    const $linksThemesContainer = getThemeButtonsContainer();

    $linksThemesContainer.find('a').removeClass('active');
    $linksThemesContainer.find(`[data-theme="${themeName}"]`).addClass('active');
};



/**
 * -----------------------------------
 * -----  `getThemeNameFromHref()`  -----
 * -----------------------------------
 * - Resuelve el nombre del tema a partir del `href` del `<link id="theme">` actual.
 * - Compara el href recibido contra los valores de `jqueryUiThemeHrefs`.
 * - Si no coincide con ningún tema conocido, devuelve el tema por defecto.
 * @param themeHref - Href del tema a resolver. Puede ser `undefined`.
 * @returns Nombre del tema correspondiente al href, o el tema por defecto.
 */

export const getThemeNameFromHref = (themeHref?: string): JQueryUiThemeName => {
    
    if (!themeHref)
        return defaultJQueryUiThemeName;
    
    const themeEntries = Object.entries(jqueryUiThemeHrefs) as Array<[JQueryUiThemeName, string]>;
    const matchingTheme = themeEntries.find(([, href]) => href === themeHref);

    return matchingTheme?.[0] ?? defaultJQueryUiThemeName;
};



// ----- Gestión de tooltips -----


/**
 * --------------------------------
 * -----  `destroyTooltips()`  -----
 * --------------------------------
 * - Destruye el widget `tooltip` de jQuery UI inicializado en el `document`.
 * - Verifica que el método `tooltip` exista antes de intentar destruirlo.
 * - No lanza excepciones si el widget no estaba inicializado.
 */

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



/**
 * ----------------------------------
 * -----  `initializeTooltips()`  -----
 * ----------------------------------
 * - Inicializa el widget `tooltip` de jQuery UI en el `document`.
 * - Verifica que el método `tooltip` esté disponible antes de inicializarlo.
 * - Debe llamarse después de que jQuery UI esté completamente cargado.
 */

export const initializeTooltips = () => {
    const $document = $(document);

    if (typeof $document.tooltip !== 'function') {
        return;
    }

    $document.tooltip();
};



/**
 * ---------------------------------
 * -----  `refreshTooltips()`  -----
 * ---------------------------------
 * - Reinicia el widget `tooltip` destruyendo la instancia actual y creando una nueva.
 * - Se usa al cambiar de tema para que los tooltips adopten los estilos del nuevo tema.
 */

const refreshTooltips = () => {
    destroyTooltips();
    initializeTooltips();
};



/**
 * ----------------------------------
 * -----  `getRestoredThemeName()`  -----
 * ----------------------------------
 * - Recupera el nombre del tema activo sobreviviendo a las View Transitions de Astro.
 * - Prioridad: `localStorage` → atributo `href` del `<link id="theme">` → tema por defecto.
 * - Usar esta función en `syncInitialState()` para restaurar el tema en cada navegación.
 * @returns Nombre del tema guardado, o el tema por defecto si no hay ninguno persistido.
 */

export const getRestoredThemeName = (): JQueryUiThemeName => {
    
    try {
        const savedHref = localStorage.getItem(THEME_STORAGE_KEY);
        
        if (savedHref) 
            return getThemeNameFromHref(savedHref);
        
    } catch { 
        /* localStorage no disponible */ 
    }

    return getThemeNameFromHref($('#theme').attr('href') ?? undefined);
};



/**
 * ----------------------------
 * -----  `applyTheme()`  -----
 * ----------------------------
 * - Aplica el tema de jQuery UI indicado actualizando el `href` del `<link id="theme">`.
 * - Persiste la elección en `localStorage` para sobrevivir a las View Transitions de Astro.
 * - Marca el botón de tema correspondiente como activo con la clase `active`.
 * - Reinicia los tooltips para que adopten los estilos del nuevo tema.
 * @param themeName - Nombre del tema a aplicar.
 */

export const applyTheme = (themeName: JQueryUiThemeName) => {
    
    const $theme = getThemeLink();
    const themeHref = jqueryUiThemeHrefs[themeName] ?? defaultJQueryUiThemeHref;

    if (!$theme.length) 
        return;
    

    if ($theme.attr('href') !== themeHref) {
        $theme.attr('href', themeHref);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, themeHref);
        } catch { /* localStorage no disponible */ }
        refreshTooltips();
    }

    markActiveTheme(themeName);
    
};
