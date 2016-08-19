import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class FieldsetEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("fieldset").setClassName(className));
        }
    }
