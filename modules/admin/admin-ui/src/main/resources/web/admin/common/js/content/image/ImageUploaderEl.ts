import {Button} from "../../ui/button/Button";
import {CloseButton} from "../../ui/button/CloseButton";
import {Point} from "../../ui/image/ImageEditor";
import {Rect} from "../../ui/image/ImageEditor";
import {ImageEditor} from "../../ui/image/ImageEditor";
import {MediaUploaderEl} from "../../ui/uploader/MediaUploaderEl";
import {MediaUploaderElConfig} from "../../ui/uploader/MediaUploaderEl";
import {Body} from "../../dom/Body";
import {Content} from "../Content";
import {ValueTypes} from "../../data/ValueTypes";
import {ContentId} from "../ContentId";
import {ContentImageUrlResolver} from "../util/ContentImageUrlResolver";
import {MaskContentWizardPanelEvent} from "../../app/wizard/MaskContentWizardPanelEvent";
import {showError} from "../../notify/MessageBus";
import {Element} from "../../dom/Element";
import {DivEl} from "../../dom/DivEl";
import {ExtraData} from "../ExtraData";
import {ImageErrorEvent} from "./ImageErrorEvent";

export class ImageUploaderEl extends MediaUploaderEl {

        private imageEditors: ImageEditor[];
        private editModeListeners: {(edit: boolean, crop: Rect, zoom: Rect, focus: Point): void}[];
        private focusAutoPositionedListeners: {(auto: boolean): void}[];
        private cropAutoPositionedListeners: {(auto: boolean): void}[];

        private initialWidth: number;
        private originalHeight: number;
        private originalWidth: number;

        private static SELECTED_CLASS = 'selected';
        private static STANDOUT_CLASS = 'standout';

        constructor(config: MediaUploaderElConfig) {
            if (config.allowTypes == undefined) {
                config.allowTypes = [
                    {title: 'Image files', extensions: 'jpg,jpeg,gif,png,svg'}
                ];
            }
            if (config.selfIsDropzone == undefined) {
                config.selfIsDropzone = true;
            }

            super(config);

            this.imageEditors = [];
            this.editModeListeners = [];
            this.focusAutoPositionedListeners = [];
            this.cropAutoPositionedListeners = [];

            this.addClass('image-uploader-el');

            this.initialWidth = 0;
            this.onShown(() => {

                if (this.getEl().getWidth() == 0) {
                    this.initialWidth = Math.max(this.getParentElement().getEl().getWidth(), this.initialWidth);
                    this.getEl().setMaxWidthPx(this.initialWidth);
                }
            });

            this.onUploadStarted(() => {
                this.imageEditors.forEach((imageEditor: ImageEditor) => {
                    imageEditor.remove();
                });
                this.imageEditors = [];
            });

            this.onFocus(() => {
                setTimeout(() => {
                    if (this.imageEditors.length && !this.imageEditors[0].hasClass(ImageUploaderEl.SELECTED_CLASS)) {
                        this.toggleSelected(this.imageEditors[0]);
                    }
                }, 150);
            });

            this.onBlur((event: FocusEvent) => {
                this.imageEditors.forEach((imageEditor: ImageEditor) => {
                    if (event.relatedTarget && !imageEditor.isElementInsideButtonsContainer(<HTMLElement>event.relatedTarget)) {
                        this.toggleSelected(imageEditor);
                    }
                });
            });

            this.onClicked((event: MouseEvent) => {
                this.imageEditors.forEach((imageEditor: ImageEditor) => {
                    if (event.target && !imageEditor.isElementInsideButtonsContainer(<HTMLElement>event.target)) {
                        this.toggleSelected(imageEditor);
                    }
                });
            });

            Body.get().onClicked((event: MouseEvent) => {
                this.imageEditors.forEach((imageEditor: ImageEditor) => {
                    if (imageEditor.hasClass(ImageUploaderEl.SELECTED_CLASS) && imageEditor.getImage().getHTMLElement() !== event.target) {
                        imageEditor.removeClass(ImageUploaderEl.SELECTED_CLASS);
                    }
                });
            });
        }

