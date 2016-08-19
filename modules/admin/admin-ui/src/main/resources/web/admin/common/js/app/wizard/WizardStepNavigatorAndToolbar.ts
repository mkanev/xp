import {ResponsiveManager} from "../../ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../ui/responsive/ResponsiveItem";
import {Toolbar} from "../../ui/toolbar/Toolbar";
import {DivEl} from "../../dom/DivEl";
import {FoldButton} from "../../ui/toolbar/FoldButton";
import {WizardStepNavigator} from "./WizardStepNavigator";

export class WizardStepNavigatorAndToolbar extends DivEl {

        private foldButton: FoldButton;

        private stepToolbar: Toolbar;

        private stepNavigator: WizardStepNavigator;

        private minimized: boolean;

        private maxFittingWidth: number;


        constructor(className?: string) {
            super(className);
            this.foldButton = new FoldButton();
            this.foldButton.setLabel("Navigate to");
            this.appendChild(this.foldButton);
            this.minimized = false;
            this.maxFittingWidth = 0;

            this.foldButton.getDropdown().onClicked(() => {
                this.addClass("no-dropdown-hover");
                // Place call in the queue outside of the stack and current context,
                // so the repaint will be triggered between those two calls
                setTimeout(this.removeClass.bind(this, "no-dropdown-hover"));
            });
        }

        setStepToolbar(stepToolbar: Toolbar) {
            if (this.stepToolbar) {
                this.removeChild(this.stepToolbar);
            }
            this.stepToolbar = stepToolbar;

            this.stepToolbar.insertBeforeEl(this.foldButton);
        }

        setStepNavigator(stepNavigator: WizardStepNavigator) {
            if (this.stepNavigator) {
                this.removeChild(this.stepNavigator);
            }
            this.stepNavigator = stepNavigator;

            this.appendChild(this.stepNavigator);
        }

        isStepNavigatorFit(): boolean {
            let width = this.getEl().getWidthWithoutPadding();
            if (this.stepNavigator.isVisible()) {
                this.maxFittingWidth = this.stepNavigator.getChildren().reduce((prevWidth, child) => {
                    return prevWidth + child.getEl().getWidthWithMargin();
                }, 0);
            }

            return this.maxFittingWidth < width;
        }

        checkAndMinimize() {
            if (this.isStepNavigatorFit() == this.minimized) {
                this.minimized = !this.minimized;
                this.toggleClass('minimized', this.minimized);

                if (this.minimized) {
                    this.removeChild(this.stepNavigator);
                    this.foldButton.push(this.stepNavigator, 300);
                } else {
                    this.foldButton.pop();
                    this.appendChild(this.stepNavigator);
                }
            }
        }
    }
