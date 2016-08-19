import {FormItemBuilder} from "../../../ui/form/FormItem";
import {FormItem} from "../../../ui/form/FormItem";
import {Validators} from "../../../ui/form/Validators";
import {FileUploadedEvent} from "../../../ui/uploader/FileUploadedEvent";
import {FileUploadStartedEvent} from "../../../ui/uploader/FileUploadStartedEvent";
import {FileUploadProgressEvent} from "../../../ui/uploader/FileUploadProgressEvent";
import {FileUploadCompleteEvent} from "../../../ui/uploader/FileUploadCompleteEvent";
import {FileUploadFailedEvent} from "../../../ui/uploader/FileUploadFailedEvent";
import {OptionSelectedEvent} from "../../../ui/selector/OptionSelectedEvent";
import {Content} from "../../../content/Content";
import {Action} from "../../../ui/Action";
import {SelectedOptionEvent} from "../../../ui/selector/combobox/SelectedOptionEvent";
import {DivEl} from "../../../dom/DivEl";
import {ImageUploaderEl} from "../../../content/image/ImageUploaderEl";
import {ContentSummary} from "../../../content/ContentSummary";
import {ContentComboBox} from "../../../content/ContentComboBox";
import {ProgressBar} from "../../../ui/ProgressBar";
import {ImgEl} from "../../../dom/ImgEl";
import {LoadMask} from "../../../ui/mask/LoadMask";
import {DropzoneContainer} from "../../../ui/uploader/UploaderEl";
import {ModalDialogHeader} from "../../../ui/dialog/ModalDialog";
import {ContentSummaryLoader} from "../../../content/resource/ContentSummaryLoader";
import {StringHelper} from "../../StringHelper";
import {FormItemEl} from "../../../dom/FormItemEl";
import {ContentTypeName} from "../../../schema/content/ContentTypeName";
import {LoadedDataEvent} from "../../loader/event/LoadedDataEvent";
import {ResponsiveManager} from "../../../ui/responsive/ResponsiveManager";
import {KeyHelper} from "../../../ui/KeyHelper";
import {ResponsiveItem} from "../../../ui/responsive/ResponsiveItem";
import {ElementHelper} from "../../../dom/ElementHelper";
import {ContentImageUrlResolver} from "../../../content/util/ContentImageUrlResolver";
import {ContentId} from "../../../content/ContentId";
import {MediaUploaderElOperation} from "../../../ui/uploader/MediaUploaderEl";
import {InputEl} from "../../../dom/InputEl";
import {HTMLAreaHelper} from "../editor/HTMLAreaHelper";
import {Toolbar} from "../../../ui/toolbar/Toolbar";
import {ActionButton} from "../../../ui/button/ActionButton";
import {Checkbox} from "../../../ui/Checkbox";
import {UriHelper} from "../../UriHelper";
import {Element} from "../../../dom/Element";
import {HtmlModalDialog} from "./HtmlModalDialog";
import {HtmlAreaImage} from "./HtmlModalDialog";
import {ImageCroppingOption} from "./ImageCroppingOption";
import {ImageCroppingOptions} from "./ImageCroppingOptions";
import {ImageCroppingSelector} from "./ImageCroppingSelector";

export class ImageModalDialog extends HtmlModalDialog {

        private imagePreviewContainer: DivEl;
        private imageCaptionField: FormItem;
        private imageUploaderEl: ImageUploaderEl;
        private imageElement: HTMLImageElement;
        private content: ContentSummary;
        private imageSelector: ContentComboBox;
        private progress: ProgressBar;
        private error: DivEl;
        private image: ImgEl;
        private elementContainer: HTMLElement;
        private callback: Function;
        private imageToolbar: ImageToolbar;
        private imagePreviewScrollHandler: ImagePreviewScrollHandler;
        private imageLoadMask: LoadMask;
        private dropzoneContainer: DropzoneContainer;

        static imagePrefix = "image://";
        static maxImageWidth = 640;

        constructor(config: HtmlAreaImage, content: ContentSummary) {
            this.imageElement = <HTMLImageElement>config.element;
            this.elementContainer = config.container;
            this.content = content;
            this.callback = config.callback;

            super(config.editor, new ModalDialogHeader("Insert Image"), "image-modal-dialog");
        }

