import {Button} from "./Button";
import {KeyBindings} from "../KeyBindings";
import {Action} from "../Action";
import {KeyBindingAction} from "../KeyBinding";
import {Tooltip} from "../Tooltip";

export class ActionButton extends Button {

        private action: Action;
        private tooltip: Tooltip;

        constructor(action: Action, showTooltip: boolean = true) {
            this.action = action;

            super(this.createLabel(action));
            this.addClass("action-button");

            this.setEnabled(this.action.isEnabled());

            if (this.action.getIconClass()) {
                this.addClass(action.getIconClass());
            }

            if (this.action.hasShortcut() && showTooltip) {
                this.tooltip = new Tooltip(this, this.action.getShortcut().getCombination(), 1000);
                KeyBindings.get().onHelpKeyPressed((e) => {
                    if (this.action.isEnabled() && KeyBindings.get().isActive(this.action.getShortcut())) {
                        if (KeyBindingAction[KeyBindingAction.KEYDOWN].toLowerCase() == e.type) {
                            this.tooltip.show();
                            return;
                        }
                    }
                    this.tooltip.hide();
                });
            }

            this.onClicked((event: MouseEvent) => {
                this.action.execute();
            });

            this.action.onPropertyChanged((action: Action) => {
                this.setEnabled(action.isEnabled());
                this.setVisible(action.isVisible());
                this.setLabel(this.createLabel(action));
            });
        }

        getAction(): Action {
            return this.action;
        }

        getTooltip(): Tooltip {
            return this.tooltip;
        }

        private createLabel(action: Action): string {
            var label: string;
            if (action.hasMnemonic()) {
                label = action.getMnemonic().underlineMnemonic(action.getLabel());
            } else {
                label = action.getLabel();
            }
            return label;
        }

    }
