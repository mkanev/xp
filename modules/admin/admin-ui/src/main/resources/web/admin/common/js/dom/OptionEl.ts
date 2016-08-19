import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class OptionEl extends Element {

        constructor(value?: string, displayName?: string) {
            super(new NewElementBuilder().setTagName("option"));
            this.getEl().setValue(value);
            this.getEl().setInnerHtml(displayName);
        }
    }
