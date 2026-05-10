/*
    
    *  ---------------------------------------------------------------------  *
    *  -----  actions-navbars.ts  --  /src/scripts/actions-navbars.ts  -----  *
    *  ---------------------------------------------------------------------  *
*/


import {
    jqueryUiThemeHrefs,
    type JQueryUiThemeName,
} from './jquery-ui-theme-urls';


import {
    applyTheme,
    getRestoredThemeName,
    initializeTooltips,
} from './change-themes-jquery-ui';



/**
 * ----------------------------
 * -----  `MenuControls`  -----
 * ----------------------------
 * - Define la estructura de los controles de un menú (contenedor, botón de abrir y botón de cerrar).
 * - Se utiliza para tipar los objetos que representan los menús en el DOM.
 */

type MenuControls = {
    container: JQuery<HTMLElement>;
    btnOpen: JQuery<HTMLElement>;
    btnClose: JQuery<HTMLElement>;
};



const EVENT_NAMESPACE = '.astroJqueryMenus';



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
    
    /** -----  Instancia de jQuery disponible en el objeto `window`  ----- */
    const jqueryInstance = window.jQuery ?? window.$;

    if (!jqueryInstance) {
        throw new Error('jQuery no esta cargado antes de inicializar los menus.');
    }

    return jqueryInstance;
};



/**  -----  Obtenemos la `instancia de jQuery` disponible en el objeto `window`  ----- */
const $ = getJQuery();



/**
 * -----------------------------
 * -----  `getMainMenu()`  -----
 * -----------------------------
 * - Devuelve los controles del menú principal de navegación.
 * @returns Objeto `MenuControls` con el contenedor y los botones de apertura/cierre.
 */

const getMainMenu = (): MenuControls => ({
    container: $('.navbar__container'),
    btnOpen: $('.navbar__btn-open'),
    btnClose: $('.navbar__btn-close'),
});



/**
 * -------------------------------
 * -----  `getThemesMenu()`  -----
 * -------------------------------
 * - Devuelve los controles del menú de temas de jQuery UI.
 * @returns Objeto `MenuControls` con el contenedor y los botones de apertura/cierre.
 */
const getThemesMenu = (): MenuControls => ({
    container: $('#linksThemesContainer'),
    btnOpen: $('.navbar-ui__btn-open'),
    btnClose: $('.navbar-ui__btn-close'),
});



/**
 * ----------------------------------
 * -----  `showMenuContainer()`  -----
 * ----------------------------------
 * - Muestra el contenedor de un menú con una animación `slideDown`.
 * @param container - Elemento jQuery que representa el contenedor del menú.
 */
const showMenuContainer = (container: JQuery<HTMLElement>) => {
    container.css('display', 'flex').hide().slideDown(250);
};



/**
 * --------------------------
 * -----  `openMenu()`  -----
 * --------------------------
 * - Abre un menú mostrando su contenedor y actualizando la visibilidad de sus botones.
 * @param menu - Objeto `MenuControls` del menú a abrir.
 */

const openMenu = (menu: MenuControls) => {
    menu.container.stop(true, true);
    showMenuContainer(menu.container);
    menu.btnOpen.hide();
    menu.btnClose.show();
};



/**
 * ---------------------------
 * -----  `closeMenu()`  -----
 * ---------------------------
 * - Cierra un menú ocultando su contenedor con `slideUp` y actualizando la visibilidad de sus botones.
 * @param menu - Objeto `MenuControls` del menú a cerrar.
 */

const closeMenu = (menu: MenuControls) => {
    menu.container.stop(true, true).slideUp(250);
    menu.btnOpen.show();
    menu.btnClose.hide();
};



/**
 * -----------------------------
 * -----  `clickInside()`  -----
 * -----------------------------
 * - Comprueba si el `target` de un evento de click se encuentra dentro de un elemento jQuery.
 * @param element - Elemento jQuery que actúa como contenedor.
 * @param target - `EventTarget` del evento de click.
 * @returns `true` si el target está dentro del elemento, `false` en caso contrario.
 */

const clickInside = (element: JQuery<HTMLElement>, target: EventTarget | null) => {
    
    if (!(target instanceof HTMLElement)) 
        return false;
    
    return $(target).closest(element).length > 0;
};



/**
 * ----------------------------------
 * -----  `syncInitialState()`  -----
 * -----------------------------------
 * - Sincroniza el estado visual inicial de los menús y aplica el tema de jQuery UI guardado.
 * - Oculta ambos menús y sus botones de cierre, muestra los botones de apertura.
 * - Recupera el tema almacenado en `localStorage` y lo aplica al `<link id="theme">`.
 */

