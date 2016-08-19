import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class EmEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("em").setClassName(className));
        }
    }