        protected getMainFormItems(): FormItem[] {
            var imageSelector = this.createImageSelector("imageId");

            this.addUploaderAndPreviewControls(imageSelector);
            this.setFirstFocusField(imageSelector.getInput());

            return [
                imageSelector,
                this.imageCaptionField = this.createFormItem("caption", "Caption", null, this.getCaption())
            ];
        }

        private createImageSelector(id: string): FormItem {
            let loader = new ContentSummaryLoader();
            loader.setContentPath(this.content.getPath());

            let imageSelector = ContentComboBox.create().
                    setLoader(loader).
                    setMaximumOccurrences(1).
                    build(),

                formItem = this.createFormItem(id, "Image", Validators.required, StringHelper.EMPTY_STRING,
                    <FormItemEl>imageSelector),
                imageSelectorComboBox = imageSelector.getComboBox();

            imageSelector.getComboBox().getInput().setPlaceholder("Type to search or drop image here...");

            this.imageSelector = imageSelector;

            formItem.addClass("image-selector");

            loader.setAllowedContentTypeNames([ContentTypeName.IMAGE, ContentTypeName.MEDIA_VECTOR]);

            if (this.imageElement) {
                var singleLoadListener = (event: LoadedDataEvent<ContentSummary>) => {
                    var imageContent = this.getImageContent(event.getData());
                    if (imageContent) {
                        imageSelector.setValue(imageContent.getId());
                        this.createImgElForExistingImage(imageContent);
                        this.previewImage();
                        formItem.addClass("selected-item-preview");
                    }
                    loader.unLoadedData(singleLoadListener);
                };
                loader.onLoadedData(singleLoadListener);
                loader.load();
            }

            imageSelectorComboBox.onOptionSelected((event: SelectedOptionEvent<ContentSummary>) => {
                var imageContent = event.getSelectedOption().getOption().displayValue;
                if (!imageContent.getContentId()) {
                    return;
                }

                this.imageLoadMask.show();
                this.createImgElForNewImage(imageContent);
                this.previewImage();
                formItem.addClass("selected-item-preview");
            });

            imageSelectorComboBox.onOptionDeselected(() => {
                formItem.removeClass("selected-item-preview");
                this.displayValidationErrors(false);
                this.removePreview();
                this.imageToolbar.remove();
                this.showCaptionLabel();
                this.imageUploaderEl.show();
                this.imagePreviewScrollHandler.toggleScrollButtons();
                ResponsiveManager.fireResizeEvent();
            });

            imageSelectorComboBox.onKeyDown((e: KeyboardEvent) => {
                if (KeyHelper.isEscKey(e) && !imageSelectorComboBox.isDropdownShown()) {
                    // Prevent modal dialog from closing on Esc key when dropdown is expanded
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            return formItem;
        }

        private addUploaderAndPreviewControls(imageSelector: FormItem) {
            var imageSelectorContainer = imageSelector.getInput().getParentElement();

            imageSelectorContainer.appendChild(this.imageUploaderEl = this.createImageUploader());
            this.initDragAndDropUploaderEvents();

            this.createImagePreviewContainer();

            var scrollBarWrapperDiv = new DivEl("preview-panel-scrollbar-wrapper");
            scrollBarWrapperDiv.appendChild(this.imagePreviewContainer);
            var scrollNavigationWrapperDiv = new DivEl("preview-panel-scroll-navigation-wrapper");
            scrollNavigationWrapperDiv.appendChild(scrollBarWrapperDiv);

            wemjq(scrollNavigationWrapperDiv.getHTMLElement()).insertAfter(imageSelectorContainer.getHTMLElement());

            this.imagePreviewScrollHandler = new ImagePreviewScrollHandler(this.imagePreviewContainer);

            this.imageLoadMask = new LoadMask(this.imagePreviewContainer);
            this.imagePreviewContainer.appendChild(this.imageLoadMask);

            ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                this.resetPreviewContainerMaxHeight();
                this.imagePreviewScrollHandler.toggleScrollButtons();
                this.imagePreviewScrollHandler.setMarginRight();
            });
        }

        private getImageContent(images: ContentSummary[]): ContentSummary {
            var filteredImages = images.filter((image: ContentSummary) => {
                return this.imageElement.src.indexOf(image.getId()) > 0;
            });

            return filteredImages.length > 0 ? filteredImages[0] : null;
        }

        private createImgElForExistingImage(imageContent: ContentSummary) {
            this.image = this.createImgElForPreview(imageContent, true);
        }

        private createImgElForNewImage(imageContent: ContentSummary) {
            this.image = this.createImgElForPreview(imageContent, false);
        }

        private previewImage() {
            this.imageToolbar = new ImageToolbar(this.image, this.imageLoadMask);
            this.imageToolbar.onCroppingChanged(() => {
                this.imagePreviewScrollHandler.resetScrollPosition();
            });

            this.image.onLoaded(() => {
                this.imageLoadMask.hide();
                this.imagePreviewContainer.removeClass("upload");
                wemjq(this.imageToolbar.getHTMLElement()).insertBefore(
                    this.imagePreviewContainer.getHTMLElement().parentElement.parentElement);
                ResponsiveManager.fireResizeEvent();
                if (this.getCaptionFieldValue() == "") {
                    this.imageCaptionField.getEl().scrollIntoView();
                    this.imageCaptionField.getInput().giveFocus();
                }
            });

            this.hideUploadMasks();
            this.hideCaptionLabel();
            this.imageUploaderEl.hide();
            this.imagePreviewContainer.insertChild(this.image, 0);
        }

        private createImgElForPreview(imageContent: ContentSummary, isExistingImg: boolean = false): ImgEl {
            var imgSrcAttr = isExistingImg
                ? new ElementHelper(this.imageElement).getAttribute("src")
                : this.generateDefaultImgSrc(imageContent.getContentId().toString());
            var imgDataSrcAttr = isExistingImg
                ? new ElementHelper(this.imageElement).getAttribute("data-src")
                : ImageModalDialog.imagePrefix + imageContent.getContentId().toString();

            var imageEl = new ImgEl(imgSrcAttr);
            imageEl.getEl().setAttribute("alt", imageContent.getDisplayName());
            imageEl.getEl().setAttribute("data-src", imgDataSrcAttr);

            var imageAlignment = isExistingImg ? (this.imageElement.parentElement.style.textAlign ||
                                                  this.imageElement.parentElement.style.cssFloat) : "justify";
            imageEl.getHTMLElement().style.textAlign = imageAlignment;

            return imageEl;
        }

        private generateDefaultImgSrc(contentId): string {
            return new ContentImageUrlResolver().setContentId(new ContentId(contentId)).setScaleWidth(
                true).setSize(
                ImageModalDialog.maxImageWidth).resolve();
        }

        private hideCaptionLabel() {
            this.imageCaptionField.getLabel().hide();
            this.imageCaptionField.getInput().getEl().setAttribute("placeholder", "Caption");
            this.imageCaptionField.getInput().getParentElement().getEl().setMarginLeft("0px");
        }

        private showCaptionLabel() {
            this.imageCaptionField.getLabel().show();
            this.imageCaptionField.getInput().getEl().removeAttribute("placeholder");
            this.imageCaptionField.getInput().getParentElement().getEl().setMarginLeft("");
        }

        private removePreview() {
            this.imagePreviewContainer.removeChild(this.image);
        }

        show() {
            super.show();

            this.imageUploaderEl.show();
        }

        private createImagePreviewContainer() {
            var imagePreviewContainer = new DivEl("content-item-preview-panel");

            this.progress = new ProgressBar();
            imagePreviewContainer.appendChild(this.progress);

            this.error = new DivEl("error");
            imagePreviewContainer.appendChild(this.error);

            this.imagePreviewContainer = imagePreviewContainer;

            this.resetPreviewContainerMaxHeight();
        }

        private resetPreviewContainerMaxHeight() {
            //limiting image modal dialog height up to screen size except padding on top and bottom
            //so 340 is 300px content of image modal dialog except preview container + 20*2 from top and bottom of screen
            var maxImagePreviewHeight = wemjq(window).height() - 340;
            new ElementHelper(this.imagePreviewContainer.getHTMLElement()).setMaxHeightPx(maxImagePreviewHeight);
        }


        private getCaption(): string {
            if (this.imageElement) {
                return wemjq(this.imageElement.parentElement).children("figcaption").text();
            }
            else {
                return StringHelper.EMPTY_STRING;
            }
        }

        private createImageUploader(): ImageUploaderEl {
            var uploader = new ImageUploaderEl({
                params: {
                    parent: this.content.getContentId().toString()
                },
                operation: MediaUploaderElOperation.create,
                name: 'image-selector-upload-dialog',
                showResult: false,
                maximumOccurrences: 1,
                allowMultiSelection: false,
                deferred: true,
                showCancel: false,
                selfIsDropzone: false
            });

            this.dropzoneContainer = new DropzoneContainer(true);
            this.dropzoneContainer.hide();
            this.appendChild(this.dropzoneContainer);

            uploader.addDropzone(this.dropzoneContainer.getDropzone().getId());

            uploader.hide();

            uploader.onUploadStarted((event: FileUploadStartedEvent<Content>) => {
                this.hideUploadMasks();
                this.imagePreviewContainer.addClass("upload");
                this.showProgress();
            });

            uploader.onUploadProgress((event: FileUploadProgressEvent<Content>) => {
                var item = event.getUploadItem();

                this.setProgress(item.getProgress());
            });

            uploader.onFileUploaded((event: FileUploadedEvent<Content>) => {
                var item = event.getUploadItem();
                var createdContent = item.getModel();
                
                this.imageSelector.setContent(createdContent);
            });

            uploader.onUploadFailed((event: FileUploadFailedEvent<Content>) => {
                this.showError("Upload failed")
            });

            return uploader;
        }

        private initDragAndDropUploaderEvents() {
            var dragOverEl;
            this.onDragEnter((event: DragEvent) => {
                if (this.imageUploaderEl.isEnabled()) {
                    var target = <HTMLElement> event.target;

                    if (!!dragOverEl || dragOverEl == this.getHTMLElement()) {
                        this.dropzoneContainer.show();
                    }
                    dragOverEl = target;
                }
            });

            this.imageUploaderEl.onDropzoneDragLeave(() => this.dropzoneContainer.hide());
            this.imageUploaderEl.onDropzoneDrop(() => this.dropzoneContainer.hide());
        }

        private setProgress(value: number) {
            this.progress.setValue(value);
        }

        private showProgress() {
            this.progress.show();
        }


        private hideUploadMasks() {
            this.progress.hide();
            this.error.hide();
        }

        private showError(text: string) {
            this.progress.hide();
            this.error.setHtml(text).show();
            this.error.show();
        }

        protected initializeActions() {
            var submitAction = new Action(this.imageElement ? "Update" : "Insert");
            this.setSubmitAction(submitAction);
            this.addAction(submitAction.onExecuted(() => {
                this.displayValidationErrors(true);
                if (this.validate()) {
                    this.createImageTag();
                    this.close();
                }
            }));

            super.initializeActions();
        }

        private getCaptionFieldValue() {
            return (<InputEl>this.imageCaptionField.getInput()).getValue().trim();
        }

        private isImageWiderThanEditor() {
            if (!!this.getEditor()["editorContainer"]) {
                return (this.image.getHTMLElement()["width"] > this.getEditor()["editorContainer"].clientWidth);
            }
            else if (!!this.getEditor() && this.getEditor()["inline"] === true) {
                return (this.image.getHTMLElement()["width"] > this.getEditor()["bodyElement"].clientWidth);
            }
            return true;
        }

        private createFigureElement() {

            var figure = ElementHelper.fromName("figure");
            var figCaption = ElementHelper.fromName("figcaption");
            figCaption.setText(this.getCaptionFieldValue());
            figCaption.setAttribute("style", "text-align: center");
            this.image.setId("__mcenew");

            figure.appendChildren([(<ImgEl>this.image).getEl().getHTMLElement(), figCaption.getHTMLElement()]);

            return figure;
        }

        private createImageTag(): void {
            var figure = this.createFigureElement();

            HTMLAreaHelper.updateImageParentAlignment(this.image.getHTMLElement());
            this.setImageWidthConstraint();

            var img = this.callback(figure.getHTMLElement());
            HTMLAreaHelper.changeImageParentAlignmentOnImageAlignmentChange(img);
        }

        private setImageWidthConstraint() {
            var keepImageSize = this.isImageInOriginalSize(this.image.getHTMLElement());
            this.image.getHTMLElement().style["width"] = (this.isImageWiderThanEditor() || !keepImageSize) ? "100%" : "auto";
        }

        private isImageInOriginalSize(image: HTMLElement) {
            return image.getAttribute("data-src").indexOf("keepSize=true") > 0;
        }
    }

