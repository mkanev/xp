import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class H1El extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("h1").setClassName(className));
        }

    }