        private getSizeValue(content: Content, propertyName: string): number {
            var value = 0,
                metaData = content.getContentData().getProperty('metadata');

            if (metaData && ValueTypes.DATA.equals(metaData.getType())) {
                value = parseInt(metaData.getPropertySet().getProperty(propertyName).getString());
            }
            else {
                var allExtraData = content.getAllExtraData();
                allExtraData.forEach((extraData: ExtraData) => {
                    if (!value && extraData.getData().getProperty(propertyName)) {
                        value = parseInt(extraData.getData().getProperty(propertyName).getValue().getString());
                    }
                });
            }

            return value;
        }

        setOriginalDimensions(content: Content) {
            this.originalWidth = this.getSizeValue(content, "imageWidth") || this.initialWidth;
            this.originalHeight = this.getSizeValue(content, "imageHeight");
        }

        private getProportionalHeight(): number {
            if (!this.originalHeight || !this.originalWidth) {
                return 0;
            }
            return Math.round(this.initialWidth * this.originalHeight / this.originalWidth);
        }

        private togglePlaceholder(flag: boolean) {
            var resultEl = this.getResultContainer().toggleClass('placeholder', flag).getEl();
            if (flag) {
                resultEl.setHeightPx(resultEl.getHeight() || this.getProportionalHeight());
            } else {
                resultEl.setHeight('auto');
            }
        }

        private createImageEditor(value: string): ImageEditor {

            var contentId = new ContentId(value),
                imgUrl = this.resolveImageUrl(value);

            this.togglePlaceholder(true);

            var imageEditor = new ImageEditor();
            this.subscribeImageEditorOnEvents(imageEditor, contentId);
            imageEditor.setSrc(imgUrl);

            return imageEditor;
        }

        private resolveImageUrl(value: string): string {
            return new ContentImageUrlResolver().
                setContentId(new ContentId(value)).
                setTimestamp(new Date()).
                setSource(true).
                resolve();
        }

        private subscribeImageEditorOnEvents(imageEditor: ImageEditor, contentId: ContentId) {
            var focusAutoPositionedChangedHandler = (auto: boolean) => this.notifyFocusAutoPositionedChanged(auto);
            var cropAutoPositionedChangedHandler = (auto: boolean) => this.notifyCropAutoPositionedChanged(auto);
            var editModeChangedHandler = (edit: boolean, position: Rect, zoom: Rect, focus: Point) => {
                this.notifyEditModeChanged(edit, position, zoom, focus);
                this.togglePlaceholder(edit);

                var index = -1;

                if (edit) {
                    index = imageEditor.getSiblingIndex();
                    Body.get().appendChild(imageEditor.addClass(ImageUploaderEl.STANDOUT_CLASS));
                    this.positionImageEditor(imageEditor);
                } else {
                    this.getResultContainer().insertChild(imageEditor.removeClass(ImageUploaderEl.STANDOUT_CLASS), index);
                }
            };
            var uploadButtonClickedHandler = () => {
                this.showFileSelectionDialog();
            };
            var getLastButtonInContainerBlurHandler = () => {
                this.toggleSelected(imageEditor);
            };
            var shaderVisibilityChangedHandler = (visible: boolean) => {
                new MaskContentWizardPanelEvent(contentId, visible).fire();
            };

            var imageErrorHandler = (event: UIEvent) => {
                new ImageErrorEvent(contentId).fire();
                this.imageEditors = this.imageEditors.filter((curr) => {
                    return curr !== imageEditor;
                })
                showError('Failed to upload an image ' + contentId.toString());
            };

            imageEditor.getImage().onLoaded((event: UIEvent) => {
                this.togglePlaceholder(false);
                imageEditor.onShaderVisibilityChanged(shaderVisibilityChangedHandler);
                imageEditor.onEditModeChanged(editModeChangedHandler);
                imageEditor.onFocusAutoPositionedChanged(focusAutoPositionedChangedHandler);
                imageEditor.onCropAutoPositionedChanged(cropAutoPositionedChangedHandler);
                imageEditor.getUploadButton().onClicked(uploadButtonClickedHandler);
                imageEditor.getLastButtonInContainer().onBlur(getLastButtonInContainerBlurHandler);
            });

            imageEditor.onImageError(imageErrorHandler);

            imageEditor.onRemoved(() => {
                imageEditor.unShaderVisibilityChanged(shaderVisibilityChangedHandler);
                imageEditor.unEditModeChanged(editModeChangedHandler);
                imageEditor.unFocusAutoPositionedChanged(focusAutoPositionedChangedHandler);
                imageEditor.unCropAutoPositionedChanged(cropAutoPositionedChangedHandler);
                imageEditor.getUploadButton().unClicked(uploadButtonClickedHandler);
                imageEditor.getLastButtonInContainer().unBlur(getLastButtonInContainerBlurHandler);
                imageEditor.unImageError(imageErrorHandler);
            });
        }

