import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class PEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("p").setClassName(className));
        }

    }
