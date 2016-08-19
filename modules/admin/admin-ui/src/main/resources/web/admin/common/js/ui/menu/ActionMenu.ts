import {DivEl} from "../../dom/DivEl";
import {UlEl} from "../../dom/UlEl";
import {Action} from "../Action";
import {ActionMenuItem} from "./ActionMenuItem";

export class ActionMenu extends DivEl {

        private actionListEl: UlEl;

        private labelEl: DivEl;

        constructor(label: string, ...actions: Action[]) {
            super("action-menu");
            this.labelEl = new DivEl("drop-down-button icon-arrow-down");
            this.labelEl.setHtml(label);
            this.appendChild(this.labelEl);

            this.actionListEl = new UlEl();
            this.appendChild(this.actionListEl);

            if (actions.length > 0) {
                actions.forEach((action: Action) => {
                    this.addAction(action);
                });
            }

            this.labelEl.onClicked((event) => {
                if (this.hasClass("expanded")) {
                    this.removeClass("expanded");
                } else {
                    this.addClass("expanded");
                }
            });
        }

        setLabel(label: string) {
            this.labelEl.getEl().setInnerHtml(label);
        }

        addAction(action: Action) {
            var actionMenuItem = new ActionMenuItem(action);
            this.actionListEl.appendChild(actionMenuItem);
            actionMenuItem.onClicked(() => {
                this.removeClass("expanded");
            });
        }
    }
