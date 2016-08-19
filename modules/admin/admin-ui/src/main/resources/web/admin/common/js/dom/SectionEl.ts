import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class SectionEl extends Element {

        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("section").setClassName(className));
        }
    }
