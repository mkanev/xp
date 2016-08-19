import {DivEl} from "../../../dom/DivEl";
import {H6El} from "../../../dom/H6El";

export class ImageCroppingNameView extends DivEl {

        private mainNameEl: H6El;

        private addTitleAttribute: boolean;

        constructor(addTitleAttribute: boolean = true) {
            super("names-view");

            this.addTitleAttribute = addTitleAttribute

            this.mainNameEl = new H6El("main-name");
            this.appendChild(this.mainNameEl);
        }

        setMainName(value: string): ImageCroppingNameView {
            this.mainNameEl.setHtml(value);
            if (this.addTitleAttribute) {
                this.mainNameEl.getEl().setAttribute("title", value);
            }
            return this;
        }
    }
