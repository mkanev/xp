import {LoadMask} from "../../../../ui/mask/LoadMask";
import {BaseSelectedOptionView} from "../../../../ui/selector/combobox/BaseSelectedOptionView";
import {ImgEl} from "../../../../dom/ImgEl";
import {DivEl} from "../../../../dom/DivEl";
import {Checkbox} from "../../../../ui/Checkbox";
import {ProgressBar} from "../../../../ui/ProgressBar";
import {Option} from "../../../../ui/selector/Option";
import {Element} from "../../../../dom/Element";
import {ValueChangedEvent} from "../../../../ValueChangedEvent";
import {ImageSelectorDisplayValue} from "./ImageSelectorDisplayValue";

export class ImageSelectorSelectedOptionView extends BaseSelectedOptionView<ImageSelectorDisplayValue> {

        private static IMAGE_SIZE: number = 270;

        private icon: ImgEl;

        private label: DivEl;

        private check: Checkbox;

        private progress: ProgressBar;

        private error: DivEl;

        private loadMask: LoadMask;

        private selectionChangeListeners: {(option: ImageSelectorSelectedOptionView, checked: boolean): void;}[] = [];

        constructor(option: Option<ImageSelectorDisplayValue>) {
            super(option);
        }

        setOption(option: Option<ImageSelectorDisplayValue>) {
            super.setOption(option);

            var content: ImageSelectorDisplayValue = this.getOption().displayValue;

            if (content.getContentSummary()) {
                this.updateIconSrc(content);
                this.label.getEl().setInnerHtml(content.getLabel());
            } else {
                this.showProgress();
            }
        }

        private updateIconSrc(content: ImageSelectorDisplayValue) {
            var newIconSrc = content.getImageUrl() + "?thumbnail=false&size=" + ImageSelectorSelectedOptionView.IMAGE_SIZE;

            if (this.icon.getSrc().indexOf(newIconSrc) == -1) {
                if (this.isVisible()) {
                    this.showSpinner();
                }
                this.icon.setSrc(newIconSrc);
            }
        }

        setProgress(value: number) {
            this.progress.setValue(value);
            if (value == 100) {
                this.showSpinner();
            }
        }

        doRender(): wemQ.Promise<boolean> {

            this.icon = new ImgEl();
            this.label = new DivEl("label");
            this.check = Checkbox.create().build();
            this.progress = new ProgressBar();
            this.error = new DivEl("error");
            this.loadMask = new LoadMask(this);

            var squaredContent = new DivEl('squared-content');
            squaredContent.appendChildren<Element>(this.icon, this.label, this.check, this.progress, this.error, this.loadMask);

            this.appendChild(squaredContent);

            this.check.onClicked((event: MouseEvent) => {
                this.check.toggleChecked();
                event.preventDefault();
                // swallow event to prevent scaling when clicked on checkbox
                event.stopPropagation();
            });

            this.check.onMouseDown((event: MouseEvent) => {
                // swallow event and prevent checkbox focus on click
                event.stopPropagation();
                event.preventDefault();
            });

            this.check.onValueChanged((event: ValueChangedEvent) => {
                this.notifyChecked(event.getNewValue() == 'true');
            });

            this.onShown(() => {
                if (this.getOption().displayValue.getContentSummary()) {
                    if (!this.icon.isLoaded()) {
                        this.showSpinner();
                    }
                }
            });
            this.icon.onLoaded((event: UIEvent) => {
                if (this.getOption().displayValue.getContentSummary()) {
                    this.showResult();
                }
            });

            return wemQ(true);
        }

        private showProgress() {
            this.check.hide();
            this.icon.getEl().setVisibility('hidden');
            this.loadMask.hide();
            this.progress.show();
        }

        private showSpinner() {
            this.progress.hide();
            this.check.hide();
            this.icon.getEl().setVisibility('hidden');
            this.loadMask.show();
        }

        private showResult() {
            this.loadMask.hide();
            this.icon.getEl().setVisibility('visible');
            this.check.show();
            this.progress.hide();
        }

        showError(text: string) {
            this.progress.hide();
            this.error.setHtml(text).show();
            this.check.show();
        }

        updateProportions() {
            var contentHeight = this.getEl().getHeightWithBorder() -
                                this.getEl().getBorderTopWidth() -
                                this.getEl().getBorderBottomWidth();

            this.centerVertically(this.icon, contentHeight);
            this.centerVertically(this.progress, contentHeight);
            this.centerVertically(this.error, contentHeight);
        }

        private centerVertically(el: Element, contentHeight: number) {
            el.getEl().setMarginTop(Math.max(0, (contentHeight - el.getEl().getHeight()) / 2) + 'px');
        }

        getIcon(): ImgEl {
            return this.icon;
        }

        getCheckbox(): Checkbox {
            return this.check;
        }

        toggleChecked() {
            this.check.toggleChecked();
        }

        private notifyChecked(checked: boolean) {
            this.selectionChangeListeners.forEach((listener) => {
                listener(this, checked);
            });
        }

        onChecked(listener: {(option: ImageSelectorSelectedOptionView, checked: boolean): void;}) {
            this.selectionChangeListeners.push(listener);
        }

        unChecked(listener: {(option: ImageSelectorSelectedOptionView, checked: boolean): void;}) {
            this.selectionChangeListeners = this.selectionChangeListeners.filter(function (curr) {
                return curr != listener;
            });
        }

    }