    export class ImageToolbar extends Toolbar {

        private image: ImgEl;

        private justifyButton: ActionButton;

        private alignLeftButton: ActionButton;

        private centerButton: ActionButton;

        private alignRightButton: ActionButton;

        private keepOriginalSizeCheckbox: Checkbox;

        private imageCroppingSelector: ImageCroppingSelector;

        private imageLoadMask: LoadMask;

        constructor(image: ImgEl, imageLoadMask: LoadMask) {
            super("image-toolbar");

            this.image = image;
            this.imageLoadMask = imageLoadMask;

            super.addElement(this.justifyButton = this.createJustifiedButton());
            super.addElement(this.alignLeftButton = this.createLeftAlignedButton());
            super.addElement(this.centerButton = this.createCenteredButton());
            super.addElement(this.alignRightButton = this.createRightAlignedButton());
            super.addElement(this.keepOriginalSizeCheckbox = this.createKeepOriginalSizeCheckbox());
            super.addElement(this.imageCroppingSelector = this.createImageCroppingSelector());

            this.initKeepSizeCheckbox();
            this.initActiveButton();
        }

        private createJustifiedButton(): ActionButton {
            return this.createAlignmentButton("icon-paragraph-justify");
        }

        private createLeftAlignedButton(): ActionButton {
            return this.createAlignmentButton("icon-paragraph-left");
        }

