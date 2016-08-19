import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class IEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("i").setClassName(className));
        }
    }
