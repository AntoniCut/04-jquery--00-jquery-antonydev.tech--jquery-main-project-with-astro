/*
    
    *  ---------------------------------------------------------------  *
    *  -----  jquery-menus.ts  --  /src/scripts/jquery-menus.ts  -----  *
    *  ---------------------------------------------------------------  *
*/

import {
    defaultJQueryUiThemeHref,
    defaultJQueryUiThemeName,
    jqueryUiThemeHrefs,
    type JQueryUiThemeName,
} from './jquery-ui-theme-urls';


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

const getThemeLink = () => $('#theme');

const getThemeButtonsContainer = () => $('#linksThemesContainer');

const markActiveTheme = (themeName: JQueryUiThemeName) => {
    const $linksThemesContainer = getThemeButtonsContainer();

    $linksThemesContainer.find('a').removeClass('active');
    $linksThemesContainer.find(`[data-theme="${themeName}"]`).addClass('active');
};

const getThemeNameFromHref = (themeHref?: string) => {
    if (!themeHref) {
        return defaultJQueryUiThemeName;
    }

    const themeEntries = Object.entries(jqueryUiThemeHrefs) as Array<[JQueryUiThemeName, string]>;
    const matchingTheme = themeEntries.find(([, href]) => href === themeHref);

    return matchingTheme?.[0] ?? defaultJQueryUiThemeName;
};

const refreshTooltips = () => {
    destroyTooltips();
    initializeTooltips();
};

const applyTheme = (themeName: JQueryUiThemeName) => {
    
    const $theme = getThemeLink();
    const themeHref = jqueryUiThemeHrefs[themeName] ?? defaultJQueryUiThemeHref;

    if (!$theme.length) {
        return;
    }

    if ($theme.attr('href') !== themeHref) {
        $theme.attr('href', themeHref);
        refreshTooltips();
    }

    markActiveTheme(themeName);
};

const destroyTooltips = () => {
    
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

const initializeTooltips = () => {
    const $document = $(document);

    if (typeof $document.tooltip !== 'function') {
        return;
    }

    $document.tooltip();
};

const syncInitialState = () => {

    const menuMain = getMainMenu();
    const menuThemes = getThemesMenu();
    const $theme = getThemeLink();

    menuMain.container.hide();
    menuMain.btnClose.hide();
    menuMain.btnOpen.show();

    menuThemes.container.hide();
    menuThemes.btnClose.hide();
    menuThemes.btnOpen.show();

    const currentThemeName = getThemeNameFromHref($theme.attr('href') ?? undefined);
    applyTheme(currentThemeName);
};

const bindHandlers = () => {
    //$(document).off(EVENT_NAMESPACE);

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

export const initializeJQueryMenus = () => {
    syncInitialState();
    bindHandlers();
    initializeTooltips();
    initializeDraggable();
};