        private createCenteredButton(): ActionButton {
            return this.createAlignmentButton("icon-paragraph-center");
        }

        private createRightAlignedButton(): ActionButton {
            return this.createAlignmentButton("icon-paragraph-right");
        }

        private createAlignmentButton(iconClass: string): ActionButton {
            var action: Action = new Action("");

            action.setIconClass(iconClass);

            var button = new ActionButton(action);

            action.onExecuted(() => {
                this.resetActiveButton();
                button.addClass("active");
                this.image.getHTMLElement().style.textAlign = this.getImageAlignment();
                ResponsiveManager.fireResizeEvent();
            });

            return button;
        }

        private createKeepOriginalSizeCheckbox(): Checkbox {
            var keepOriginalSizeCheckbox = Checkbox.create().build();
            keepOriginalSizeCheckbox.addClass('keep-size-check');
            keepOriginalSizeCheckbox.onValueChanged(() => {
                this.imageLoadMask.show();
                this.rebuildImgSrcParams();
                this.rebuildImgDataSrcParams();
                ResponsiveManager.fireResizeEvent();
            });
            keepOriginalSizeCheckbox.setLabel('Keep original size');

            return keepOriginalSizeCheckbox;
        }

        private createImageCroppingSelector(): ImageCroppingSelector {
            var imageCroppingSelector: ImageCroppingSelector = new ImageCroppingSelector();

            this.initSelectedCropping(imageCroppingSelector);

            imageCroppingSelector.onOptionSelected((event: OptionSelectedEvent<ImageCroppingOption>) => {
                this.imageLoadMask.show();
                this.rebuildImgSrcParams();
                this.rebuildImgDataSrcParams();
                ResponsiveManager.fireResizeEvent();
            });

            return imageCroppingSelector;
        }

