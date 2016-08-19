import {ActionButton} from "../button/ActionButton";
import {DivEl} from "../../dom/DivEl";
import {ActionContainer} from "../ActionContainer";
import {Action} from "../Action";
import {ResponsiveManager} from "../responsive/ResponsiveManager";
import {Element} from "../../dom/Element";
import {ObjectHelper} from "../../ObjectHelper";
import {FoldButton} from "./FoldButton";

export class Toolbar extends DivEl implements ActionContainer {

        private fold: FoldButton;

        private hasGreedySpacer: boolean;

        private actions: Action[] = [];

        constructor(className?: string) {
            super(!className ? "toolbar" : className + " toolbar");

            this.fold = new FoldButton();
            this.fold.hide();
            this.appendChild(this.fold);

            ResponsiveManager.onAvailableSizeChanged(this, (item) => this.foldOrExpand());

            this.onShown((event) => this.foldOrExpand());
        }

        addAction(action: Action): ActionButton {
            this.actions.push(action);
            action.onPropertyChanged((action) => this.foldOrExpand());
            return <ActionButton>this.addElement(new ActionButton(action));
        }

        addActions(actions: Action[]) {
            actions.forEach((action) => {
                this.addAction(action);
            });
        }

        removeActions() {
            this.actions.forEach((action: Action) => {
                this.getChildren().forEach((element: Element) => {
                    if (ObjectHelper.iFrameSafeInstanceOf(element, ActionButton)) {
                        if (action.getLabel() == (<ActionButton>element).getLabel()) {
                            this.removeChild(element);
                        }
                    }
                });
            });
            this.actions = [];
        }

        getActions(): Action[] {
            return this.actions;
        }

        addElement(element: Element): Element {
            if (this.hasGreedySpacer) {
                element.addClass('pull-right');
                element.insertAfterEl(this.fold);
            } else {
                element.insertBeforeEl(this.fold);
            }
            
            return element;
        }

        addGreedySpacer() {
            this.hasGreedySpacer = true;
        }

        removeGreedySpacer() {
            this.hasGreedySpacer = false;
        }

        private foldOrExpand() {
            if (!this.isVisible()) {
                return;
            }

            var toolbarWidth = this.getEl().getWidth();
            if (toolbarWidth <= this.getVisibleButtonsWidth()) {

                while (toolbarWidth <= this.getVisibleButtonsWidth() && this.getNextFoldableButton()) {

                    var buttonToHide = this.getNextFoldableButton();
                    var buttonWidth = buttonToHide.getEl().getWidthWithMargin();

                    this.removeChild(buttonToHide);
                    this.fold.push(buttonToHide, buttonWidth);

                    if (!this.fold.isVisible()) {
                        this.fold.show();
                    }
                }

            } else {
                // if fold has 1 child left then subtract fold button width because it will be hidden
                while (!this.fold.isEmpty() &&
                       (this.getVisibleButtonsWidth(this.fold.getButtonsCount() > 1) + this.fold.getNextButtonWidth() < toolbarWidth)) {

                    var buttonToShow = this.fold.pop();
                    buttonToShow.insertBeforeEl(this.fold);

                    if (this.fold.isEmpty()) {
                        this.fold.hide();
                    }
                }
            }

            this.fold.setLabel(this.getFoldableButtons().length == 0 ? 'Actions' : 'More');
        }

        private getVisibleButtonsWidth(includeFold: boolean = true): number {
            return this.getChildren().reduce((totalWidth: number, element: Element) => {
                return totalWidth + ( element.isVisible() && (includeFold || element != this.fold) ?
                                      element.getEl().getWidthWithMargin() : 0 );
            }, 0);
        }

        private getNextFoldableButton(): Element {
            return this.getChildren()[this.getChildren().indexOf(this.fold) - 1];
        }

        private getFoldableButtons(): Element[] {
            return this.getChildren().slice(0, this.getChildren().indexOf(this.fold));
        }

    }

