import {NewElementBuilder} from "./Element";
import {Element} from "./Element";

export class ArticleEl extends Element {

        constructor(className?: string, contentEditable?: boolean) {
            super(new NewElementBuilder().setTagName("article").setClassName(className));
            this.setContentEditable(contentEditable);
        }

    }
