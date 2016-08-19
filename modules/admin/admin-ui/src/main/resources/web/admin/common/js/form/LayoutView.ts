import {FormContext} from "./FormContext";
import {FormItemSetOccurrenceView} from "./FormItemSetOccurrenceView";
import {FormItemViewConfig} from "./FormItemView";
import {FormItemView} from "./FormItemView";
import {Layout} from "./Layout";

export interface LayoutViewConfig {

        context: FormContext;

        layout:Layout;

        parent: FormItemSetOccurrenceView;

        className:string
    }

    export class LayoutView extends FormItemView {

        private _layout: Layout;

        constructor(config: LayoutViewConfig) {
            super(<FormItemViewConfig>{
                className: config.className,
                context: config.context,
                formItem: config.layout,
                parent: config.parent
            });

            this._layout = config.layout;
        }

    }
