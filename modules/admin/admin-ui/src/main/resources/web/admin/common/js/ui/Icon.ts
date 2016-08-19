import {IEl} from "../dom/IEl";

export enum IconSize {
        SMALL,
        MEDIUM,
        LARGE
    }

    export class Icon extends IEl {
        constructor(iconClass:string, size?:IconSize) {
            super(iconClass);
            this.addClass("wem-icon");

            if (size == IconSize.SMALL) {
                this.addClass("icon-small");
            } else if (size == IconSize.MEDIUM) {
                this.addClass("icon-medium");
            } else if (size == IconSize.LARGE) {
                this.addClass("icon-large");
            }
        }
    }
