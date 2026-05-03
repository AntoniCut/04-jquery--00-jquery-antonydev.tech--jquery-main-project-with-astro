




const themeAssetBasePath = '/themes-jquery-ui';

const buildThemeHref = (themeName: string) => `${themeAssetBasePath}/${themeName}/jquery-ui.min.css`;

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
} as const;

export type JQueryUiThemeName = keyof typeof jqueryUiThemeHrefs;

export const defaultJQueryUiThemeName: JQueryUiThemeName = 'base';
export const defaultJQueryUiThemeHref = jqueryUiThemeHrefs[defaultJQueryUiThemeName];