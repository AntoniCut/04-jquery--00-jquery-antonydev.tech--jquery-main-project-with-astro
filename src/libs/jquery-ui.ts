/*
    *  ---------------------------------------------------------  *
    *  -----  jquery-ui.ts  --  /src/libs/jquery-ui.ts  --------  *
    *  ---------------------------------------------------------  *
*/


/**
 * ------------------------------------------------------------------
 * -----  jQuery UI — widgets seleccionados desde node_modules  -----
 * ------------------------------------------------------------------
 *
 * Cada import es un side-effect: extiende `$` / `$.fn` sin exportar nada.
 * Vite los procesa y los incluye en el bundle final.
 *
 * Para añadir más widgets, descomenta la línea correspondiente
 * o añade un nuevo import con la ruta del widget:
 *
 *   import 'jquery-ui/ui/widgets/dialog.js';
 *   import 'jquery-ui/ui/widgets/resizable.js';
 *   import 'jquery-ui/ui/widgets/slider.js';
 *   ...
 *
 * Widgets disponibles en node_modules/jquery-ui/ui/widgets/:
 *   accordion.js · autocomplete.js · button.js · checkboxradio.js
 *   controlgroup.js · datepicker.js · dialog.js · draggable.js
 *   droppable.js · menu.js · mouse.js · progressbar.js · resizable.js
 *   selectable.js · selectmenu.js · slider.js · sortable.js
 *   spinner.js · tabs.js · tooltip.js
 */


// ----- Núcleo obligatorio (requerido por todos los widgets) -----
import 'jquery-ui/ui/version.js';
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/data.js';
import 'jquery-ui/ui/plugin.js';
import 'jquery-ui/ui/scroll-parent.js';
import 'jquery-ui/ui/keycode.js';
import 'jquery-ui/ui/position.js';
import 'jquery-ui/ui/unique-id.js';


// ----- Widgets activos -----
import 'jquery-ui/ui/widgets/mouse.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/tooltip.js';
