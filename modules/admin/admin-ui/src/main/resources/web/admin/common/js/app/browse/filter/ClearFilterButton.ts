import {AEl} from "../../../dom/AEl";

export class ClearFilterButton extends AEl {

        constructor() {
            super('clear-filter-button');
            this.getEl().setInnerHtml('Clear');
            this.getHTMLElement().setAttribute('href', 'javascript:;');
            this.hide();
        }
    }
