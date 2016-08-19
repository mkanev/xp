import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class H6El extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("h6").setClassName(className));
        }

    }
