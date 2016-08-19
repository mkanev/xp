import {DivEl} from "../../dom/DivEl";
import {SpanEl} from "../../dom/SpanEl";
import {StyleHelper} from "../../StyleHelper";
import {Element} from "../../dom/Element";

export class FoldButton extends DivEl {

        private span: SpanEl;
        private dropdown: DivEl;
        private widthCache: number[] = [];

        constructor() {
            super("button", StyleHelper.COMMON_PREFIX);

            this.addClass("fold-button");

            this.dropdown = new DivEl("dropdown", StyleHelper.COMMON_PREFIX);
            this.appendChild(this.dropdown);

            this.span = new SpanEl('fold-label');
            this.span.setHtml("More");
            this.appendChild(this.span);
        }

        push(element: Element, width: number) {
            this.dropdown.prependChild(element);
            this.widthCache.unshift(width);
        }

        pop(): Element {
            var top = this.dropdown.getFirstChild();
            this.dropdown.removeChild(top);
            this.widthCache.shift();
            return top;
        }

        setLabel(label: string) {
            this.span.setHtml(label);
        }

        getDropdown(): DivEl {
            return this.dropdown;
        }

        getNextButtonWidth(): number {
            return this.widthCache[0];
        }

        getButtonsCount(): number {
            return this.dropdown.getChildren().length;
        }

        isEmpty(): boolean {
            return this.dropdown.getChildren().length == 0;
        }

    }