        private initSelectedCropping(imageCroppingSelector: ImageCroppingSelector) {
            var imgSrc: string = this.image.getEl().getAttribute("src");
            var scalingApplied: boolean = imgSrc.indexOf("scale=") > 0;
            if (scalingApplied) {
                var scaleParamValue = UriHelper.decodeUrlParams(imgSrc.replace("&amp;", "&"))["scale"];
                var scaleOption = ImageCroppingOptions.getOptionByProportion(scaleParamValue);
                if (!!scaleOption) {
                    imageCroppingSelector.selectOption(imageCroppingSelector.getOptionByValue(scaleOption.getName()));
                }
            }
        }

        private initActiveButton() {
            var alignment = this.image.getHTMLElement().style.textAlign;

            switch (alignment) {
            case 'justify':
                this.justifyButton.addClass("active");
                break;
            case 'left':
                this.alignLeftButton.addClass("active");
                break;
            case 'center':
                this.centerButton.addClass("active");
                break;
            case 'right':
                this.alignRightButton.addClass("active");
                break;
            default:
                this.justifyButton.addClass("active");
                break;
            }
        }

        private resetActiveButton() {
            this.justifyButton.removeClass("active");
            this.alignLeftButton.removeClass("active");
            this.centerButton.removeClass("active");
            this.alignRightButton.removeClass("active");
        }

