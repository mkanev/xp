import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class LiEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("li").setClassName(className));
        }
    }
