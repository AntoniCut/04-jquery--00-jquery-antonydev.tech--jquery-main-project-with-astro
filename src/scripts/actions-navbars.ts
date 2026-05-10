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


type MenuControls = {
    container: JQuery<HTMLElement>;
    btnOpen: JQuery<HTMLElement>;
    btnClose: JQuery<HTMLElement>;
};

const EVENT_NAMESPACE = '.astroJqueryMenus';

const getJQuery = () => {
    const jqueryInstance = window.jQuery ?? window.$;

    if (!jqueryInstance) {
        throw new Error('jQuery no esta cargado antes de inicializar los menus.');
    }

    return jqueryInstance;
};

const $ = getJQuery();

const getMainMenu = (): MenuControls => ({
    container: $('.navbar__container'),
    btnOpen: $('.navbar__btn-open'),
    btnClose: $('.navbar__btn-close'),
});

const getThemesMenu = (): MenuControls => ({
    container: $('#linksThemesContainer'),
    btnOpen: $('.navbar-ui__btn-open'),
    btnClose: $('.navbar-ui__btn-close'),
});

const showMenuContainer = (container: JQuery<HTMLElement>) => {
    container.css('display', 'flex').hide().slideDown(250);
};

const openMenu = (menu: MenuControls) => {
    menu.container.stop(true, true);
    showMenuContainer(menu.container);
    menu.btnOpen.hide();
    menu.btnClose.show();
};

const closeMenu = (menu: MenuControls) => {
    menu.container.stop(true, true).slideUp(250);
    menu.btnOpen.show();
    menu.btnClose.hide();
};

const clickInside = (element: JQuery<HTMLElement>, target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return $(target).closest(element).length > 0;
};



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
 * Intercepta los clicks en los botones de tema en fase de CAPTURA,
 * antes de que el ClientRouter de Astro pueda procesar el href="#" y
 * añadir la almohadilla a la URL. Llama a preventDefault() sin detener
 * la propagación, de modo que jQuery recibe el evento igualmente.
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
 */


export const actionsNavbars = () => {
    preventThemeLinksNavigation();
    syncInitialState();
    bindHandlers();
    initializeTooltips();
    initializeDraggable();
};