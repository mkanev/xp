import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {ContentId} from "../../../ContentId";
import {ContentSummary} from "../../../ContentSummary";
import {ContentSummaryLoader} from "../../../resource/ContentSummaryLoader";
import {ImageContentComboBox} from "./ImageContentComboBox";
import {ContentTypeName} from "../../../../schema/content/ContentTypeName";
import {ComboBox} from "../../../../ui/selector/combobox/ComboBox";
import {ResponsiveManager} from "../../../../ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../../../ui/responsive/ResponsiveItem";
import {LoadedDataEvent} from "../../../../util/loader/event/LoadedDataEvent";
import {LoadingDataEvent} from "../../../../util/loader/event/LoadingDataEvent";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {Option} from "../../../../ui/selector/Option";
import {RelationshipTypeName} from "../../../../schema/relationshiptype/RelationshipTypeName";
import {ContentDeletedEvent} from "../../../event/ContentDeletedEvent";
import {UploadItem} from "../../../../ui/uploader/UploadItem";
import {FileUploadedEvent} from "../../../../ui/uploader/FileUploadedEvent";
import {FileUploadStartedEvent} from "../../../../ui/uploader/FileUploadStartedEvent";
import {FileUploadProgressEvent} from "../../../../ui/uploader/FileUploadProgressEvent";
import {FileUploadCompleteEvent} from "../../../../ui/uploader/FileUploadCompleteEvent";
import {FileUploadFailedEvent} from "../../../../ui/uploader/FileUploadFailedEvent";
import {ContentSelectorLoader} from "../contentselector/ContentSelectorLoader";
import {SelectedOptionEvent} from "../../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../../ui/FocusSwitchEvent";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {ImageUploaderEl} from "../../../image/ImageUploaderEl";
import {ElementHiddenEvent} from "../../../../dom/ElementHiddenEvent";
import {ElementShownEvent} from "../../../../dom/ElementShownEvent";
import {Input} from "../../../../form/Input";
import {GetRelationshipTypeByNameRequest} from "../../../../schema/relationshiptype/GetRelationshipTypeByNameRequest";
import {RelationshipType} from "../../../../schema/relationshiptype/RelationshipType";
import {DivEl} from "../../../../dom/DivEl";
import {NotifyManager} from "../../../../notify/NotifyManager";
import {MediaUploaderElOperation} from "../../../../ui/uploader/MediaUploaderEl";
import {GetContentSummaryByIds} from "../../../resource/GetContentSummaryByIds";
import {Reference} from "../../../../util/Reference";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";
import {Content} from "../../../Content";
import {ImageSelectorDisplayValue} from "./ImageSelectorDisplayValue";
import {ImageSelectorSelectedOptionsView} from "./ImageSelectorSelectedOptionsView";
import {ImageSelectorSelectedOptionView} from "./ImageSelectorSelectedOptionView";

export class ImageSelector extends BaseInputTypeManagingAdd<ContentId> {

        private config: ContentInputTypeViewContext;

        private relationshipTypeName: RelationshipTypeName;

        private contentComboBox: ImageContentComboBox;

        private selectedOptionsView: ImageSelectorSelectedOptionsView;

        private contentRequestsAllowed: boolean;

        private uploader: ImageUploaderEl;

        private editContentRequestListeners: {(content: ContentSummary): void }[] = [];

        private relationshipType: string;

        private allowedContentTypes: string[];

        private allowedContentPaths: string[];

        private contentDeletedListener: (event: ContentDeletedEvent) => void;

