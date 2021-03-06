module api.util.htmlarea.dialog {

    import FormItem = api.ui.form.FormItem;
    import Validators = api.ui.form.Validators;
    import Panel = api.ui.panel.Panel;
    import MacroDescriptor = api.macro.MacroDescriptor;
    import FormContext = api.form.FormContext;
    import ApplicationKey = api.application.ApplicationKey
    import SelectedOptionEvent = api.ui.selector.combobox.SelectedOptionEvent;

    export class MacroModalDialog extends ModalDialog {

        private content: api.content.ContentSummary;

        private applicationKeys: ApplicationKey[];

        private macroDockedPanel: MacroDockedPanel;

        private callback: Function;

        constructor(config: HtmlAreaMacro, content: api.content.ContentSummary, applicationKeys: ApplicationKey[]) {
            this.content = content;
            this.applicationKeys = applicationKeys;
            this.callback = config.callback;
            super(config.editor, new api.ui.dialog.ModalDialogHeader("Insert Macro"), "macro-modal-dialog");
        }

        protected layout() {
            super.layout();
            this.appendChildToContentPanel(this.macroDockedPanel = this.makeMacroDockedPanel());
        }

        private makeMacroDockedPanel(): MacroDockedPanel {
            var macroDockedPanel = new MacroDockedPanel(this.content);

            var debouncedPreviewRenderedHandler: () => void = api.util.AppHelper.debounce(() => {
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
            var loader = new api.macro.resource.MacrosLoader(this.applicationKeys),
                macroSelector = api.macro.MacroComboBox.create().setLoader(loader).setMaximumOccurrences(1).build(),
                formItem = this.createFormItem(id, "Macro", Validators.required, api.util.StringHelper.EMPTY_STRING,
                    <api.dom.FormItemEl>macroSelector),
                macroSelectorComboBox = macroSelector.getComboBox();

            this.addClass("macro-selector");

            macroSelectorComboBox.onOptionSelected((event: SelectedOptionEvent<api.macro.MacroDescriptor>) => {
                formItem.addClass("selected-item-preview");
                this.addClass("shows-preview");

                this.macroDockedPanel.setMacroDescriptor(event.getSelectedOption().getOption().displayValue);
            });

            macroSelectorComboBox.onOptionDeselected(() => {
                formItem.removeClass("selected-item-preview");
                this.removeClass("shows-preview");
                this.displayValidationErrors(false);
                api.ui.responsive.ResponsiveManager.fireResizeEvent();
            });

            macroSelectorComboBox.onKeyDown((e: KeyboardEvent) => {
                if (api.ui.KeyHelper.isEscKey(e) && !macroSelectorComboBox.isDropdownShown()) {
                    // Prevent modal dialog from closing on Esc key when dropdown is expanded
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            return formItem;
        }

        protected initializeActions() {
            var submitAction = new api.ui.Action("Insert");
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
                var macro = this.callback(api.util.StringHelper.escapeHtml(macroString));
                this.close();
            }).catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
                api.notify.showError("Failed to generate macro.");
            });
        }

        protected validate(): boolean {
            var mainFormValid = super.validate(),
                configPanelValid = this.macroDockedPanel.validateMacroForm();

            return mainFormValid && configPanelValid;
        }
    }
}