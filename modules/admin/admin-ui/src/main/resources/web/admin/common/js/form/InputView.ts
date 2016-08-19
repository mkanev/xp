import {Property} from "../data/Property";
import {PropertyArray} from "../data/PropertyArray";
import {Value} from "../data/Value";
import {ValueType} from "../data/ValueType";
import {ValueTypes} from "../data/ValueTypes";
import {PropertySet} from "../data/PropertySet";
import {BaseInputTypeNotManagingAdd} from "./inputtype/support/BaseInputTypeNotManagingAdd";
import {InputTypeManager} from "./inputtype/InputTypeManager";
import {FormItemView} from "./FormItemView";
import {InputTypeView} from "./inputtype/InputTypeView";
import {DivEl} from "../dom/DivEl";
import {Button} from "../ui/button/Button";
import {ValidationRecordingViewer} from "./ValidationRecordingViewer";
import {assertNotNull} from "../util/Assert";
import {ContentSummary} from "../content/ContentSummary";
import {OccurrenceRemovedEvent} from "./OccurrenceRemovedEvent";
import {ObjectHelper} from "../ObjectHelper";
import {InputOccurrenceView} from "./inputtype/support/InputOccurrenceView";
import {InputValidityChangedEvent} from "./inputtype/InputValidityChangedEvent";
import {PEl} from "../dom/PEl";
import {SpanEl} from "../dom/SpanEl";
import {InputTypeName} from "./InputTypeName";
import {InputValidationRecording} from "./inputtype/InputValidationRecording";
import {AdditionalValidationRecord} from "./AdditionalValidationRecord";
import {FormContext} from "./FormContext";
import {FormItemSetOccurrenceView} from "./FormItemSetOccurrenceView";
import {FormItemViewConfig} from "./FormItemView";
import {Input} from "./Input";
import {InputLabel} from "./InputLabel";
import {RecordingValidityChangedEvent} from "./RecordingValidityChangedEvent";
import {ValidationRecording} from "./ValidationRecording";
import {ValidationRecordingPath} from "./ValidationRecordingPath";

export interface InputViewConfig {

        context: FormContext;

        input: Input;

        parent: FormItemSetOccurrenceView;

