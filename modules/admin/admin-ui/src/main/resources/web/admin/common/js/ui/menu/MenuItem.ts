import {LiEl} from "../../dom/LiEl";
import {Action} from "../Action";

export class MenuItem extends LiEl {

        private action:Action;

        constructor(action:Action) {
            super("menu-item");
            this.action = action;
            this.getEl().setInnerHtml(this.action.getLabel());
            this.onClicked((event: MouseEvent) => {
                if (action.isEnabled()) {
                    this.action.execute();
                }
            });
            this.setEnabled(action.isEnabled());

            action.onPropertyChanged((action: Action) => {
                this.setEnabled(action.isEnabled());
                this.setVisible(action.isVisible());
            });
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
        
        isEnabled(): boolean {
            return this.action.isEnabled();
        }
    }

