import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class SpanEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("span").setClassName(className));
        }
    }
