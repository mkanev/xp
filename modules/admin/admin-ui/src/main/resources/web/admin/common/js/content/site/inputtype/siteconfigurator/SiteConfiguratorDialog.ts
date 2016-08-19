import {SelectionItem} from "../../../../app/browse/SelectionItem";
import {ContentSummary} from "../../../ContentSummary";
import {DialogButton} from "../../../../ui/dialog/DialogButton";
import {DivEl} from "../../../../dom/DivEl";
import {FormView} from "../../../../form/FormView";
import {ModalDialogHeader} from "../../../../ui/dialog/ModalDialog";
import {InputView} from "../../../../form/InputView";
import {ContentSelector} from "../../../form/inputtype/contentselector/ContentSelector";
import {PrincipalSelector} from "../../../form/inputtype/principalselector/PrincipalSelector";
import {ImageSelector} from "../../../form/inputtype/image/ImageSelector";
import {ComboBox} from "../../../../ui/selector/combobox/ComboBox";
import {CreateHtmlAreaDialogEvent} from "../../../../util/htmlarea/dialog/CreateHtmlAreaDialogEvent";
import {Application} from "../../../../application/Application";
import {ModalDialog} from "../../../../ui/dialog/ModalDialog";
import {HTMLAreaDialogHandler} from "../../../../util/htmlarea/dialog/HTMLAreaDialogHandler";
import {Action} from "../../../../ui/Action";
import {NamesAndIconView} from "../../../../app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../app/NamesAndIconViewSize";
import {Element} from "../../../../dom/Element";
import {ObjectHelper} from "../../../../ObjectHelper";
import {FieldSetView} from "../../../../form/FieldSetView";
import {FormItemView} from "../../../../form/FormItemView";
import {DropdownExpandedEvent} from "../../../../ui/selector/DropdownExpandedEvent";
import {ElementHelper} from "../../../../dom/ElementHelper";
import {ComboBox} from "../../../../form/inputtype/combobox/ComboBox";
import {Body} from "../../../../dom/Body";

export class SiteConfiguratorDialog extends ModalDialog {

        public static debug: boolean = false;

        private formView: FormView;

        private okCallback: () => void;

        private cancelCallback: () => void;

        constructor(application:Application, formView:FormView, okCallback?:() => void, cancelCallback?:() => void) {
            super({
                title: this.initHeader(application)
            });

            this.formView = formView;
            this.okCallback = okCallback;
            this.cancelCallback = cancelCallback;

            this.addClass("site-configurator-dialog");

            CreateHtmlAreaDialogEvent.on((event: CreateHtmlAreaDialogEvent) => {
                this.addClass("masked");

                HTMLAreaDialogHandler.getOpenDialog().onRemoved(() => {
                    this.removeClass("masked");
                })
            });
        }

        doRender(): Q.Promise<boolean> {
            return super.doRender().then((rendered) => {
                if (SiteConfiguratorDialog.debug) {
                    console.debug("SiteConfiguratorDialog.doRender");
                }

                this.appendChildToContentPanel(this.formView);

                wemjq(this.getHTMLElement()).find('input[type=text],textarea,select').first().focus();
                this.updateTabbable();

                this.addOkButton(this.okCallback);
                this.getCancelAction().onExecuted(() => this.cancelCallback());

                this.addCancelButtonToBottom();

                return this.formView.layout().then(() => {
                    this.addClass("animated");
                    this.centerMyself();

                    this.handleSelectorsDropdowns(this.formView);
                    this.handleDialogClose(this.formView);

                    return rendered;
                });
            });
        }

        private addOkButton(okCallback: () => void) {
            var okAction = new Action("Apply");
            this.addAction(okAction, true, true);
            okAction.onExecuted(() => {
                if (okCallback) {
                    okCallback();
                }
                this.close();
            });
        }

        private initHeader(application:Application):ModalDialogHeader {
            var dialogHeader = new ModalDialogHeader("");

            var namesAndIconView = new NamesAndIconView(new NamesAndIconViewBuilder().setSize(
                NamesAndIconViewSize.large)).setMainName(application.getDisplayName()).setSubName(application.getName() + "-" + application.getVersion()).setIconClass("icon-xlarge icon-puzzle");

            if (application.getIconUrl()) {
                namesAndIconView.setIconUrl(application.getIconUrl());
            }

            if (application.getDescription()) {
                namesAndIconView.setSubName(application.getDescription());
            }
            
            dialogHeader.appendChild(namesAndIconView);
            return dialogHeader;
        }