const syncInitialState = () => {

    const menuMain = getMainMenu();
    const menuThemes = getThemesMenu();

    menuMain.container.hide();
    menuMain.btnClose.hide();
    menuMain.btnOpen.show();

    menuThemes.container.hide();
    menuThemes.btnClose.hide();
    menuThemes.btnOpen.show();

    const currentThemeName = getRestoredThemeName();
    applyTheme(currentThemeName);
};



/**
 * ------------------------------
 * -----  `bindHandlers()`  -----
 * ------------------------------
 * - Registra todos los manejadores de eventos delegados en el `document`.
 * - Gestiona la apertura/cierre de menús, el cambio de tema de jQuery UI
 *   y el cierre al hacer click fuera de los menús.
 * - Usa el namespace `EVENT_NAMESPACE` para poder desregistrar los handlers con `.off()`.
 */

const bindHandlers = () => {
    
    $(document).off(EVENT_NAMESPACE);

    $(document).on(`click${EVENT_NAMESPACE}`, '.navbar__btn-open', function (event) {
        event.stopPropagation();

        openMenu(getMainMenu());
        closeMenu(getThemesMenu());
    });

    $(document).on(`click${EVENT_NAMESPACE}`, '.navbar__btn-close', function (event) {
        event.stopPropagation();
        closeMenu(getMainMenu());
    });

    $(document).on(`click${EVENT_NAMESPACE}`, '.navbar-ui__btn-open', function (event) {
        event.stopPropagation();

        openMenu(getThemesMenu());
        closeMenu(getMainMenu());
    });

    $(document).on(`click${EVENT_NAMESPACE}`, '.navbar-ui__btn-close', function (event) {
        event.stopPropagation();
        closeMenu(getThemesMenu());
    });

    $(document).on(`click${EVENT_NAMESPACE}`, '#linksThemesContainer a', function (event) {
        
        event.preventDefault();
        event.stopPropagation();

        const themeName = $(this).data('theme');
        console.log('Tema seleccionado:', themeName);

        if (typeof themeName !== 'string' || !(themeName in jqueryUiThemeHrefs)) {
            return;
        }

        applyTheme(themeName as JQueryUiThemeName);
    });

    $(document).on(`click${EVENT_NAMESPACE}`, function (event) {
        const menuMain = getMainMenu();
        const menuThemes = getThemesMenu();

        const clickMain =
            clickInside(menuMain.container, event.target) ||
            clickInside(menuMain.btnOpen, event.target);

        const clickThemes =
            clickInside(menuThemes.container, event.target) ||
            clickInside(menuThemes.btnOpen, event.target);

        if (!clickMain) {
            closeMenu(menuMain);
        }

        if (!clickThemes) {
            closeMenu(menuThemes);
        }
    });
};



/**
 * -------------------------------------
 * -----  `initializeDraggable()`  -----
 * -------------------------------------
 * - Inicializa el widget `draggable` de jQuery UI en los navbars
 *   `#layoutNavbar` y `#layoutNavbarThemesUI` si el widget está disponible.
 */

const initializeDraggable = () => {
    
    const layoutNavbar = $('#layoutNavbar');

    const layoutNavbarThemesUI = $('#layoutNavbarThemesUI');

    if (layoutNavbar.length && typeof layoutNavbar.draggable === 'function') 
        layoutNavbar.draggable();

    if (layoutNavbarThemesUI.length && typeof layoutNavbarThemesUI.draggable === 'function')
        layoutNavbarThemesUI.draggable();
    
};



/**
 * ---------------------------------------------
 * -----  `preventThemeLinksNavigation()`  -----
 * ---------------------------------------------
 * - Intercepta los clicks en los botones de tema en fase de CAPTURA,
 *   antes de que el ClientRouter de Astro pueda procesar el href="#" y
 *   añadir la almohadilla a la URL. Llama a preventDefault() sin detener
 *   la propagación, de modo que jQuery recibe el evento igualmente.
 */
const preventThemeLinksNavigation = () => {
    
    document.addEventListener(
        'click',
        (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.closest('#linksThemesContainer a[data-theme]')) {
                event.preventDefault();
            }
        },
        true, // capture: true → corre ANTES que el ClientRouter de Astro
    );
};



/**
 * --------------------------------
 * -----  `actionsNavbars()`  ----- 
 * --------------------------------
 * - Punto de entrada principal. Inicializa todos los comportamientos interactivos de los navbars:
 *   previene la navegación del router de Astro en los links de temas, sincroniza el estado
 *   inicial, registra los handlers de eventos, inicializa los tooltips y el draggable.
 */

export const actionsNavbars = () => {
    preventThemeLinksNavigation();
    syncInitialState();
    bindHandlers();
    initializeTooltips();
    initializeDraggable();
};