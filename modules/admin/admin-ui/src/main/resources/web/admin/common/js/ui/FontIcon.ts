import {DivEl} from "../dom/DivEl";
import {StyleHelper} from "../StyleHelper";

export class FontIcon extends DivEl {
        constructor(iconClass: string) {
            super("font-icon " + iconClass, StyleHelper.getCurrentPrefix());
        }
    }
