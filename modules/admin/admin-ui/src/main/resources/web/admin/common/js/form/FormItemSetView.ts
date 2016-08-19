import {PropertySet} from "../data/PropertySet";
import {Property} from "../data/Property";
import {PropertyArray} from "../data/PropertyArray";
import {Value} from "../data/Value";
import {ValueType} from "../data/ValueType";
import {ValueTypes} from "../data/ValueTypes";
import {DivEl} from "../dom/DivEl";
import {Button} from "../ui/button/Button";
import {AEl} from "../dom/AEl";
import {DragHelper} from "../ui/DragHelper";
import {ObjectHelper} from "../ObjectHelper";
import {ContentSummary} from "../content/ContentSummary";
import {Element} from "../dom/Element";
import {assert} from "../util/Assert";
import {FormContext} from "./FormContext";
import {FormItemOccurrenceView} from "./FormItemOccurrenceView";
import {FormItemSet} from "./FormItemSet";
import {FormItemSetOccurrencesConfig} from "./FormItemSetOccurrences";
import {FormItemSetOccurrences} from "./FormItemSetOccurrences";
import {FormItemSetOccurrenceView} from "./FormItemSetOccurrenceView";
import {FormItemViewConfig} from "./FormItemView";
import {FormItemView} from "./FormItemView";
import {OccurrenceAddedEvent} from "./OccurrenceAddedEvent";
import {OccurrenceRemovedEvent} from "./OccurrenceRemovedEvent";
import {RecordingValidityChangedEvent} from "./RecordingValidityChangedEvent";
import {ValidationRecording} from "./ValidationRecording";
import {ValidationRecordingPath} from "./ValidationRecordingPath";

export interface FormItemSetViewConfig {

        context: FormContext;

        formItemSet: FormItemSet;

        parent: FormItemSetOccurrenceView;

