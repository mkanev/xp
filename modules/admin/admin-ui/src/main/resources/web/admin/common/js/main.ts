import {StyleHelper} from "./StyleHelper";

/**
 * Main file for all admin API classes and methods.
 */

declare var Mousetrap:MousetrapStatic;

/*
 Prefix must match @_CLS_PREFIX in web\admin\common\styles\_module.less
 */
StyleHelper.setCurrentPrefix(StyleHelper.ADMIN_PREFIX);

wemQ.longStackSupport = true;