        private initKeepSizeCheckbox() {
            this.keepOriginalSizeCheckbox.setChecked(this.image.getEl().getAttribute("data-src").indexOf("keepSize=true") > 0);
        }

        private getImageAlignment(): string {
            if (this.justifyButton.hasClass("active")) {
                return "justify";
            }

            if (this.alignLeftButton.hasClass("active")) {
                return "left";
            }

            if (this.centerButton.hasClass("active")) {
                return "center";
            }

            if (this.alignRightButton.hasClass("active")) {
                return "right";
            }

            return "justify";
        }

        private rebuildImgSrcParams() {
            var imgSrc = this.image.getEl().getAttribute("src"),
                newSrc = UriHelper.trimUrlParams(imgSrc),
                isCroppingSelected: boolean = !!this.imageCroppingSelector.getSelectedOption(),
                keepOriginalSizeChecked: boolean = this.keepOriginalSizeCheckbox.isChecked();

            if (isCroppingSelected) {
                var imageCroppingOption: ImageCroppingOption = this.imageCroppingSelector.getSelectedOption().displayValue;
                newSrc = newSrc + "?scale=" + imageCroppingOption.getProportionString() +
                         (keepOriginalSizeChecked ? "" : "&size=640");
            }
            else {
                newSrc = newSrc + (keepOriginalSizeChecked ? "?scaleWidth=true" : "?size=640&scaleWidth=true");
            }

            this.image.getEl().setAttribute("src", newSrc);
        }

        private rebuildImgDataSrcParams() {
            var dataSrc = this.image.getEl().getAttribute("data-src"),
                newDataSrc = UriHelper.trimUrlParams(dataSrc),
                isCroppingSelected: boolean = !!this.imageCroppingSelector.getSelectedOption(),
                keepOriginalSizeChecked: boolean = this.keepOriginalSizeCheckbox.isChecked();

            if (isCroppingSelected) {
                var imageCroppingOption: ImageCroppingOption = this.imageCroppingSelector.getSelectedOption().displayValue;
                newDataSrc = newDataSrc + "?scale=" + imageCroppingOption.getProportionString() +
                             (keepOriginalSizeChecked ? "&keepSize=true" : "&size=640");
            }
            else {
                newDataSrc = newDataSrc + (keepOriginalSizeChecked ? "?keepSize=true" : "");
            }

            this.image.getEl().setAttribute("data-src", newDataSrc);
        }

        onCroppingChanged(listener: (event: OptionSelectedEvent<ImageCroppingOption>) => void) {
            this.imageCroppingSelector.onOptionSelected(listener);
        }

    }

    export class ImagePreviewScrollHandler {

        private imagePreviewContainer: DivEl;

        private scrollDownButton: Element;
        private scrollUpButton: Element;
        private scrollBarWidth: number;
        private scrollBarRemoveTimeoutId: number;
        private scrolling;

        constructor(imagePreviewContainer: DivEl) {
            this.imagePreviewContainer = imagePreviewContainer;

            this.initializeImageScrollNavigation();

            this.imagePreviewContainer.onScroll(() => {
                this.toggleScrollButtons();
                this.showScrollBar();
                this.removeScrollBarOnTimeout();
            });
        }

        private initializeImageScrollNavigation() {
            this.scrollDownButton = this.createScrollButton("down");
            this.scrollUpButton = this.createScrollButton("up");
            this.initScrollbarWidth();
        }

