import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {GetRelationshipTypeByNameRequest} from "../../../../schema/relationshiptype/GetRelationshipTypeByNameRequest";
import {RelationshipTypeName} from "../../../../schema/relationshiptype/RelationshipTypeName";
import {ContentDeletedEvent} from "../../../event/ContentDeletedEvent";
import {SelectedOptionEvent} from "../../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../../ui/FocusSwitchEvent";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {ContentId} from "../../../ContentId";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {ContentComboBox} from "../../../ContentComboBox";
import {Input} from "../../../../form/Input";
import {RelationshipType} from "../../../../schema/relationshiptype/RelationshipType";
import {ContentSummary} from "../../../ContentSummary";
import {Reference} from "../../../../util/Reference";
import {NotifyManager} from "../../../../notify/NotifyManager";
import {GetContentSummaryByIds} from "../../../resource/GetContentSummaryByIds";
import {Element} from "../../../../dom/Element";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";
import {ContentSelectorLoader} from "./ContentSelectorLoader";

export class ContentSelector extends BaseInputTypeManagingAdd<ContentId> {

        private config: ContentInputTypeViewContext;

        private relationshipTypeName: RelationshipTypeName;

        private contentComboBox: ContentComboBox;

        private draggingIndex: number;

        private relationshipType: string;

        private allowedContentTypes: string[];

        private allowedContentPaths: string[];

        private contentDeletedListener: (event: ContentDeletedEvent) => void;

        constructor(config?: ContentInputTypeViewContext) {
            super("relationship");
            this.addClass("input-type-view");
            this.config = config;
            this.readConfig(config.inputConfig);
            this.handleContentDeletedEvent();
        }

        public getContentComboBox(): ContentComboBox {
            return this.contentComboBox;
        }

        private handleContentDeletedEvent() {
            this.contentDeletedListener = (event) => {
                if (this.contentComboBox.getSelectedOptionView().count() == 0) {
                    return;
                }

                var selectedContentIdsMap: {} = {};
                this.contentComboBox.getSelectedOptionView().getSelectedOptions().forEach(
                    (selectedOption: any) => {
                        if (!!selectedOption.getOption().displayValue && !!selectedOption.getOption().displayValue.getContentId()) {
                            selectedContentIdsMap[selectedOption.getOption().displayValue.getContentId().toString()] = ""
                        }
                    });

                event.getDeletedItems().
                    filter(deletedItem => !deletedItem.isPending() &&
                                          selectedContentIdsMap.hasOwnProperty(deletedItem.getContentId().toString())).
                    forEach((deletedItem) => {
                        var option = this.contentComboBox.getSelectedOptionView().getById(deletedItem.getContentId().toString());
                        if (option != null) {
                            this.contentComboBox.getSelectedOptionView().removeOption(option.getOption(), false);
                        }
                    });
            };

            ContentDeletedEvent.on(this.contentDeletedListener);

            this.onRemoved((event) => {
                ContentDeletedEvent.un(this.contentDeletedListener);
            });
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var relationshipTypeConfig = inputConfig['relationshipType'] ? inputConfig['relationshipType'][0] : {};
            this.relationshipType = relationshipTypeConfig['value'];

            if (this.relationshipType) {
                this.relationshipTypeName = new RelationshipTypeName(this.relationshipType);
            } else {
                this.relationshipTypeName = RelationshipTypeName.REFERENCE;
            }

            var allowContentTypeConfig = inputConfig['allowContentType'] || [];
            this.allowedContentTypes = allowContentTypeConfig.map((cfg) => cfg['value']).filter((val) => !!val);

            var allowContentPathConfig = inputConfig['allowPath'] || [];
            this.allowedContentPaths = allowContentPathConfig.map((cfg) => cfg['value']).filter((val) => !!val);
        }

        availableSizeChanged() {
            console.log("Relationship.availableSizeChanged(" + this.getEl().getWidth() + "x" + this.getEl().getWidth() + ")");
        }

