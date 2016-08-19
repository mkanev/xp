import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class AsideEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("aside").setClassName(className));
        }
    }