        private isScrolledToTop(): boolean {
            var element = this.imagePreviewContainer.getHTMLElement();
            return element.scrollTop === 0;
        }

        private isScrolledToBottom(): boolean {
            var element = this.imagePreviewContainer.getHTMLElement();
            return (element.scrollHeight - element.scrollTop) === element.clientHeight;
        }

        private createScrollButton(direction: string): Element {
            var scrollAreaDiv = new DivEl(direction === "up" ? "scroll-up-div" : "scroll-down-div"),
                imageEl = new ImgEl(UriHelper.getAdminUri("common/images/icons/512x512/arrow_" + direction + ".png")),
                scrollTop = (direction === "up" ? "-=50" : "+=50");

            scrollAreaDiv.appendChild(imageEl);

            imageEl.onClicked((event) => {
                event.preventDefault();
                wemjq(this.imagePreviewContainer.getHTMLElement()).animate({scrollTop: scrollTop}, 400);
            });

            imageEl.onMouseOver(() => {
                this.scrolling = true;
                this.scrollImagePreview(direction);
            });

            imageEl.onMouseOut(() => {
                this.scrolling = false;
            });

            direction === "up"
                ? wemjq(scrollAreaDiv.getHTMLElement()).insertBefore(this.imagePreviewContainer.getHTMLElement().parentElement)
                : wemjq(scrollAreaDiv.getHTMLElement()).insertAfter(this.imagePreviewContainer.getHTMLElement().parentElement);

            scrollAreaDiv.hide();

            return scrollAreaDiv;
        }

        private initScrollbarWidth() {
            var outer = document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

            document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            // force scrollbars
            outer.style.overflow = "scroll";

            // add innerdiv
            var inner = document.createElement("div");
            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            // remove divs
            outer.parentNode.removeChild(outer);

            this.scrollBarWidth = widthNoScroll - widthWithScroll;
        }

        private scrollImagePreview(direction, scrollBy: number = 2) {
            var scrollByPx = (direction === "up" ? "-=" : "+=") + Math.round(scrollBy) + "px";
            var delta = 0.05;
            wemjq(this.imagePreviewContainer.getHTMLElement()).animate({scrollTop: scrollByPx}, 1, () => {
                if (this.scrolling) {
                    // If we want to keep scrolling, call the scrollContent function again:
                    this.scrollImagePreview(direction, scrollBy + delta);   // Increase scroll height by delta on each iteration
                                                                            // to emulate scrolling speed up effect
                }
            });
        }

        setMarginRight() {
            this.imagePreviewContainer.getEl().setMarginRight("");
            if (this.scrollDownButton.isVisible() || this.scrollUpButton.isVisible()) {
                this.imagePreviewContainer.getEl().setMarginRight("-" + this.scrollBarWidth + "px");
            }
        }

        toggleScrollButtons() {
            if (this.isScrolledToBottom()) {
                this.scrollDownButton.hide();
            }
            else {
                this.scrollDownButton.show();
            }

            if (this.isScrolledToTop()) {
                this.scrollUpButton.hide();
            }
            else {
                this.scrollUpButton.show();
            }
        }

        resetScrollPosition() {
            this.imagePreviewContainer.getEl().setScrollTop(0);
        }

        private showScrollBar() {
            this.imagePreviewContainer.getHTMLElement().parentElement.style.marginRight = "-" + this.scrollBarWidth + "px";
            this.imagePreviewContainer.getEl().setMarginRight("");
            this.imagePreviewContainer.getHTMLElement().style.overflowY = "auto";
        }

        private removeScrollBarOnTimeout() {
            if (!!this.scrollBarRemoveTimeoutId) {
                window.clearTimeout(this.scrollBarRemoveTimeoutId);
            }

            this.scrollBarRemoveTimeoutId = window.setTimeout(() => {
                this.imagePreviewContainer.getHTMLElement().parentElement.style.marginRight = "";
                this.imagePreviewContainer.getEl().setMarginRight("-" + this.scrollBarWidth + "px");
                this.imagePreviewContainer.getHTMLElement().style.overflowY = "auto";
            }, 500);
        }
    }
