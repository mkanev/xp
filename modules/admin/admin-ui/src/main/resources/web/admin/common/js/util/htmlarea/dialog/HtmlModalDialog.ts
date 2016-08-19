import {Form} from "../../../ui/form/Form";
import {Fieldset} from "../../../ui/form/Fieldset";
import {FormItem} from "../../../ui/form/FormItem";
import {FormItemBuilder} from "../../../ui/form/FormItem";
import {ModalDialog} from "../../../ui/dialog/ModalDialog";
import {FormItemEl} from "../../../dom/FormItemEl";
import {Element} from "../../../dom/Element";
import {Action} from "../../../ui/Action";
import {ModalDialogHeader} from "../../../ui/dialog/ModalDialog";
import {Body} from "../../../dom/Body";
import {FormView} from "../../../form/FormView";
import {Panel} from "../../../ui/panel/Panel";
import {ValidationRecordingViewer} from "../../../form/ValidationRecordingViewer";
import {ValidationResult} from "../../../ui/form/ValidationResult";
import {FormInputEl} from "../../../dom/FormInputEl";
import {TextInput} from "../../../ui/text/TextInput";
import {DivEl} from "../../../dom/DivEl";
import {InputEl} from "../../../dom/InputEl";
import {ObjectHelper} from "../../../ObjectHelper";
import {RichComboBox} from "../../../ui/selector/combobox/RichComboBox";
import {ValidityChangedEvent} from "../../../ValidityChangedEvent";

export class HtmlModalDialog extends ModalDialog {
        private fields: { [id: string]: FormItemEl } = {};
        private validated = false;
        private editor: HtmlAreaEditor;
        private mainForm: Form;
        private firstFocusField: Element;
        private submitAction: Action;

        protected static VALIDATION_CLASS: string = "display-validation-errors";

        public static CLASS_NAME = "html-area-modal-dialog";

        constructor(editor: HtmlAreaEditor, title: ModalDialogHeader, cls?: string) {
            super({
                title: title
            });

            this.editor = editor;

            this.getEl().addClass(HtmlModalDialog.CLASS_NAME + (cls ? " " + cls : ""));

            this.layout();
            this.initializeActions();
        }

        setSubmitAction(action: Action) {
            this.submitAction = action;
        }

        protected getEditor(): HtmlAreaEditor {
            return this.editor;
        }

        protected setValidated() {
            this.validated = true;
        }

        protected setFirstFocusField(field: Element) {
            this.firstFocusField = field;
        }

        private focusFirstField() {
            this.firstFocusField.giveFocus();
        }

        protected layout() {
            this.appendChildToContentPanel(<Element>this.createMainForm());
        }

        protected getMainFormItems(): FormItem[] {
            return [];
        }

        protected getMainForm(): Form {
            return this.mainForm;
        }

        protected createMainForm(): Form {
            return this.mainForm = this.createForm(this.getMainFormItems());
        }

        protected validate(): boolean {
            this.setValidated();

            return this.mainForm.validate(true).isValid();
        }

        protected hasSubDialog(): boolean {
            // html area dialogs can't have sub dialogs
            return false;
        }

        show() {
            Body.get().appendChild(this);
            super.show();
            if (this.firstFocusField) {
                this.focusFirstField();
            }
        }

        protected createForm(formItems: FormItem[]): Form {
            var form = new Form(),
                validationCls = FormView.VALIDATION_CLASS;

            formItems.forEach((formItem: FormItem) => {
                form.add(this.createFieldSet(formItem));
                if (formItem.getValidator() && validationCls) {
                    form.addClass(validationCls);
                    validationCls = "";
                }
            });

            return form;
        }

        protected displayValidationErrors(value: boolean) {
            if (value) {
                this.mainForm.addClass(FormView.VALIDATION_CLASS);
            } else {
                this.mainForm.removeClass(FormView.VALIDATION_CLASS);
            }
        }

        protected createFormPanel(formItems: FormItem[]): Panel {
            var panel = new Panel(),
                form = this.createForm(formItems);

            panel.appendChild(form);

            return panel;
        }

        private createFieldSet(formItem: FormItem): Fieldset {
            var fieldSet = new Fieldset();

            fieldSet.addClass("modal-dialog-fieldset");
            fieldSet.add(formItem);

            if (formItem.getValidator()) {
                var validationRecordingViewer = new ValidationRecordingViewer();

                fieldSet.appendChild(validationRecordingViewer);
                fieldSet.onValidityChanged((event: ValidityChangedEvent) => {
                    validationRecordingViewer.setError(formItem.getError());
                });
            }

            return fieldSet;
        }

        onValidatedFieldValueChanged(formItem: FormItem) {
            if (this.validated) {
                formItem.validate(new ValidationResult(), true);
            }
        }

        protected createFormItem(id: string, label: string, validator?: (input: FormInputEl) => string, value?: string,
                                 inputEl?: FormItemEl): FormItem {
            var formItemEl = inputEl || new TextInput(),
                formItemBuilder = new FormItemBuilder(formItemEl).setLabel(label),
                inputWrapper = new DivEl("input-wrapper"),
                formItem;

            if (this.fields[id]) {
                throw "Element with id " + id + " already exists";
            }

            if (value) {
                (<InputEl>formItemEl).setValue(value);
            }

            this.fields[id] = formItemEl;

            if (validator) {
                formItemBuilder.setValidator(validator);
            }

            formItem = formItemBuilder.build();

            formItem.getInput().wrapWithElement(inputWrapper);

            if (validator) {
                if (ObjectHelper.iFrameSafeInstanceOf(formItemEl, TextInput)) {
                    (<TextInput>formItemEl).onValueChanged(this.onValidatedFieldValueChanged.bind(this, formItem));
                }
                if (ObjectHelper.iFrameSafeInstanceOf(formItemEl, RichComboBox)) {
                    (<RichComboBox<any>>formItemEl).onOptionSelected(this.onValidatedFieldValueChanged.bind(this,
                        formItem));
                    (<RichComboBox<any>>formItemEl).onOptionDeselected(this.onValidatedFieldValueChanged.bind(this,
                        formItem));
                }
            }

            return formItem;
        }

        protected initializeActions() {
            this.addCancelButtonToBottom();
        }

        protected getFieldById(id: string): FormItemEl {
            return this.fields[id];
        }


        close() {
            super.close();
            if (!this.editor["destroyed"]) {
                this.editor.focus();
            }
            this.remove();
        }
    }

    export interface HtmlAreaAnchor {
        editor: HtmlAreaEditor
        element: HTMLElement
        text: string
        anchorList: string[]
        onlyTextSelected: boolean
    }

    export interface HtmlAreaImage {
        editor: HtmlAreaEditor
        element: HTMLElement
        container: HTMLElement
        callback: Function
    }

    export interface HtmlAreaMacro {
        editor: HtmlAreaEditor
        callback: Function
    }
