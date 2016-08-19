import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class BrEl extends Element {

        constructor() {
            super(new NewElementBuilder().setTagName("br"));
        }
    }
