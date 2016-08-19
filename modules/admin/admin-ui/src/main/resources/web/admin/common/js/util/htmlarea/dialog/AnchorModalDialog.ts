import {FormItem} from "../../../ui/form/FormItem";
import {Validators} from "../../../ui/form/Validators";
import {ModalDialogHeader} from "../../../ui/dialog/ModalDialog";
import {Action} from "../../../ui/Action";
import {AEl} from "../../../dom/AEl";
import {TextInput} from "../../../ui/text/TextInput";
import {Name} from "../../../Name";
import {HtmlModalDialog} from "./HtmlModalDialog";

export class AnchorModalDialog extends HtmlModalDialog {

        constructor(editor:HtmlAreaEditor) {

            super(editor, new ModalDialogHeader("Insert Anchor"));
        }

        protected getMainFormItems():FormItem[] {
            var nameField = this.createFormItem("name", "Name", Validators.required);

            this.setFirstFocusField(nameField.getInput());

            return [
                nameField
            ];
        }

        protected initializeActions() {
            var submitAction = new Action("Insert");
            this.setSubmitAction(submitAction);

            this.addAction(submitAction.onExecuted(() => {
                if (this.validate()) {
                    this.insertAnchor();
                    this.close();
                }
            }));

            super.initializeActions();
        }

        private createAnchorEl():AEl {
            var anchorEl = new AEl();

            anchorEl.setId(this.getName());
            anchorEl.getEl().removeAttribute('href');

            return anchorEl;
        }

        private getName():string {
            return (<TextInput>this.getFieldById("name")).getValue();
        }

        private insertAnchor():void {
            var anchorEl = this.createAnchorEl();
            this.getEditor().insertContent(anchorEl.toString());
        }
    }
