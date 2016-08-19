import {DdDtEl} from "../../dom/DdDtEl";
import {Action} from "../Action";

export class TreeMenuItem extends DdDtEl {

        private action: Action;

        constructor(action: Action, cls: string = "", expanded: boolean = false) {
            super(this.getTag(action), this.getCls(action, cls, expanded));
            this.action = action;
            this.getEl().setInnerHtml(this.action.getLabel());
            this.onClicked((event: MouseEvent) => {
                if (action.isEnabled()) {
                    if (action.hasChildActions()) {
                        this.toggleExpand();
                    }
                    else {
                        this.action.execute();
                    }
                }
            });
            this.setEnabled(action.isEnabled());

            action.onPropertyChanged((action: Action) => {
                this.setEnabled(action.isEnabled());
                this.setVisible(action.isVisible());
            });
        }

        public toggleExpand() {
            this.toggleClass("expanded");
        }

        private getTag(action: Action): string {
            return action.hasParentAction() ? "dd" : "dt";
        }

        private getCls(action: Action, cls: string = "", expanded: boolean = false): string {
            var fullCls = action.hasChildActions() ? "collapsible " : "";
            fullCls += expanded ? "expanded " : "";

            return fullCls + cls;
        }

        getAction(): Action {
            return this.action;
        }

        setEnabled(value: boolean) {
            var el = this.getEl();
            el.setDisabled(!value);
            if (value) {
                el.removeClass("disabled");
            } else {
                el.addClass("disabled");
            }
        }
    }

