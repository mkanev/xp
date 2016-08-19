import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class H3El extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("h3").setClassName(className));
        }

    }
