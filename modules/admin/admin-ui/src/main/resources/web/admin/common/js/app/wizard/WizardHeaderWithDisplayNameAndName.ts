import {TextInput} from "../../ui/text/TextInput";
import {SpanEl} from "../../dom/SpanEl";
import {AutosizeTextInput} from "../../ui/text/AutosizeTextInput";
import {QueryField} from "../../query/QueryField";
import {ValueChangedEvent} from "../../ValueChangedEvent";
import {StringHelper} from "../../util/StringHelper";
import {WindowDOM} from "../../dom/WindowDOM";
import {NamePrettyfier} from "../../NamePrettyfier";
import {Name} from "../../Name";
import {DisplayNameGenerator} from "./DisplayNameGenerator";
import {WizardHeader} from "./WizardHeader";

export class WizardHeaderWithDisplayNameAndNameBuilder {

        displayNameGenerator: DisplayNameGenerator;

        setDisplayNameGenerator(value: DisplayNameGenerator): WizardHeaderWithDisplayNameAndNameBuilder {
            this.displayNameGenerator = value;
            return this;
        }

        build(): WizardHeaderWithDisplayNameAndName {
            return new WizardHeaderWithDisplayNameAndName(this);
        }

    }

    export class WizardHeaderWithDisplayNameAndName extends WizardHeader {

        private displayNameGenerator: DisplayNameGenerator;

        private forbiddenChars: RegExp = /[\/\\]+/ig;

        private displayNameEl: TextInput;

        private displayNameProgrammaticallySet: boolean;

        private pathEl: SpanEl;

        private nameEl: TextInput;

        private autoGenerateName: boolean = false;

        private autoGenerationEnabled: boolean = true;

        private ignoreGenerateStatusForName: boolean = true;

        private simplifiedNameGeneration: boolean = false;

        constructor(builder: WizardHeaderWithDisplayNameAndNameBuilder) {
            super();
            this.addClass("wizard-header-with-display-name-and-name");
            this.displayNameGenerator = builder.displayNameGenerator;
            this.displayNameProgrammaticallySet = this.displayNameGenerator != null;

            this.displayNameEl = AutosizeTextInput.large();
            this.displayNameEl.setPlaceholder("<Display Name>").setName(QueryField.DISPLAY_NAME);
            this.displayNameEl.onValueChanged((event: ValueChangedEvent) => {
                this.notifyPropertyChanged(QueryField.DISPLAY_NAME, event.getOldValue(), event.getNewValue());
            });
            this.appendChild(this.displayNameEl);

            this.pathEl = new SpanEl('path');
            this.pathEl.hide();
            this.appendChild(this.pathEl);

            this.nameEl = AutosizeTextInput.middle().setForbiddenCharsRe(this.forbiddenChars);
            this.nameEl.setPlaceholder("<name>").setName('name');
            this.nameEl.onValueChanged((event: ValueChangedEvent) => {
                this.notifyPropertyChanged("name", event.getOldValue(), event.getNewValue());
            });
            this.appendChild(this.nameEl);

            this.displayNameEl.onValueChanged((event: ValueChangedEvent) => {

                this.displayNameEl.removeClass("generated");

                var currentDisplayName = event.getNewValue() || "";

                if (this.displayNameGenerator && this.displayNameGenerator.hasScript()) {
                    var generatedDisplayName = this.displayNameGenerator.execute() || "";

                    this.displayNameProgrammaticallySet =
                    generatedDisplayName.toLowerCase() === currentDisplayName.toLowerCase() ||
                    generatedDisplayName.trim().toLowerCase() === currentDisplayName.toLowerCase() ||
                    StringHelper.isEmpty(currentDisplayName);

                    if (this.displayNameProgrammaticallySet) {
                        this.displayNameEl.addClass("generated");
                    }
                }
                this.doAutoGenerateName(currentDisplayName);
            });

            this.nameEl.onValueChanged((event: ValueChangedEvent) => {
                var currentName = event.getNewValue() || "";
                var displayName = this.getDisplayName() || "";

                this.autoGenerateName = this.checkAutoGenerateName(currentName, displayName);

                this.updateNameGeneratedStatus();
            });

            this.onShown((event) => this.updatePathAndNameWidth());
            WindowDOM.get().onResized((event: UIEvent) => this.updatePathAndNameWidth(), this);

        }

        private checkAutoGenerateName(name: string, displayName: string): boolean {
            return StringHelper.isEmpty(name) ||
                   displayName.toLowerCase() === name.toLowerCase() ||
                   name.toLowerCase() === this.generateName(displayName).toLowerCase();
        }

        initNames(displayName: string, name: string, forceDisplayNameProgrammaticallySet: boolean, ignoreDirtyFlag: boolean = true) {

            if (!ignoreDirtyFlag) {
                if (this.displayNameEl.isDirty()) {
                    displayName = this.displayNameEl.getValue();
                    name = this.nameEl.getValue();
                }
            }

            this.autoGenerateName = this.checkAutoGenerateName(name, displayName);

            this.displayNameEl.setValue(displayName);
            if (name != null) {
                this.nameEl.setValue(name);
            } else {
                this.nameEl.setValue(this.generateName(displayName));
            }

            if (this.displayNameGenerator && this.displayNameGenerator.hasScript()) {
                if (!forceDisplayNameProgrammaticallySet) {
                    var generatedDisplayName = this.displayNameGenerator.execute();
                    this.displayNameProgrammaticallySet = generatedDisplayName == displayName;
                } else {
                    this.displayNameProgrammaticallySet = true;
                }
            }
        }

        private doAutoGenerateName(value: string) {
            if (this.autoGenerateName && this.autoGenerationEnabled) {
                this.nameEl.setValue(this.generateName(value));
            }
        }

        isAutoGenerationEnabled(): boolean {
            return this.autoGenerationEnabled;
        }

        setAutoGenerationEnabled(value: boolean) {
            this.autoGenerationEnabled = value;
        }

        setDisplayName(value: string) {
            if (this.displayNameProgrammaticallySet) {
                value = value.trim();
                this.displayNameEl.setValue(value);
                this.doAutoGenerateName(value);
            }
        }

        setPath(value: string) {
            this.pathEl.getEl().setText(value);
            if (value) {
                this.pathEl.show();
            } else {
                this.pathEl.hide();
            }
        }

        setSimplifiedNameGeneration(value: boolean) {
            this.simplifiedNameGeneration = value;
        }

        disableNameInput() {
            this.nameEl.getEl().setAttribute("disabled", "disabled");
        }

        getName(): string {
            return this.nameEl.getValue();
        }

        getDisplayName(): string {
            return this.displayNameEl.getValue();
        }

        giveFocus(): boolean {
            return this.displayNameEl.giveFocus();
        }

        private generateName(value: string): string {
            return this.ensureValidName(value);
        }

        private ensureValidName(possibleInvalidName: string): string {
            if (!possibleInvalidName) {
                return "";
            }
            var generated;
            if (this.simplifiedNameGeneration) {
                generated = possibleInvalidName.replace(Name.SIMPLIFIED_FORBIDDEN_CHARS, '').toLowerCase();
            } else {
                generated = NamePrettyfier.prettify(possibleInvalidName);
            }
            return (generated || '');
        }

        private setIgnoreGenerateStatusForName(value: boolean) {
            this.ignoreGenerateStatusForName = value;
            this.updateNameGeneratedStatus();
        }

        disableNameGeneration(value: boolean) {
            if (value) {
                this.setAutoGenerationEnabled(false);
            }
            this.setIgnoreGenerateStatusForName(value);
        }

        private updateNameGeneratedStatus() {
            if (this.autoGenerateName && !this.ignoreGenerateStatusForName) {
                this.nameEl.addClass("generated");
            } else {
                this.nameEl.removeClass("generated");
            }
        }

        private updatePathAndNameWidth() {
            var pathEl = this.pathEl.getEl(),
                nameEl = this.nameEl.getEl(),
                headerWidth = this.getEl().getWidth(),
                pathWidth = pathEl.getWidthWithMargin(),
                nameWidth = nameEl.getWidthWithMargin(),
                nameMinWidth = nameEl.getMinWidth();

            if (pathWidth + nameWidth > headerWidth) {
                if (nameWidth > nameMinWidth) {
                    nameEl.setWidthPx(Math.max(nameMinWidth, headerWidth - pathWidth));
                }
                if (pathWidth + nameMinWidth > headerWidth) {
                    pathEl.setWidthPx(headerWidth - nameMinWidth - pathEl.getMarginLeft() - pathEl.getMarginRight());
                }
            }
        }

        isValid(): boolean {
            return !!this.displayNameEl.getValue() && !!this.nameEl.getValue();
        }

    }
