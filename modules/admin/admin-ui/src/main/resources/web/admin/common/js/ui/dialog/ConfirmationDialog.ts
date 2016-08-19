import {DivEl} from "../../dom/DivEl";
import {Action} from "../Action";
import {ModalDialogHeader} from "./ModalDialog";
import {Body} from "../../dom/Body";
import {ModalDialog} from "./ModalDialog";

export class ConfirmationDialog extends ModalDialog {

        private static instance: ConfirmationDialog;

        private questionEl: DivEl;
        private yesCallback: () => void;
        private noCallback: () => void;

        private yesAction: Action;
        private noAction: Action;

        constructor() {
            super({
                title: new ModalDialogHeader("Confirmation")
            });

            this.addClass("confirmation-dialog");

            this.questionEl = new DivEl("question");
            this.appendChildToContentPanel(this.questionEl);

            this.noAction = new Action("No", "esc");
            this.noAction.onExecuted(() => {
                this.close();
                if (this.noCallback) {
                    this.noCallback();
                }
            });

            this.yesAction = new Action("Yes");
            this.yesAction.onExecuted(() => {
                this.close();
                if (this.yesCallback) {
                    this.yesCallback();
                }
            });

            this.addAction(this.yesAction, true);
            this.addAction(this.noAction);

            Body.get().appendChild(this);
        }

        static get(): ConfirmationDialog {
            if (!ConfirmationDialog.instance) {
                ConfirmationDialog.instance = new ConfirmationDialog();
            }
            return ConfirmationDialog.instance;
        }

        setQuestion(question: string): ConfirmationDialog {
            this.questionEl.getEl().setInnerHtml(question);
            return this;
        }

        setYesCallback(callback: ()=>void): ConfirmationDialog {
            this.yesCallback = callback;
            return this;
        }

        setNoCallback(callback: () => void): ConfirmationDialog {
            this.noCallback = callback;
            return this;
        }
    }