        getValueType(): ValueType {
            return ValueTypes.REFERENCE;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.REFERENCE.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.REFERENCE);
            }
            super.layout(input, propertyArray);

            var contentSelectorLoader = ContentSelectorLoader.create().setContent(this.config.content).
                setInputName(input.getName()).
                setAllowedContentPaths(this.allowedContentPaths).
                setContentTypeNames(this.allowedContentTypes).
                setRelationshipType(this.relationshipType).
                build();

            var value = this.getValueFromPropertyArray(propertyArray);

            this.contentComboBox = ContentComboBox.create()
                .setName(input.getName())
                .setMaximumOccurrences(input.getOccurrences().getMaximum())
                .setLoader(contentSelectorLoader)
                .setValue(value)
                .setPostLoad(contentSelectorLoader.postLoad.bind(contentSelectorLoader))
                .setRemoveMissingSelectedOptions(true)
                .build();

            this.contentComboBox.getComboBox().onContentMissing((ids: string[]) => {
                ids.forEach(id => this.removePropertyWithId(id));
                this.validate(false);
            });

            return new GetRelationshipTypeByNameRequest(this.relationshipTypeName).sendAndParse().then(
                (relationshipType: RelationshipType) => {

                    this.contentComboBox.setInputIconUrl(relationshipType.getIconUrl());

                    this.appendChild(this.contentComboBox);

                    return this.doLoadContent(propertyArray).then((contents: ContentSummary[]) => {

                            //TODO: original value doesn't work because of additional request, so have to select manually
                            contents.forEach((content: ContentSummary) => {
                                this.contentComboBox.select(content);
                            });

                        this.contentComboBox.getSelectedOptions().forEach((selectedOption: SelectedOption<ContentSummary>) => {
                            this.updateSelectedOptionIsEditable(selectedOption);
                        });

                        this.contentComboBox.onOptionSelected((event: SelectedOptionEvent<ContentSummary>) => {
                            this.fireFocusSwitchEvent(event);

                            var reference = Reference.from(event.getSelectedOption().getOption().displayValue.getContentId());

                                var value = new Value(reference, ValueTypes.REFERENCE);
                                if (this.contentComboBox.countSelected() == 1) { // overwrite initial value
                                    this.getPropertyArray().set(0, value);
                                }
                                else if (!this.getPropertyArray().containsValue(value)) {
                                    this.getPropertyArray().add(value);
                                }

                            this.updateSelectedOptionIsEditable(event.getSelectedOption());
                                this.refreshSortable();
                                this.updateSelectedOptionStyle();
                                this.validate(false);
                            });

                        this.contentComboBox.onOptionDeselected((event: SelectedOptionEvent<ContentSummary>) => {

                            this.getPropertyArray().remove(event.getSelectedOption().getIndex());
                            this.updateSelectedOptionStyle();
                            this.validate(false);
                            });

                            this.setupSortable();

                            this.setLayoutInProgress(false);
                    });
                });
        }

        private removePropertyWithId(id: string) {
            var length = this.getPropertyArray().getSize();
            for (let i = 0; i < length; i++) {
                if (this.getPropertyArray().get(i).getValue().getString() == id) {
                    this.getPropertyArray().remove(i);
                    NotifyManager.get().showWarning("Failed to load content item with id " + id +
                                                               ". The reference will be removed upon save.");
                    break;
                }
            }
        }

        update(propertyArray: PropertyArray, unchangedOnly: boolean): Q.Promise<void> {
            return super.update(propertyArray, unchangedOnly).then(() => {
                if (!unchangedOnly || !this.contentComboBox.isDirty()) {
                    var value = this.getValueFromPropertyArray(propertyArray);
                    this.contentComboBox.setValue(value);
                }
            });
        }

        private doLoadContent(propertyArray: PropertyArray): wemQ.Promise<ContentSummary[]> {

            var contentIds: ContentId[] = [];
            propertyArray.forEach((property: Property) => {
                if (property.hasNonNullValue()) {
                    var referenceValue = property.getReference();
                    if (referenceValue instanceof Reference) {
                        contentIds.push(ContentId.fromReference(referenceValue));
                    }
                }
            });
            return new GetContentSummaryByIds(contentIds).sendAndParse().
                then((result: ContentSummary[]) => {
                    return result;
                });

        }

        private setupSortable() {
            wemjq(this.getHTMLElement()).find(".selected-options").sortable({
                axis: "y",
                containment: 'parent',
                handle: '.drag-control',
                tolerance: 'pointer',
                start: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDStart(event, ui),
                update: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDUpdate(event, ui)
            });

            this.updateSelectedOptionStyle();
        }

        private handleDnDStart(event: Event, ui: JQueryUI.SortableUIParams): void {

            var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
            this.draggingIndex = draggedElement.getSiblingIndex();

            ui.placeholder.html("Drop form item set here");
        }

        private handleDnDUpdate(event: Event, ui: JQueryUI.SortableUIParams) {

            if (this.draggingIndex >= 0) {
                var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
                var draggedToIndex = draggedElement.getSiblingIndex();
                this.getPropertyArray().move(this.draggingIndex, draggedToIndex);
            }

            this.draggingIndex = -1;
        }

        private updateSelectedOptionStyle() {
            if (this.getPropertyArray().getSize() > 1) {
                this.addClass("multiple-occurrence").removeClass("single-occurrence");
            }
            else {
                this.addClass("single-occurrence").removeClass("multiple-occurrence");
            }
        }

        private updateSelectedOptionIsEditable(selectedOption: SelectedOption<ContentSummary>) {
            let selectedContentId = selectedOption.getOption().displayValue.getContentId();
            let refersToItself = selectedContentId.toString() === this.config.content.getId();
            selectedOption.getOptionView().toggleClass("non-editable", refersToItself);
        }

        private refreshSortable() {
            wemjq(this.getHTMLElement()).find(".selected-options").sortable("refresh");
        }

        protected getNumberOfValids(): number {
            return this.contentComboBox.countSelected();
        }

        giveFocus(): boolean {
            if (this.contentComboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.contentComboBox.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.contentComboBox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.contentComboBox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.contentComboBox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.contentComboBox.unBlur(listener);
        }

    }

    InputTypeManager.register(new Class("ContentSelector", ContentSelector));
