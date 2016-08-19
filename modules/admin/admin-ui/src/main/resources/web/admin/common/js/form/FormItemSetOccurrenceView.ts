import {PropertySet} from "../data/PropertySet";
import {PropertyArray} from "../data/PropertyArray";
import {PropertyPath} from "../data/PropertyPath";
import {PropertyPathElement} from "../data/PropertyPath";
import {Property} from "../data/Property";
import {Value} from "../data/Value";
import {ValueType} from "../data/ValueType";
import {ValueTypes} from "../data/ValueTypes";
import {PropertyTree} from "../data/PropertyTree";
import {AEl} from "../dom/AEl";
import {DivEl} from "../dom/DivEl";
import {DefaultErrorHandler} from "../DefaultErrorHandler";
import {ContentSummary} from "../content/ContentSummary";
import {FormContext} from "./FormContext";
import {FormItemLayer} from "./FormItemLayer";
import {FormItemOccurrenceView} from "./FormItemOccurrenceView";
import {FormItemSet} from "./FormItemSet";
import {FormItemSetLabel} from "./FormItemSetLabel";
import {FormItemSetOccurrence} from "./FormItemSetOccurrence";
import {FormItemView} from "./FormItemView";
import {RecordingValidityChangedEvent} from "./RecordingValidityChangedEvent";
import {ValidationRecording} from "./ValidationRecording";
import {ValidationRecordingPath} from "./ValidationRecordingPath";

export interface FormItemSetOccurrenceViewConfig {

        context: FormContext;

        formItemSetOccurrence: FormItemSetOccurrence;

        formItemSet: FormItemSet;

        parent: FormItemSetOccurrenceView;

