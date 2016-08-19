import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class UlEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("ul").setClassName(className));
        }
    }
