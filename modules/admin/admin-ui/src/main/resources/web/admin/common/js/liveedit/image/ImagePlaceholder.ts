import {PageItemType} from "../PageItemType";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {ImageComponent} from "../../content/page/region/ImageComponent";
import {SelectedOptionEvent} from "../../ui/selector/combobox/SelectedOptionEvent";
import {ItemViewPlaceholder} from "../ItemViewPlaceholder";
import {ContentComboBox} from "../../content/ContentComboBox";
import {DivEl} from "../../dom/DivEl";
import {ImageUploaderEl} from "../../content/image/ImageUploaderEl";
import {ContentSummaryLoader} from "../../content/resource/ContentSummaryLoader";
import {ContentSummary} from "../../content/ContentSummary";
import {MediaUploaderElOperation} from "../../ui/uploader/MediaUploaderEl";
import {FileUploadedEvent} from "../../ui/uploader/FileUploadedEvent";
import {Content} from "../../content/Content";
import {ImageComponentView} from "./ImageComponentView";

export class ImagePlaceholder extends ItemViewPlaceholder {

        private imageComponentView: ImageComponentView;

        private comboBox: ContentComboBox;

        private comboboxWrapper: DivEl;

        private imageUploader: ImageUploaderEl;

        constructor(imageView: ImageComponentView) {
            super();
            this.addClassEx("image-placeholder");
            this.imageComponentView = imageView;

            this.initImageCombobox(imageView);
            this.initImageUploader(imageView);
            this.initImageComboboxWrapper();
        }

        private initImageCombobox(imageView: ImageComponentView) {
            var loader = new ContentSummaryLoader();
            loader.setContentPath(imageView.getLiveEditModel().getContent().getPath());
            loader.setAllowedContentTypeNames([ContentTypeName.IMAGE, ContentTypeName.MEDIA_VECTOR]);

            this.comboBox = ContentComboBox.create().
                setMaximumOccurrences(1).
                setLoader(loader).
                setMinWidth(270).
                build();

            this.comboBox.getComboBox().getInput().setPlaceholder("Type to search or drop image here...");
            this.comboBox.onOptionSelected((event: SelectedOptionEvent<ContentSummary>) => {

                var component: ImageComponent = this.imageComponentView.getComponent();
                var imageContent = event.getSelectedOption().getOption().displayValue;

                component.setImage(imageContent.getContentId(), imageContent.getDisplayName());

                this.imageComponentView.showLoadingSpinner();
            });
        }

        private initImageUploader(imageView: ImageComponentView) {
            this.imageUploader = new ImageUploaderEl({
                params: {
                    parent: imageView.getLiveEditModel().getContent().getContentId().toString()
                },
                operation: MediaUploaderElOperation.create,
                name: 'image-selector-placeholder-upload',
                showCancel: false,
                showResult: false,
                allowMultiSelection: false,
                hideDefaultDropZone: true,
                deferred: true
            });

            this.imageUploader.getUploadButton().onClicked(() => this.comboboxWrapper.show());

            this.imageUploader.onFileUploaded((event: FileUploadedEvent<Content>) => {
                var createdImage = event.getUploadItem().getModel();

                var component: ImageComponent = this.imageComponentView.getComponent();
                component.setImage(createdImage.getContentId(), createdImage.getDisplayName());
            });

            this.imageUploader.addDropzone(this.comboBox.getId());
        }

        private initImageComboboxWrapper() {
            this.comboboxWrapper = new DivEl('rich-combobox-wrapper');
            this.comboboxWrapper.appendChild(this.comboBox);
            this.comboboxWrapper.appendChild(<any>this.imageUploader);
            this.appendChild(this.comboboxWrapper);
        }

        select() {
            this.comboboxWrapper.show();
            this.comboBox.giveFocus();
        }

        deselect() {
            this.comboboxWrapper.hide();
        }
    }
