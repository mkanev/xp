import {FormInputEl} from "../../dom/FormInputEl";
import {Element} from "../../dom/Element";
import {DivEl} from "../../dom/DivEl";
import {ElementAddedEvent} from "../../dom/ElementAddedEvent";
import {ElementShownEvent} from "../../dom/ElementShownEvent";
import {ValueChangedEvent} from "../../ValueChangedEvent";
import {WindowDOM} from "../../dom/WindowDOM";

export class TextAreaInput extends FormInputEl {

        private attendant: Element;

        private clone: Element;

        constructor(name: string, originalValue?: string) {
            super("textarea", "text-area", undefined, originalValue);
            this.getEl().setAttribute("name", name);

            this.onInput((event: Event) => {
                this.refreshDirtyState();
                this.refreshValueChanged();
            });

            this.clone = new DivEl('autosize-clone').addClass(this.getEl().getAttribute('class'));
            this.attendant = new DivEl('autosize-attendant');
            this.attendant.appendChild(this.clone);

            this.onAdded((event: ElementAddedEvent) => {
                this.attendant.insertAfterEl(this);
            });

            this.onShown((event: ElementShownEvent) => this.updateSize());
            this.onValueChanged((event: ValueChangedEvent) => this.updateSize());
            WindowDOM.get().onResized((event: UIEvent) => this.updateSize(), this);
        }

        setRows(rows: number) {
            this.getEl().setAttribute("rows", rows.toString());
        }

        setColumns(columns: number) {
            this.getEl().setAttribute("cols", columns.toString());
        }

        private updateSize() {
            if (this.isRendered()) {
                this.clone.getEl().setInnerHtml(this.getValue() + " ");
                this.getEl().setHeightPx(this.clone.getEl().getHeightWithBorder());
            }
        }
    }

