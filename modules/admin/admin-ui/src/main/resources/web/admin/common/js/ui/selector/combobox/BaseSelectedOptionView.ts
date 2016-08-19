import {DivEl} from "../../../dom/DivEl";
import {Option} from "../Option";
import {AEl} from "../../../dom/AEl";
import {Element} from "../../../dom/Element";
import {SelectedOptionView} from "./SelectedOptionView";

export class BaseSelectedOptionView<T> extends DivEl implements SelectedOptionView<T> {

        private option: Option<T>;

        private optionValueEl: DivEl;

        private removeClickedListeners: {(): void;}[] = [];

        constructor(option: Option<T>) {
            super("selected-option");

            this.option = option;
        }

        setOption(option: Option<T>) {
            if (this.optionValueEl) {
                this.optionValueEl.getEl().setInnerHtml(option.displayValue.toString());
            }
        }

        getOption(): Option<T> {
            return this.option;
        }

        doRender(): wemQ.Promise<boolean> {

            var removeButtonEl = new AEl("remove");
            this.optionValueEl = new DivEl('option-value');
            if (this.option) {
                this.setOption(this.option);
            }

            removeButtonEl.onClicked((event: Event) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.appendChildren<Element>(removeButtonEl, this.optionValueEl);

            return wemQ(true);
        }

        protected notifyRemoveClicked() {
            this.removeClickedListeners.forEach((listener) => {
                listener();
            });
        }

        onRemoveClicked(listener: {(): void;}) {
            this.removeClickedListeners.push(listener);
        }

        unRemoveClicked(listener: {(): void;}) {
            this.removeClickedListeners = this.removeClickedListeners.filter(function (curr) {
                return curr != listener;
            });
        }
    }