        parentDataSet: PropertySet;
    }

    export class InputView extends FormItemView {

        private input: Input;

        private parentPropertySet: PropertySet;

        private propertyArray: PropertyArray;

        private inputTypeView: InputTypeView<any>;

        private bottomButtonRow: DivEl;

        private addButton: Button;

        private validationViewer: ValidationRecordingViewer;

        private previousValidityRecording: ValidationRecording;

        private userInputValid: boolean;

        private validityChangedListeners: {(event: RecordingValidityChangedEvent) : void}[] = [];

        public static debug: boolean = false;

        constructor(config: InputViewConfig) {
            super(<FormItemViewConfig>{
                className: "input-view",
                context: config.context,
                formItem: config.input,
                parent: config.parent
            });

            assertNotNull(config.parentDataSet, "parentDataSet not expected to be null");
            assertNotNull(config.input, "input not expected to be null");

            this.input = config.input;
            this.parentPropertySet = config.parentDataSet;

        }

        public layout(validate: boolean = true): wemQ.Promise<void> {

            if (this.input.getInputType().getName() !== "Checkbox") { //checkbox input type generates clickable label itself
                if (this.input.getLabel()) {
                    var label = new InputLabel(this.input);
                    this.appendChild(label);
                } else {
                    this.addClass("no-label");
                }
            }


            if (this.input.isMaximizeUIInputWidth()) {
                this.addClass("label-over-input");
            }

            this.inputTypeView = this.createInputTypeView();
            this.inputTypeView.onEditContentRequest((content: ContentSummary) => {
                this.notifyEditContentRequested(content);
            });

            this.propertyArray = this.getPropertyArray(this.parentPropertySet);

            var inputTypeViewLayoutPromise = this.inputTypeView.layout(this.input, this.propertyArray);
            inputTypeViewLayoutPromise.then(() => {
                this.appendChild(this.inputTypeView.getElement());

                if (this.input.getHelpText()) {
                    this.appendHelpText(this.input.getHelpText());
                }

                if (!this.inputTypeView.isManagingAdd()) {

                    var inputTypeViewNotManagingAdd = <BaseInputTypeNotManagingAdd<any>>this.inputTypeView;
                    inputTypeViewNotManagingAdd.onOccurrenceAdded(() => {
                        this.refresh();
                    });
                    inputTypeViewNotManagingAdd.onOccurrenceRemoved((event: OccurrenceRemovedEvent) => {
                        this.refresh();

                        if (ObjectHelper.iFrameSafeInstanceOf(event.getOccurrenceView(),
                                InputOccurrenceView)) {
                            // force validate, since InputView might have become invalid
                            this.validate(false);
                        }
                    });

                    this.addButton = new Button("Add");
                    this.addButton.addClass("small");
                    this.addButton.onClicked((event: MouseEvent) => {
                        inputTypeViewNotManagingAdd.createAndAddOccurrence();
                    });

                    this.bottomButtonRow = new DivEl("bottom-button-row");
                    this.appendChild(this.bottomButtonRow);
                    this.bottomButtonRow.appendChild(this.addButton);
                }

                this.validationViewer = new ValidationRecordingViewer();
                this.appendChild(this.validationViewer);

                this.inputTypeView.onValidityChanged((event: InputValidityChangedEvent)=> {
                    this.handleInputValidationRecording(event.getRecording(), false);
                });

                this.refresh(validate);
            });

            return inputTypeViewLayoutPromise;
        }
        
        private appendHelpText(helpText: string) {
            var helpTextDiv = new DivEl("help-text overflow");
            var pEl = new PEl();
            pEl.getEl().setText(helpText);

            var spanEl = new SpanEl();
            spanEl.getEl().setText("More");

            spanEl.onClicked(() => {
                helpTextDiv.removeClass("overflow");
            });

            helpTextDiv.appendChild(pEl);
            helpTextDiv.appendChild(spanEl);

            helpTextDiv.onRendered(() => {
                if (pEl.getEl().isOverflown()) {
                    helpTextDiv.addClass("collapsed");
                }
            });

            this.appendChild(helpTextDiv);
        }

        private getPropertyArray(propertySet: PropertySet): PropertyArray {
            var array = propertySet.getPropertyArray(this.input.getName());
            if (!array) {
                array = PropertyArray.create().
                    setType(this.inputTypeView.getValueType()).
                    setName(this.input.getName()).
                    setParent(this.parentPropertySet).
                    build();

                propertySet.addPropertyArray(array);

                var initialValue = this.input.getDefaultValue();
                if (!initialValue) {
                    initialValue = this.inputTypeView.newInitialValue();
                }
                if (initialValue) {
                    array.add(initialValue);
                }
            }
            return array;
        }

        public update(propertySet: PropertySet, unchangedOnly?: boolean): wemQ.Promise<void> {
            if (InputView.debug) {
                console.debug('InputView.update' + (unchangedOnly ? ' ( unchanged only)' : ''), this, propertySet);
            }
            // update parent first because it can be used in getPropertyArray
            this.parentPropertySet = propertySet;
            this.propertyArray = this.getPropertyArray(propertySet);

            return this.inputTypeView.update(this.propertyArray, unchangedOnly);
        }

        public getInputTypeView(): InputTypeView<any> {
            return this.inputTypeView;
        }

        private createInputTypeView(): InputTypeView<any> {
            var inputType: InputTypeName = this.input.getInputType();
            var inputTypeViewContext = this.getContext().createInputTypeViewContext(this.input.getInputTypeConfig(),
                this.parentPropertySet.getPropertyPath(), this.input);

            if (InputTypeManager.isRegistered(inputType.getName())) {
                return InputTypeManager.createView(inputType.getName(), inputTypeViewContext);
            }
            else {
                console.warn("Input type [" + inputType.getName() + "] needs to be registered first.");
                return InputTypeManager.createView("NoInputTypeFound", inputTypeViewContext);
            }
        }

        broadcastFormSizeChanged() {
            if (this.isVisible()) {
                this.inputTypeView.availableSizeChanged();
            }
        }

        refresh(validate: boolean = true) {
            if (!this.inputTypeView.isManagingAdd()) {
                var inputTypeViewNotManagingAdd = <BaseInputTypeNotManagingAdd<any>>this.inputTypeView;
                this.addButton.setVisible(!inputTypeViewNotManagingAdd.maximumOccurrencesReached());
            }
            if (validate) {
                this.validate(false);
            }
        }

        private resolveValidationRecordingPath(): ValidationRecordingPath {

            return new ValidationRecordingPath(this.propertyArray.getParentPropertyPath(), this.input.getName(),
                this.input.getOccurrences().getMinimum(),
                this.input.getOccurrences().getMaximum());
        }

        public displayValidationErrors(value: boolean) {
            this.inputTypeView.displayValidationErrors(value);
        }

        hasValidUserInput(): boolean {

            return this.inputTypeView.hasValidUserInput();
        }

        validate(silent: boolean = true): ValidationRecording {

            var inputRecording = this.inputTypeView.validate(silent);
            return this.handleInputValidationRecording(inputRecording, silent);
        }

        private handleInputValidationRecording(inputRecording: InputValidationRecording,
                                               silent: boolean = true): ValidationRecording {

            var recording = new ValidationRecording(),
                validationRecordingPath = this.resolveValidationRecordingPath(),
                hasValidInput = this.hasValidUserInput();

            if (inputRecording.isMinimumOccurrencesBreached()) {
                recording.breaksMinimumOccurrences(validationRecordingPath);
            }
            if (inputRecording.isMaximumOccurrencesBreached()) {
                recording.breaksMaximumOccurrences(validationRecordingPath);
            }

            if (recording.validityChanged(this.previousValidityRecording) || this.userInputValidityChanged(hasValidInput)) {
                if (!silent) {
                    this.notifyValidityChanged(new RecordingValidityChangedEvent(recording,
                        validationRecordingPath).setInputValueBroken(!hasValidInput));
                }
                this.toggleClass("highlight-validity-change", this.highlightOnValidityChange());
            }

            if (!silent && (recording.validityChanged(this.previousValidityRecording) || this.userInputValidityChanged(hasValidInput) )) {
                this.notifyValidityChanged(new RecordingValidityChangedEvent(recording,
                    validationRecordingPath).setInputValueBroken(!hasValidInput));
            }

            this.previousValidityRecording = recording;
            this.userInputValid = hasValidInput;

            this.renderValidationErrors(recording, inputRecording.getAdditionalValidationRecord());
            return recording;
        }

        userInputValidityChanged(currentState: boolean): boolean {
            return this.userInputValid == undefined || this.userInputValid == null || !(this.userInputValid == currentState);
        }

        giveFocus(): boolean {
            return this.inputTypeView.giveFocus();
        }

        onValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            this.validityChangedListeners.push(listener);
        }

        unValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            this.validityChangedListeners.filter((currentListener: (event: RecordingValidityChangedEvent)=>void) => {
                return listener == currentListener;
            });
        }

        private notifyValidityChanged(event: RecordingValidityChangedEvent) {

            this.validityChangedListeners.forEach((listener: (event: RecordingValidityChangedEvent)=>void) => {
                listener(event);
            });
        }

        private renderValidationErrors(recording: ValidationRecording, additionalValidationRecord: AdditionalValidationRecord) {
            if (!this.mayRenderValidationError()) {
                return;
            }

            if (recording.isValid() && this.hasValidUserInput()) {
                this.removeClass("invalid");
                this.addClass("valid");
            }
            else {
                this.removeClass("valid");
                this.addClass("invalid");
            }

            this.validationViewer.setObject(recording);

            if (additionalValidationRecord && additionalValidationRecord.isOverwriteDefault()) {
                this.validationViewer.appendValidationMessage(additionalValidationRecord.getMessage());
            }
        }

        private mayRenderValidationError(): boolean {
            return this.input.getInputType().getName() !== "SiteConfigurator";
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.inputTypeView.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.inputTypeView.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.inputTypeView.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.inputTypeView.unBlur(listener);
        }
    }