        parentDataSet: PropertySet;
    }

    export class FormItemSetView extends FormItemView {

        private formItemSet: FormItemSet;

        private parentDataSet: PropertySet;

        private occurrenceViewsContainer: DivEl;

        private formItemSetOccurrences: FormItemSetOccurrences;

        private bottomButtonRow: DivEl;

        private addButton: Button;

        private collapseButton: AEl;

        private validityChangedListeners: {(event: RecordingValidityChangedEvent) : void}[] = [];

        private previousValidationRecording: ValidationRecording;

        /**
         * The index of child Data being dragged.
         */
        private draggingIndex: number;

        constructor(config: FormItemSetViewConfig) {
            super(<FormItemViewConfig> {
                className: "form-item-set-view",
                context: config.context,
                formItem: config.formItemSet,
                parent: config.parent
            });
            this.parentDataSet = config.parentDataSet;
            this.formItemSet = config.formItemSet;

            this.addClass(this.formItemSet.getPath().getElements().length % 2 ? "even" : "odd");
        }

        private getPropertyArray(propertySet: PropertySet): PropertyArray {
            var propertyArray = propertySet.getPropertyArray(this.formItemSet.getName());
            if (!propertyArray) {
                propertyArray = PropertyArray.create().
                    setType(ValueTypes.DATA).
                    setName(this.formItemSet.getName()).
                    setParent(this.parentDataSet).
                    build();
                propertySet.addPropertyArray(propertyArray);
            }
            return propertyArray;
        }

        public layout(validate: boolean = true): wemQ.Promise<void> {
            var deferred = wemQ.defer<void>();

            this.occurrenceViewsContainer = new DivEl("occurrence-views-container");

            wemjq(this.occurrenceViewsContainer.getHTMLElement()).sortable({
                revert: false,
                containment: this.getHTMLElement(),
                cursor: 'move',
                cursorAt: {left: 14, top: 14},
                distance: 20,
                tolerance: 'pointer',
                handle: '.drag-control',
                placeholder: 'form-item-set-drop-target-placeholder',
                helper: (event, ui) => DragHelper.get().getHTMLElement(),
                start: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDStart(event, ui),
                update: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDUpdate(event, ui)
            });

            this.appendChild(this.occurrenceViewsContainer);

            var propertyArray = this.getPropertyArray(this.parentDataSet);

            this.formItemSetOccurrences = new FormItemSetOccurrences(<FormItemSetOccurrencesConfig>{
                context: this.getContext(),
                occurrenceViewContainer: this.occurrenceViewsContainer,
                formItemSet: this.formItemSet,
                parent: this.getParent(),
                propertyArray: propertyArray
            });

            this.formItemSetOccurrences.layout(validate).then(() => {

                this.formItemSetOccurrences.onOccurrenceRendered(() => {
                    this.validate(false);
                });

                this.formItemSetOccurrences.onOccurrenceAdded((event: OccurrenceAddedEvent) => {
                    this.refresh();
                    wemjq(this.occurrenceViewsContainer.getHTMLElement()).sortable("refresh");

                    if (ObjectHelper.iFrameSafeInstanceOf(event.getOccurrenceView(), FormItemSetOccurrenceView)) {
                        var addedFormItemSetOccurrenceView = <FormItemSetOccurrenceView>event.getOccurrenceView();
                        addedFormItemSetOccurrenceView.onValidityChanged((event: RecordingValidityChangedEvent) => {
                            this.handleFormItemSetOccurrenceViewValidityChanged(event);
                        });
                    }
                });
                this.formItemSetOccurrences.onOccurrenceRemoved((event: OccurrenceRemovedEvent) => {

                    this.refresh();

                    if (ObjectHelper.iFrameSafeInstanceOf(event.getOccurrenceView(), FormItemSetOccurrenceView)) {
                        // force validate, since FormItemSet might have become invalid
                        this.validate(false);
                    }
                });

                this.formItemSetOccurrences.getOccurrenceViews().forEach((formItemSetOccurrenceView: FormItemSetOccurrenceView)=> {
                    formItemSetOccurrenceView.onValidityChanged((event: RecordingValidityChangedEvent) => {
                        this.handleFormItemSetOccurrenceViewValidityChanged(event);
                    });
                    formItemSetOccurrenceView.onEditContentRequest((summary: ContentSummary) => {
                        this.notifyEditContentRequested(summary);
                    })
                });
                this.bottomButtonRow = new DivEl("bottom-button-row");
                this.appendChild(this.bottomButtonRow);

                this.addButton = new Button("Add " + this.formItemSet.getLabel());
                this.addButton.addClass("small");
                this.addButton.onClicked((event: MouseEvent) => {
                    this.formItemSetOccurrences.createAndAddOccurrence(this.formItemSetOccurrences.countOccurrences(),
                        false).then((occurenceView: FormItemOccurrenceView) => {
                            console.log("view added");
                        });
                    if (this.formItemSetOccurrences.isCollapsed()) {
                        this.collapseButton.getHTMLElement().click();
                    }

                });
                this.collapseButton = new AEl("collapse-button");
                this.collapseButton.setHtml("Collapse");
                this.collapseButton.onClicked((event: MouseEvent) => {
                    if (this.formItemSetOccurrences.isCollapsed()) {
                        this.collapseButton.setHtml("Collapse");
                        this.formItemSetOccurrences.showOccurrences(true);
                    } else {
                        this.collapseButton.setHtml("Expand");
                        this.formItemSetOccurrences.showOccurrences(false);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                });

                this.bottomButtonRow.appendChild(this.addButton);
                this.bottomButtonRow.appendChild(this.collapseButton);

                this.refresh();

                if (validate) {
                    this.validate(true);
                }

                deferred.resolve(null);
            });

            return deferred.promise;
        }


        update(propertySet: PropertySet, unchangedOnly?: boolean): Q.Promise<void> {
            this.parentDataSet = propertySet;
            var propertyArray = this.getPropertyArray(propertySet);
            return this.formItemSetOccurrences.update(propertyArray, unchangedOnly);
        }

        private handleFormItemSetOccurrenceViewValidityChanged(event: RecordingValidityChangedEvent) {

            if (!this.previousValidationRecording) {
                return; // skip handling if not previousValidationRecording is not set
            }
            var previousValidState = this.previousValidationRecording.isValid();
            if (event.isValid()) {
                this.previousValidationRecording.removeByPath(event.getOrigin(), false, event.isIncludeChildren());
            }
            else {
                this.previousValidationRecording.flatten(event.getRecording());
            }

            var validationRecordingPath = this.resolveValidationRecordingPath();

            var occurrenceViews = this.formItemSetOccurrences.getOccurrenceViews();
            var occurrenceRecording = new ValidationRecording();

            var numberOfValids = 0;
            occurrenceViews.forEach((occurrenceView: FormItemSetOccurrenceView) => {
                var recordingForOccurrence = occurrenceView.getLastValidationRecording();
                if (recordingForOccurrence && recordingForOccurrence.isValid()) {
                    numberOfValids++;
                }
            });

            if (numberOfValids < this.formItemSet.getOccurrences().getMinimum()) {
                this.previousValidationRecording.breaksMinimumOccurrences(validationRecordingPath);
                occurrenceRecording.breaksMinimumOccurrences(validationRecordingPath);
            } else {
                this.previousValidationRecording.removeUnreachedMinimumOccurrencesByPath(validationRecordingPath, true);
            }

            if (this.formItemSet.getOccurrences().maximumBreached(numberOfValids)) {
                this.previousValidationRecording.breaksMaximumOccurrences(validationRecordingPath);
                occurrenceRecording.breaksMaximumOccurrences(validationRecordingPath);
            } else {
                this.previousValidationRecording.removeBreachedMaximumOccurrencesByPath(validationRecordingPath, true);
            }

            this.renderValidationErrors(occurrenceRecording);

            if (previousValidState != this.previousValidationRecording.isValid()) {
                this.notifyValidityChanged(new RecordingValidityChangedEvent(this.previousValidationRecording,
                    validationRecordingPath).setIncludeChildren(true));
            }
        }

        broadcastFormSizeChanged() {
            this.formItemSetOccurrences.getOccurrenceViews().forEach((occurrenceView: FormItemSetOccurrenceView) => {
                occurrenceView.getFormItemViews().forEach((formItemView: FormItemView) => {
                    formItemView.broadcastFormSizeChanged();
                });
            });
        }

        refresh() {
            this.collapseButton.setVisible(this.formItemSetOccurrences.getOccurrences().length > 0);
            this.addButton.setVisible(!this.formItemSetOccurrences.maximumOccurrencesReached());
        }

        public getFormItemSetOccurrenceView(index: number): FormItemSetOccurrenceView {
            return this.formItemSetOccurrences.getOccurrenceViews()[index];
        }

        private resolveValidationRecordingPath(): ValidationRecordingPath {

            return new ValidationRecordingPath(this.parentDataSet.getPropertyPath(), this.formItemSet.getName(),
                this.formItemSet.getOccurrences().getMinimum(), this.formItemSet.getOccurrences().getMaximum());
        }

        public displayValidationErrors(value: boolean) {
            this.formItemSetOccurrences.getOccurrenceViews().forEach((view: FormItemSetOccurrenceView) => {
                view.displayValidationErrors(value);
            });
        }

        public setHighlightOnValidityChange(highlight: boolean) {
            this.formItemSetOccurrences.getOccurrenceViews().forEach((view: FormItemSetOccurrenceView) => {
                view.setHighlightOnValidityChange(highlight);
            });
        }

        hasValidUserInput(): boolean {

            var result = true;
            this.formItemSetOccurrences.getOccurrenceViews().forEach((formItemOccurrenceView: FormItemOccurrenceView) => {
                if (!formItemOccurrenceView.hasValidUserInput()) {
                    result = false;
                }
            });

            return result;
        }


        validate(silent: boolean = true): ValidationRecording {

            var validationRecordingPath = this.resolveValidationRecordingPath();

            var wholeRecording = new ValidationRecording();

            var occurrenceViews = this.formItemSetOccurrences.getOccurrenceViews();
            var occurrenceRecording = new ValidationRecording();

            var numberOfValids = 0;
            occurrenceViews.forEach((occurrenceView: FormItemSetOccurrenceView) => {
                var recordingForOccurrence = occurrenceView.validate(silent);
                if (recordingForOccurrence.isValid()) {
                    numberOfValids++;
                }
                wholeRecording.flatten(recordingForOccurrence);
            });

            if (numberOfValids < this.formItemSet.getOccurrences().getMinimum()) {
                wholeRecording.breaksMinimumOccurrences(validationRecordingPath);
                occurrenceRecording.breaksMinimumOccurrences(validationRecordingPath);
            }
            if (this.formItemSet.getOccurrences().maximumBreached(numberOfValids)) {
                wholeRecording.breaksMaximumOccurrences(validationRecordingPath);
                occurrenceRecording.breaksMaximumOccurrences(validationRecordingPath);
            }

            if (!silent && wholeRecording.validityChanged(this.previousValidationRecording)) {
                this.notifyValidityChanged(new RecordingValidityChangedEvent(wholeRecording, validationRecordingPath));
            }

            // display only errors related to occurrences
            this.renderValidationErrors(occurrenceRecording);

            this.previousValidationRecording = wholeRecording;

            return wholeRecording;
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

        private renderValidationErrors(recording: ValidationRecording) {
            if (recording.isValid()) {
                this.removeClass("invalid");
                this.addClass("valid");
            }
            else {
                this.removeClass("valid");
                this.addClass("invalid");
            }
        }

        giveFocus(): boolean {

            var focusGiven = false;
            if (this.formItemSetOccurrences.getOccurrenceViews().length > 0) {
                var views: FormItemOccurrenceView[] = this.formItemSetOccurrences.getOccurrenceViews();
                for (var i = 0; i < views.length; i++) {
                    if (views[i].giveFocus()) {
                        focusGiven = true;
                        break;
                    }
                }
            }
            return focusGiven;
        }

        private handleDnDStart(event: Event, ui: JQueryUI.SortableUIParams): void {

            var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
            assert(draggedElement.hasClass("form-item-set-occurrence-view"));
            this.draggingIndex = draggedElement.getSiblingIndex();

            ui.placeholder.html("Drop form item set here");
        }

        private handleDnDUpdate(event: Event, ui: JQueryUI.SortableUIParams) {

            if (this.draggingIndex >= 0) {
                var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
                assert(draggedElement.hasClass("form-item-set-occurrence-view"));
                var draggedToIndex = draggedElement.getSiblingIndex();

                this.formItemSetOccurrences.moveOccurrence(this.draggingIndex, draggedToIndex);
            }

            this.draggingIndex = -1;
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.formItemSetOccurrences.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.formItemSetOccurrences.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.formItemSetOccurrences.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.formItemSetOccurrences.unBlur(listener);
        }
    }
