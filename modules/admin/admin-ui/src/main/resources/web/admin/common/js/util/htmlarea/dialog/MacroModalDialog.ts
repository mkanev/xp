import {FormItem} from "../../../ui/form/FormItem";
import {Validators} from "../../../ui/form/Validators";
import {Panel} from "../../../ui/panel/Panel";
import {MacroDescriptor} from "../../../macro/MacroDescriptor";
import {FormContext} from "../../../form/FormContext";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {SelectedOptionEvent} from "../../../ui/selector/combobox/SelectedOptionEvent";
import {ModalDialogHeader} from "../../../ui/dialog/ModalDialog";
import {ContentSummary} from "../../../content/ContentSummary";
import {AppHelper} from "../../AppHelper";
import {MacrosLoader} from "../../../macro/resource/MacrosLoader";
import {MacroComboBox} from "../../../macro/MacroComboBox";
import {StringHelper} from "../../StringHelper";
import {FormItemEl} from "../../../dom/FormItemEl";
import {ResponsiveManager} from "../../../ui/responsive/ResponsiveManager";
import {KeyHelper} from "../../../ui/KeyHelper";
import {Action} from "../../../ui/Action";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {showError} from "../../../notify/MessageBus";
import {HtmlModalDialog} from "./HtmlModalDialog";
import {HtmlAreaMacro} from "./HtmlModalDialog";
import {MacroDockedPanel} from "./MacroDockedPanel";

export class MacroModalDialog extends HtmlModalDialog {

        private content: ContentSummary;

        private applicationKeys: ApplicationKey[];

        private macroDockedPanel: MacroDockedPanel;

        private callback: Function;

        constructor(config: HtmlAreaMacro, content: ContentSummary, applicationKeys: ApplicationKey[]) {
            this.content = content;
            this.applicationKeys = applicationKeys;
            this.callback = config.callback;
            super(config.editor, new ModalDialogHeader("Insert Macro"), "macro-modal-dialog");
        }

        protected layout() {
            super.layout();
            this.appendChildToContentPanel(this.macroDockedPanel = this.makeMacroDockedPanel());
        }

        private makeMacroDockedPanel(): MacroDockedPanel {
            var macroDockedPanel = new MacroDockedPanel(this.content);

            var debouncedPreviewRenderedHandler: () => void = AppHelper.debounce(() => {
                this.centerMyself();
            }, 400, false);

            macroDockedPanel.onPanelRendered(debouncedPreviewRenderedHandler);
            this.onRemoved(() => {
                macroDockedPanel.unPanelRendered(debouncedPreviewRenderedHandler);
            });

            return macroDockedPanel;
        }

        protected getMainFormItems(): FormItem[] {
            var macroSelector = this.createMacroSelector("macroId");

            this.setFirstFocusField(macroSelector.getInput());

            return [
                macroSelector
            ];
        }

        private createMacroSelector(id: string): FormItem {
            var loader = new MacrosLoader(this.applicationKeys),
                macroSelector = MacroComboBox.create().setLoader(loader).setMaximumOccurrences(1).build(),
                formItem = this.createFormItem(id, "Macro", Validators.required, StringHelper.EMPTY_STRING,
                    <FormItemEl>macroSelector),
                macroSelectorComboBox = macroSelector.getComboBox();

            this.addClass("macro-selector");

            macroSelectorComboBox.onOptionSelected((event: SelectedOptionEvent<MacroDescriptor>) => {
                formItem.addClass("selected-item-preview");
                this.addClass("shows-preview");

                this.macroDockedPanel.setMacroDescriptor(event.getSelectedOption().getOption().displayValue);
            });

            macroSelectorComboBox.onOptionDeselected(() => {
                formItem.removeClass("selected-item-preview");
                this.removeClass("shows-preview");
                this.displayValidationErrors(false);
                ResponsiveManager.fireResizeEvent();
            });

            macroSelectorComboBox.onKeyDown((e: KeyboardEvent) => {
                if (KeyHelper.isEscKey(e) && !macroSelectorComboBox.isDropdownShown()) {
                    // Prevent modal dialog from closing on Esc key when dropdown is expanded
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            return formItem;
        }

        protected initializeActions() {
            var submitAction = new Action("Insert");
            this.setSubmitAction(submitAction);

            this.addAction(submitAction.onExecuted(() => {
                this.displayValidationErrors(true);
                if (this.validate()) {
                    this.insertMacroIntoTextArea();
                }
            }));

            super.initializeActions();
        }

        private insertMacroIntoTextArea(): void {
            this.macroDockedPanel.getMacroPreviewString().then((macroString: string) => {
                var macro = this.callback(StringHelper.escapeHtml(macroString));
                this.close();
            }).catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
                showError("Failed to generate macro.");
            });
        }

        protected validate(): boolean {
            var mainFormValid = super.validate(),
                configPanelValid = this.macroDockedPanel.validateMacroForm();

            return mainFormValid && configPanelValid;
        }
    }
