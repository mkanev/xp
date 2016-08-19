import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class DdDtEl extends Element {

        constructor(tag: string, className?: string) {
            super(this.getElementBuilder(tag).setClassName(className));
        }

        private getElementBuilder(tag: string): NewElementBuilder {
            var builder = new NewElementBuilder();
            if (tag == "dt" || tag == "dd") {
                builder.setTagName(tag);
            }

            return builder;
        }
    }