        private handleSelectorsDropdowns(formView: FormView) {
            var comboboxArray = [];
            formView.getChildren().forEach((element: Element) => {
                this.findItemViewsAndSubscribe(element, comboboxArray);
            });
            this.getContentPanel().onScroll((event) => {
                comboboxArray.forEach((comboBox: ComboBox<any>) => {
                    comboBox.hideDropdown();
                });
            });
        }

        private handleDialogClose(formView: FormView) {
            let imageSelector;
            formView.getChildren().forEach((element: Element) => {
                if (ObjectHelper.iFrameSafeInstanceOf(element, InputView)) {
                    imageSelector = (<InputView> element).getInputTypeView().getElement();
                    if (ObjectHelper.iFrameSafeInstanceOf(imageSelector, ImageSelector)) {
                        (<ImageSelector> imageSelector).onEditContentRequest(this.close.bind(this));
                    }
                }
            });
        }

        private findItemViewsAndSubscribe(element: Element, comboboxArray: ComboBox<any>[]) {
            if (ObjectHelper.iFrameSafeInstanceOf(element, InputView)) {
                this.checkItemViewAndSubscribe(<InputView> element, comboboxArray);
            } else if (ObjectHelper.iFrameSafeInstanceOf(element, FieldSetView)) {
                var fieldSetView: FieldSetView = <FieldSetView> element;
                fieldSetView.getFormItemViews().forEach((formItemView: FormItemView) => {
                    this.findItemViewsAndSubscribe(formItemView, comboboxArray);
                });
            }
        }

        private checkItemViewAndSubscribe(itemView: FormItemView, comboboxArray: ComboBox<any>[]) {
            var inputView: InputView = <InputView> itemView;
            if (this.isContentOrImageOrPrincipalOrComboSelectorInput(inputView)) {
                var combobox = this.getComboboxFromSelectorInputView(inputView);
                if (!!combobox) {
                    comboboxArray.push(combobox);
                }
                this.subscribeCombobox(combobox);
            }
        }

        private subscribeCombobox(comboBox: ComboBox<any>) {
            if (!!comboBox) {
                comboBox.onExpanded((event: DropdownExpandedEvent) => {
                    if (event.isExpanded()) {
                        this.adjustSelectorDropDown(comboBox.getInput(), event.getDropdownElement().getEl());
                    }
                });
            }
        }

        private adjustSelectorDropDown(inputElement: Element, dropDownElement: ElementHelper) {
            var inputPosition = wemjq(inputElement.getHTMLElement()).offset();

            dropDownElement.setMaxWidthPx(inputElement.getEl().getWidthWithBorder() - 2);
            dropDownElement.setTopPx(inputPosition.top + inputElement.getEl().getHeightWithBorder() - 1);
            dropDownElement.setLeftPx(inputPosition.left);
        }

        private getComboboxFromSelectorInputView(inputView: InputView): ComboBox<any> {
            var contentComboBox,
                inputTypeView = inputView.getInputTypeView();
            if (ObjectHelper.iFrameSafeInstanceOf(inputTypeView, ContentSelector)) {
                contentComboBox = (<ContentSelector> inputTypeView).getContentComboBox();
            } else if (ObjectHelper.iFrameSafeInstanceOf(inputTypeView, ImageSelector)) {
                contentComboBox = (<ImageSelector> inputTypeView).getContentComboBox();
            } else if (ObjectHelper.iFrameSafeInstanceOf(inputTypeView, PrincipalSelector)) {
                contentComboBox = (<PrincipalSelector> inputTypeView).getPrincipalComboBox();
            } else {
                return (<ComboBox> inputTypeView).getComboBox();
            }
            return !!contentComboBox ? contentComboBox.getComboBox() : null;
        }

        private isContentOrImageOrPrincipalOrComboSelectorInput(inputView: InputView): boolean {
            return !!inputView &&
                   (ObjectHelper.iFrameSafeInstanceOf(inputView.getInputTypeView(), ContentSelector) ||
                    ObjectHelper.iFrameSafeInstanceOf(inputView.getInputTypeView(), ImageSelector) ||
                    ObjectHelper.iFrameSafeInstanceOf(inputView.getInputTypeView(), PrincipalSelector) ||
                    ObjectHelper.iFrameSafeInstanceOf(inputView.getInputTypeView(), ComboBox));
        }


        show() {
            Body.get().appendChild(this);
            super.show();
        }

        close() {
            super.close();
            this.remove();
        }
    }