        private positionImageEditor(imageEditor: ImageEditor) {
            var resultOffset = this.getResultContainer().getEl().getOffset();

            imageEditor.getEl().setTopPx(resultOffset.top).
                setLeftPx(resultOffset.left);
        }

        protected getExistingItem(value: string): Element {
            return this.imageEditors.filter(elem => {
                return !!elem.getSrc() && elem.getSrc().indexOf(value) > -1;
            })[0];
        }

        protected refreshExistingItem(existingItem: Element, value: string) {
            for (var i = 0; i < this.imageEditors.length; i++) {
                var editor = this.imageEditors[i];
                if (existingItem == editor) {
                    editor.setSrc(this.resolveImageUrl(value));
                    break;
                }
            }
        }

        createResultItem(value: string): DivEl {

            if (!this.initialWidth) {
                this.initialWidth = this.getParentElement().getEl().getWidth();
            }

            var imageEditor = this.createImageEditor(value);

            this.imageEditors.push(imageEditor);

            return imageEditor;
        }

        private toggleSelected(imageEditor: ImageEditor) {
            imageEditor.toggleClass(ImageUploaderEl.SELECTED_CLASS);
        }

        setFocalPoint(x: number, y: number) {
            this.imageEditors.forEach((editor: ImageEditor) => {
                editor.setFocusPosition(x, y);
            })
        }

        setCrop(crop: Rect) {
            this.imageEditors.forEach((editor: ImageEditor) => {
                editor.setCropPosition(crop.x, crop.y, crop.x2, crop.y2);
            })
        }

        setZoom(zoom: Rect) {
            this.imageEditors.forEach((editor: ImageEditor) => {
                editor.setZoomPosition(zoom.x, zoom.y, zoom.x2, zoom.y2);
            })
        }

        isFocalPointEditMode(): boolean {
            return this.imageEditors.some((editor: ImageEditor) => {
                return editor.isFocusEditMode();
            });
        }

        isCropEditMode(): boolean {
            return this.imageEditors.some((editor: ImageEditor) => {
                return editor.isCropEditMode();
            })
        }

        onEditModeChanged(listener: (edit: boolean, crop: Rect, zoom: Rect, focus: Point) => void) {
            this.editModeListeners.push(listener);
        }

        unEditModeChanged(listener: (edit: boolean, crop: Rect, zoom: Rect, focus: Point) => void) {
            this.editModeListeners = this.editModeListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyEditModeChanged(edit: boolean, crop: Rect, zoom: Rect, focus: Point) {
            this.editModeListeners.forEach((listener) => {
                listener(edit, crop, zoom, focus);
            })
        }

        onCropAutoPositionedChanged(listener: (auto: boolean) => void) {
            this.cropAutoPositionedListeners.push(listener);
        }

        unCropAutoPositionedChanged(listener: (auto: boolean) => void) {
            this.cropAutoPositionedListeners = this.cropAutoPositionedListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyCropAutoPositionedChanged(auto: boolean) {
            this.cropAutoPositionedListeners.forEach((listener) => listener(auto));
        }

        onFocusAutoPositionedChanged(listener: (auto: boolean) => void) {
            this.focusAutoPositionedListeners.push(listener);
        }

        unFocusAutoPositionedChanged(listener: (auto: boolean) => void) {
            this.focusAutoPositionedListeners = this.focusAutoPositionedListeners.filter((curr) => {
                return curr !== listener;
            });
        }

        private notifyFocusAutoPositionedChanged(auto: boolean) {
            this.focusAutoPositionedListeners.forEach((listener) => listener(auto));
        }

    }
