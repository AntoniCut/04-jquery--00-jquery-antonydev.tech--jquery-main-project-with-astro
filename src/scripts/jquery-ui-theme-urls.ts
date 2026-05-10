/*
    *  -------------------------------------------------------------------------------  *
    *  -----  jquery-ui-theme-urls.ts  --  /src/scripts/jquery-ui-theme-urls.ts  -----  *
    *  -------------------------------------------------------------------------------  *
*/




/**
 * ----------------------------------
 * -----  `themeAssetBasePath`  -----
 * ----------------------------------
 * - Ruta base donde se encuentran los archivos CSS de los temas de jQuery UI.
 * - Corresponde a la carpeta `themes-jquery-ui` dentro del directorio `public/`.
 */

const themeAssetBasePath = '/themes-jquery-ui';



/**
 * --------------------------------
 * -----  `buildThemeHref()`  -----
 * --------------------------------
 * - Construye la ruta completa al archivo CSS de un tema de jQuery UI.
 * - El archivo resultante sigue la convención: `/{base}/{themeName}/jquery-ui.min.css`.
 * @param themeName - Nombre del tema (ej. `'dark-hive'`, `'smoothness'`).
 * @returns Ruta absoluta al CSS del tema.
 */

const buildThemeHref = (themeName: string) => `${themeAssetBasePath}/${themeName}/jquery-ui.min.css`;



/**
 * ------------------------------
 * -----  `jqueryUiThemeHrefs`  -----
 * ------------------------------
 * - Mapa inmutable que asocia cada nombre de tema de jQuery UI con su href CSS correspondiente.
 * - Generado a partir de `buildThemeHref()` para garantizar coherencia de rutas.
 * - Usar como fuente de verdad para validar y aplicar temas en toda la aplicación.
 */

export const jqueryUiThemeHrefs = {
    'ui-lightness': buildThemeHref('ui-lightness'),
    'ui-darkness': buildThemeHref('ui-darkness'),
    'base': buildThemeHref('base'),
    'black-tie': buildThemeHref('black-tie'),
    'blitzer': buildThemeHref('blitzer'),
    'cupertino': buildThemeHref('cupertino'),
    'dark-hive': buildThemeHref('dark-hive'),
    'dot-luv': buildThemeHref('dot-luv'),
    'eggplant': buildThemeHref('eggplant'),
    'excite-bike': buildThemeHref('excite-bike'),
    'flick': buildThemeHref('flick'),
    'hot-sneaks': buildThemeHref('hot-sneaks'),
    'humanity': buildThemeHref('humanity'),
    'le-frog': buildThemeHref('le-frog'),
    'mint-choc': buildThemeHref('mint-choc'),
    'overcast': buildThemeHref('overcast'),
    'pepper-grinder': buildThemeHref('pepper-grinder'),
    'redmond': buildThemeHref('redmond'),
    'smoothness': buildThemeHref('smoothness'),
    'south-street': buildThemeHref('south-street'),
    'start': buildThemeHref('start'),
    'sunny': buildThemeHref('sunny'),
    'swanky-purse': buildThemeHref('swanky-purse'),
    'trontastic': buildThemeHref('trontastic'),
    'vader': buildThemeHref('vader'),
    'custom': buildThemeHref('custom'),
} as const;


export type JQueryUiThemeName = keyof typeof jqueryUiThemeHrefs;



/**
 * ----------------------------------------
 * -----  `defaultJQueryUiThemeName`  -----
 * ----------------------------------------
 * - Nombre del tema de jQuery UI que se aplica por defecto al cargar la aplicación.
 */

export const defaultJQueryUiThemeName: JQueryUiThemeName = 'base';


/**
 * ----------------------------------------
 * -----  `defaultJQueryUiThemeHref`  -----
 * ----------------------------------------
 * - Href CSS del tema por defecto. Usado en el `<link id="theme">` inicial del layout
 *   y como fallback cuando no hay tema persistido en `localStorage`.
 */

export const defaultJQueryUiThemeHref = jqueryUiThemeHrefs[defaultJQueryUiThemeName];
