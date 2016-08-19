import {DivEl} from "../dom/DivEl";
import {Input} from "./Input";

export class InputLabel extends DivEl {

        private input:Input;

        constructor(input:Input) {
            super("input-label");

            this.input = input;

            var wrapper = new DivEl("wrapper");
            var label = new DivEl("label");
            label.getEl().setInnerHtml(input.getLabel());
            wrapper.getEl().appendChild(label.getHTMLElement());

            if( input.getOccurrences().required() ) {
                wrapper.addClass("required");
            }

            this.getEl().appendChild(wrapper.getHTMLElement());
        }
    }
