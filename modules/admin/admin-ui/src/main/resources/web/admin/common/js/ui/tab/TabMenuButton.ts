import {DivEl} from "../../dom/DivEl";
import {SpanEl} from "../../dom/SpanEl";

export class TabMenuButton extends DivEl {

        private labelEl: SpanEl;

        constructor() {
            super("tab-menu-button icon-arrow-down2");

            this.labelEl = new SpanEl('label');
            this.appendChild(this.labelEl);
        }

        setLabel(value: string, addTitle: boolean = true) {
            this.labelEl.setHtml(value);
            if (addTitle) {
                this.labelEl.getEl().setAttribute('title', value);
            }
        }
    }