        dataSet: PropertySet
    }

    export class FormItemSetOccurrenceView extends FormItemOccurrenceView {

        private context: FormContext;

        private formItemSetOccurrence: FormItemSetOccurrence;

        private formItemSet: FormItemSet;

        private removeButton: AEl;

        private label: FormItemSetLabel;

        private constructedWithData: boolean;

        private parent: FormItemSetOccurrenceView;

        private propertySet: PropertySet;

        private formItemLayer: FormItemLayer;

        private formItemViews: FormItemView[] = [];

        private formItemSetOccurrencesContainer: DivEl;

        private validityChangedListeners: {(event: RecordingValidityChangedEvent) : void}[] = [];

        private previousValidationRecording: ValidationRecording;

        constructor(config: FormItemSetOccurrenceViewConfig) {
            super("form-item-set-occurrence-view", config.formItemSetOccurrence);
            this.context = config.context;
            this.formItemSetOccurrence = config.formItemSetOccurrence;
            this.formItemSet = config.formItemSet;
            this.parent = config.parent;
            this.constructedWithData = config.dataSet != null;
            this.propertySet = config.dataSet;

            this.formItemLayer = new FormItemLayer(config.context);
        }

        getDataPath(): PropertyPath {

            return this.propertySet.getProperty().getPath();
        }

        public layout(validate: boolean = true): wemQ.Promise<void> {

            var deferred = wemQ.defer<void>();

            this.removeButton = new AEl("remove-button");
            this.appendChild(this.removeButton);
            this.removeButton.onClicked((event: MouseEvent) => {
                this.notifyRemoveButtonClicked();
                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.label = new FormItemSetLabel(this.formItemSet);
            this.appendChild(this.label);

            this.formItemSetOccurrencesContainer = new DivEl("form-item-set-occurrences-container");
            this.appendChild(this.formItemSetOccurrencesContainer);


            var layoutPromise: wemQ.Promise<FormItemView[]> = this.formItemLayer.
                setFormItems(this.formItemSet.getFormItems()).
                setParentElement(this.formItemSetOccurrencesContainer).
                setParent(this).
                layout(this.propertySet, validate);

            layoutPromise.then((formItemViews: FormItemView[]) => {

                this.formItemViews = formItemViews;
                if (validate) {
                    this.validate(true);
                }

                this.formItemViews.forEach((formItemView: FormItemView) => {
                    formItemView.onValidityChanged((event: RecordingValidityChangedEvent) => {

                        var previousValidState = this.previousValidationRecording.isValid();
                        if (event.isValid()) {
                            this.previousValidationRecording.removeByPath(event.getOrigin(), false, event.isIncludeChildren());
                        } else {
                            this.previousValidationRecording.flatten(event.getRecording());
                        }

                        if (previousValidState != this.previousValidationRecording.isValid()) {
                            this.notifyValidityChanged(new RecordingValidityChangedEvent(this.previousValidationRecording,
                                this.resolveValidationRecordingPath()).setIncludeChildren(true));
                        }
                    });
                });

                this.refresh();
                deferred.resolve(null);
            }).catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();

            return deferred.promise;
        }

        public update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {
            var set = propertyArray.getSet(this.formItemSetOccurrence.getIndex());
            if (!set) {
                set = propertyArray.addSet();
            }
            this.propertySet = set;
            return this.formItemLayer.update(this.propertySet, unchangedOnly);
        }

        getFormItemViews(): FormItemView[] {
            return this.formItemViews;
        }

        giveFocus() {
            var focusGiven = false;
            this.getFormItemViews().forEach((formItemView: FormItemView) => {
                if (!focusGiven && formItemView.giveFocus()) {
                    focusGiven = true;
                }
            });
            return focusGiven;
        }

        refresh() {

            if (!this.formItemSetOccurrence.oneAndOnly()) {
                this.label.addClass("drag-control");
            } else {
                this.label.removeClass("drag-control");
            }

            this.removeButton.setVisible(this.formItemSetOccurrence.isRemoveButtonRequired());
        }

        onEditContentRequest(listener: (content: ContentSummary) => void) {
            this.formItemViews.forEach((formItemView: FormItemView) => {
                formItemView.onEditContentRequest(listener);
            });
        }

        unEditContentRequest(listener: (content: ContentSummary) => void) {
            this.formItemViews.forEach((formItemView: FormItemView) => {
                formItemView.unEditContentRequest(listener);
            });
        }

        showContainer(show: boolean) {
            if (show) {
                this.formItemSetOccurrencesContainer.show();
            } else {
                this.formItemSetOccurrencesContainer.hide();
            }
        }

        private resolveValidationRecordingPath(): ValidationRecordingPath {
            return new ValidationRecordingPath(this.getDataPath(), null);
        }

        getLastValidationRecording(): ValidationRecording {
            return this.previousValidationRecording;
        }

        public displayValidationErrors(value: boolean) {
            this.formItemViews.forEach((view: FormItemView) => {
                view.displayValidationErrors(value);
            });
        }

        public setHighlightOnValidityChange(highlight: boolean) {
            this.formItemViews.forEach((view: FormItemView) => {
                view.setHighlightOnValidityChange(highlight);
            });
        }

        hasValidUserInput(): boolean {

            var result = true;
            this.formItemViews.forEach((formItemView: FormItemView) => {
                if (!formItemView.hasValidUserInput()) {
                    result = false;
                }
            });
            return result;
        }


        validate(silent: boolean = true): ValidationRecording {

            var allRecordings = new ValidationRecording();
            this.formItemViews.forEach((formItemView: FormItemView) => {
                var currRecording = formItemView.validate(silent);
                allRecordings.flatten(currRecording);

            });

            if (!silent) {
                if (allRecordings.validityChanged(this.previousValidationRecording)) {
                    this.notifyValidityChanged(new RecordingValidityChangedEvent(allRecordings, this.resolveValidationRecordingPath()));
                }
            }
            this.previousValidationRecording = allRecordings;
            return allRecordings;
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

        onFocus(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.onFocus(listener);
            });
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.unFocus(listener);
            });
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.onBlur(listener);
            });
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.unBlur(listener);
            });
        }
    }

