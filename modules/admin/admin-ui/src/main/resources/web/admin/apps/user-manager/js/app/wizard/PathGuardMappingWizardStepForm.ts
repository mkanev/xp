module app.wizard {
    export class PathGuardMappingWizardStepForm extends api.app.wizard.WizardStepForm {

        private formView: api.form.FormView;

        private propertySet: api.data.PropertySet;

        constructor() {
            super();
        }

        layout(pathGuard: api.security.PathGuard) {

            this.formView = this.createFormView(pathGuard);

            return this.formView.layout().then(() => {

                this.formView.onFocus((event) => {
                    this.notifyFocused(event);
                });
                this.formView.onBlur((event) => {
                    this.notifyBlurred(event);
                });

                this.appendChild(this.formView);

                this.formView.onValidityChanged((event: api.form.FormValidityChangedEvent) => {
                    this.previousValidation = event.getRecording();
                    this.notifyValidityChanged(new api.app.wizard.WizardStepValidityChangedEvent(event.isValid()));
                });

                var formViewValid = this.formView.isValid();
                this.notifyValidityChanged(new api.app.wizard.WizardStepValidityChangedEvent(formViewValid));
            });
        }

        private createFormView(pathGuard: api.security.PathGuard): api.form.FormView {
            var formBuilder = new api.form.FormBuilder().
                addFormItem(new api.form.InputBuilder().
                    setName("paths").
                    setInputType(api.form.inputtype.text.TextLine.getName()).
                    setLabel("Protected resources").
                    setOccurrences(new api.form.OccurrencesBuilder().setMinimum(1).setMaximum(0).build()).
                    setInputTypeConfig({}).
                    setMaximizeUIInputWidth(true).
                    build());

            this.propertySet = new api.data.PropertySet();
            if (pathGuard) {
                var paths = pathGuard.getPaths();
                if (paths && paths.length > 0) {
                    paths.forEach(path => {
                        this.propertySet.addString("paths", path);
                    });
                } else {
                    this.propertySet.setString("paths", 0, "");
                }
            }

            return new api.form.FormView(api.form.FormContext.create().build(), formBuilder.build(), this.propertySet);
        }

        getPaths(): string[] {
            return this.propertySet ? this.propertySet.getStrings("paths") : [];
        }

        giveFocus(): boolean {
            return this.formView.giveFocus();
        }
    }
}