        constructor(config: ContentInputTypeViewContext) {
            super("image-selector");
            this.addClass("input-type-view");

            this.config = config;

            // requests aren't allowed until allowed contentTypes are specified
            this.contentRequestsAllowed = false;

            this.readConfig(config.inputConfig);

            ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                this.availableSizeChanged();
            });

            // Don't forget to clean up the modal dialog on remove
            this.onRemoved((event) => {
                ResponsiveManager.unAvailableSizeChanged(this);
            });

            this.onShown(() => {
                this.updateSelectedItemsIcons();
            });

            this.handleContentDeletedEvent();
        }

        private handleContentDeletedEvent() {
            this.contentDeletedListener = (event) => {
                if (this.selectedOptionsView.count() == 0) {
                    return;
                }

                var selectedContentIdsMap: {} = {};
                this.selectedOptionsView.getSelectedOptions().forEach(
                    (selectedOption: any) => {
                        if (!!selectedOption.getOption().displayValue && !!selectedOption.getOption().displayValue.getContentId()) {
                            selectedContentIdsMap[selectedOption.getOption().displayValue.getContentId().toString()] = ""
                        }
                    });

                event.getDeletedItems().filter(deletedItem => !deletedItem.isPending() &&
                                                              selectedContentIdsMap.hasOwnProperty(
                                                                  deletedItem.getContentId().toString())).forEach((deletedItem) => {
                        var option = this.selectedOptionsView.getById(deletedItem.getContentId().toString());
                        if (option != null) {
                            this.selectedOptionsView.removeSelectedOptions([option]);
                        }
                    });
            };

            ContentDeletedEvent.on(this.contentDeletedListener);

            this.onRemoved((event) => {
                ContentDeletedEvent.un(this.contentDeletedListener);
            })
        }

        public getImageContentComboBox(): ImageContentComboBox {
            return this.contentComboBox;
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

        private updateSelectedItemsIcons() {
            if (this.contentComboBox.getSelectedOptions().length > 0) {
                this.doLoadContent(this.getPropertyArray()).then((contents: ContentSummary[]) => {
                    contents.forEach((content: ContentSummary) => {
                        this.selectedOptionsView.updateUploadedOption(<Option<ImageSelectorDisplayValue>>{
                            value: content.getId(),
                            displayValue: ImageSelectorDisplayValue.fromContentSummary(content)
                        });
                    });

                    this.setLayoutInProgress(false);
                });
            }
        }

        getValueType(): ValueType {
            return ValueTypes.REFERENCE;
        }

        newInitialValue(): Value {
            return null;
        }

        private countSelectedOptions(): number {
            return this.selectedOptionsView.count();
        }

        private getRemainingOccurrences(): number {
            var inputMaximum = this.getInput().getOccurrences().getMaximum();
            var countSelected = this.countSelectedOptions();
            var rest = -1;
            if (inputMaximum == 0) {
                rest = 0;
            } else {
                rest = inputMaximum - countSelected;
                rest = (rest == 0) ? -1 : rest;
            }

            return rest;
        }

        private createSelectedOptionsView(): ImageSelectorSelectedOptionsView {
            var selectedOptionsView = new ImageSelectorSelectedOptionsView();

            selectedOptionsView.onEditSelectedOptions((options: SelectedOption<ImageSelectorDisplayValue>[]) => {
                options.forEach((option: SelectedOption<ImageSelectorDisplayValue>) => {
                    this.notifyEditContentRequested(option.getOption().displayValue.getContentSummary());
                });
            });

            selectedOptionsView.onRemoveSelectedOptions((options: SelectedOption<ImageSelectorDisplayValue>[]) => {
                options.forEach((option: SelectedOption<ImageSelectorDisplayValue>) => {
                    this.contentComboBox.deselect(option.getOption().displayValue);
                });
                this.validate(false);
            });

            return selectedOptionsView;
        }

        createImageContentComboBox(maximumOccurrences: number, inputIconUrl: string, relationshipAllowedContentTypes: string[],
                              inputName: string): ImageContentComboBox {

            var value = this.getPropertyArray().getProperties().map((property) => {
                return property.getString();
            }).join(';');

            var contentTypes = this.allowedContentTypes.length ? this.allowedContentTypes :
                               relationshipAllowedContentTypes.length ? relationshipAllowedContentTypes :
                                   [ContentTypeName.IMAGE.toString(), ContentTypeName.MEDIA_VECTOR.toString()];

            var contentSelectorLoader = ContentSelectorLoader.create().setContent(this.config.content).
                setInputName(inputName).
                setAllowedContentPaths(this.allowedContentPaths).
                setContentTypeNames(contentTypes).
                setRelationshipType(this.relationshipType).
                build();

            var contentComboBox: ImageContentComboBox
                    = ImageContentComboBox.create().
                    setMaximumOccurrences(maximumOccurrences).
                    setLoader(contentSelectorLoader).
                    setSelectedOptionsView(this.selectedOptionsView = this.createSelectedOptionsView()).
                    setPostLoad(contentSelectorLoader.postLoad.bind(contentSelectorLoader)).
                    setValue(value).
                    build(),
                comboBox: ComboBox<ImageSelectorDisplayValue> = contentComboBox.getComboBox();

            comboBox.onHidden((event: ElementHiddenEvent) => {
                // hidden on max occurrences reached
                if (this.uploader) {
                    this.uploader.hide();
                }
            });
            comboBox.onShown((event: ElementShownEvent) => {
                // shown on occurrences between min and max
                if (this.uploader) {
                    this.uploader.show();
                }
            });
            comboBox.setInputIconUrl(inputIconUrl);

            comboBox.onOptionDeselected((event: SelectedOptionEvent<ImageSelectorDisplayValue>) => {
                // property not found.
                const option = event.getSelectedOption();
                if (option.getOption().displayValue.getContentSummary()) {
                    this.getPropertyArray().remove(option.getIndex());
                }
                this.validate(false);
            });

            comboBox.onContentMissing((ids: string[]) => {
                ids.forEach(id => this.removePropertyWithId(id));
                this.validate(false);
            });

            comboBox.onOptionSelected((event: SelectedOptionEvent<ImageSelectorDisplayValue>) => {
                this.fireFocusSwitchEvent(event);

                if (!this.isLayoutInProgress()) {
                    var contentId = event.getSelectedOption().getOption().displayValue.getContentId();
                    if (!contentId) {
                        return;
                    }

                    this.setContentIdProperty(contentId);
                }
                this.validate(false);
            });

            comboBox.onOptionMoved((moved: SelectedOption<ImageSelectorDisplayValue>) => {

                this.getPropertyArray().set(moved.getIndex(), ValueTypes.REFERENCE.newValue(moved.getOption().value));
                this.validate(false);
            });

            return contentComboBox;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.REFERENCE.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.REFERENCE);
            }
            return super.layout(input, propertyArray).then(() => {
                return new GetRelationshipTypeByNameRequest(this.relationshipTypeName).sendAndParse()
                    .then((relationshipType: RelationshipType) => {

                        this.contentComboBox = this.createImageContentComboBox(
                            input.getOccurrences().getMaximum(), relationshipType.getIconUrl(), relationshipType.getAllowedToTypes() || [],
                            input.getName()
                        );

                        var comboBoxWrapper = new DivEl("combobox-wrapper");

                        comboBoxWrapper.appendChild(this.contentComboBox);

                        this.contentRequestsAllowed = true;

                        if (this.config.content) {
                            comboBoxWrapper.appendChild(this.createUploader());
                        }

                        this.appendChild(comboBoxWrapper);
                        this.appendChild(this.selectedOptionsView);

                        this.setLayoutInProgress(false);
                    });
            });
        }

        private removePropertyWithId(id: string) {
            var length = this.getPropertyArray().getSize();
            for (let i = 0; i < length; i++) {
                if (this.getPropertyArray().get(i).getValue().getString() == id) {
                    this.getPropertyArray().remove(i);
                    NotifyManager.get().showWarning("Failed to load image with id " + id +
                                                               ". The reference will be removed upon save.");
                    break;
                }
            }
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {
            return super.update(propertyArray, unchangedOnly).then(() => {
                if (!unchangedOnly || !this.contentComboBox.isDirty()) {
                    this.contentComboBox.setValue(this.getValueFromPropertyArray(propertyArray));
                }
            });
        }

        private createUploader(): ImageUploaderEl {
            var multiSelection = (this.getInput().getOccurrences().getMaximum() != 1);

            this.uploader = new ImageUploaderEl({
                params: {
                    parent: this.config.content.getContentId().toString()
                },
                operation: MediaUploaderElOperation.create,
                name: 'image-selector-upload-dialog',
                showCancel: false,
                showResult: false,
                maximumOccurrences: this.getRemainingOccurrences(),
                allowMultiSelection: multiSelection,
                deferred: true
            });

            this.uploader.onUploadStarted((event: FileUploadStartedEvent<Content>) => {
                event.getUploadItems().forEach((uploadItem: UploadItem<Content>) => {
                    var value = ImageSelectorDisplayValue.fromUploadItem(uploadItem);

                    var option = <Option<ImageSelectorDisplayValue>>{
                        value: value.getId(),
                        displayValue: value
                    };
                    this.contentComboBox.selectOption(option);
                });
            });

            this.uploader.onUploadProgress((event: FileUploadProgressEvent<Content>) => {
                var item = event.getUploadItem();

                var selectedOption = this.selectedOptionsView.getById(item.getId());
                if (!!selectedOption) {
                    (<ImageSelectorSelectedOptionView> selectedOption.getOptionView()).setProgress(item.getProgress());
                }

                this.uploader.setMaximumOccurrences(this.getRemainingOccurrences());
            });

            this.uploader.onFileUploaded((event: FileUploadedEvent<Content>) => {
                var item = event.getUploadItem();
                var createdContent = item.getModel();

                var selectedOption = this.selectedOptionsView.getById(item.getId());
                var option = selectedOption.getOption();
                option.displayValue.setContentSummary(createdContent);
                option.value = createdContent.getContentId().toString();

                selectedOption.getOptionView().setOption(option);

                // checks newly uploaded image in Selected Options view
                var optionView: ImageSelectorSelectedOptionView = <ImageSelectorSelectedOptionView>selectedOption.getOptionView();
                optionView.getCheckbox().setChecked(true);

                this.setContentIdProperty(createdContent.getContentId());
                this.validate(false);

                this.uploader.setMaximumOccurrences(this.getRemainingOccurrences());
            });

            this.uploader.onUploadFailed((event: FileUploadFailedEvent<Content>) => {
                var item = event.getUploadItem();

                var selectedOption = this.selectedOptionsView.getById(item.getId());
                if (!!selectedOption) {
                    (<ImageSelectorSelectedOptionView> selectedOption.getOptionView()).showError("Upload failed");
                }

                this.uploader.setMaximumOccurrences(this.getRemainingOccurrences());
            });

            this.uploader.onClicked(() => {
                this.uploader.setMaximumOccurrences(this.getRemainingOccurrences());
            });

            //Drag N' Drop
            // in order to toggle appropriate class during drag event
            // we catch drag enter on this element and trigger uploader to appear,
            // then catch drag leave on uploader's dropzone to get back to previous state
            this.onDragEnter((event: DragEvent) => {
                event.stopPropagation();
                this.uploader.giveFocus();
                this.uploader.setDefaultDropzoneVisible(true, true);
            });

            this.uploader.onDropzoneDragLeave((event: DragEvent) => {
                this.uploader.giveBlur();
                this.uploader.setDefaultDropzoneVisible(false);
            });

            this.uploader.onDropzoneDrop((event) => {
                this.uploader.setMaximumOccurrences(this.getRemainingOccurrences());
                this.uploader.setDefaultDropzoneVisible(false);
            });

            return this.uploader;
        }

        private doLoadContent(propertyArray: PropertyArray): wemQ.Promise<ContentSummary[]> {

            var contentIds: ContentId[] = [];
            propertyArray.forEach((property: Property) => {
                if (property.hasNonNullValue()) {
                    contentIds.push(ContentId.fromReference(property.getReference()));
                }
            });
            return new GetContentSummaryByIds(contentIds).sendAndParse();
        }

        protected getNumberOfValids(): number {
            return this.getPropertyArray().getSize();
        }

        giveFocus(): boolean {
            if (this.contentComboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.contentComboBox.giveFocus();
        }

        private setContentIdProperty(contentId: ContentId) {
            var reference = Reference.from(contentId);

            var value = new Value(reference, ValueTypes.REFERENCE);

            if (!this.getPropertyArray().containsValue(value)) {
                this.ignorePropertyChange = true;
                if (this.contentComboBox.countSelected() == 1) { // overwrite initial value
                    this.getPropertyArray().set(0, value);
                }
                else {
                    this.getPropertyArray().add(value);
                }
                this.ignorePropertyChange = false;
            }
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

        onEditContentRequest(listener: (content: ContentSummary) => void) {
            this.editContentRequestListeners.push(listener);
        }

        unEditContentRequest(listener: (content: ContentSummary) => void) {
            this.editContentRequestListeners = this.editContentRequestListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        private notifyEditContentRequested(content: ContentSummary) {
            this.editContentRequestListeners.forEach((listener) => {
                listener(content);
            });
        }
    }

    InputTypeManager.register(new Class("ImageSelector", ImageSelector));
