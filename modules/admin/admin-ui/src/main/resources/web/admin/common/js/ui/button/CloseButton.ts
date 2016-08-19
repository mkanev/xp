import {Button} from "./Button";

export class CloseButton extends Button {

        constructor(className?: string) {
            super();
            this.addClass('close-button icon-medium icon-close2');
            if (className) {
                this.addClass(className);
            }
        }
    }

