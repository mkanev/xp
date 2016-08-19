import {PropertyTree} from "../../../../data/PropertyTree";
import {PropertySet} from "../../../../data/PropertySet";
import {Option} from "../../../../ui/selector/Option";
import {FormView} from "../../../../form/FormView";
import {FormContextBuilder} from "../../../../form/FormContext";
import {Application} from "../../../../application/Application";
import {ApplicationKey} from "../../../../application/ApplicationKey";
import {SiteConfig} from "../../SiteConfig";
import {LoadedDataEvent} from "../../../../util/loader/event/LoadedDataEvent";
import {ContentFormContext} from "../../../form/ContentFormContext";
import {BaseSelectedOptionView} from "../../../../ui/selector/combobox/BaseSelectedOptionView";
import {FormValidityChangedEvent} from "../../../../form/FormValidityChangedEvent";
import {DivEl} from "../../../../dom/DivEl";
import {NamesAndIconView} from "../../../../app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../../../../app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../app/NamesAndIconViewSize";
import {AEl} from "../../../../dom/AEl";
import {ContentRequiresSaveEvent} from "../../../event/ContentRequiresSaveEvent";
import {SiteConfiguratorComboBox} from "./SiteConfiguratorComboBox";
import {SiteConfiguratorDialog} from "./SiteConfiguratorDialog";

export class SiteConfiguratorSelectedOptionView extends BaseSelectedOptionView<Application> {

        private application: Application;

        private formView: FormView;

        private siteConfig: SiteConfig;

        private editClickedListeners: {(event: MouseEvent): void;}[];

        private siteConfigFormDisplayedListeners: {(applicationKey: ApplicationKey): void}[];

        private formContext: ContentFormContext;

        private formValidityChangedHandler: {(event: FormValidityChangedEvent): void};

        constructor(option: Option<Application>, siteConfig: SiteConfig, formContext: ContentFormContext) {
            this.editClickedListeners = [];
            this.siteConfigFormDisplayedListeners = [];

            this.application = option.displayValue;
            this.siteConfig = siteConfig;
            this.formContext = formContext;

            super(option);
        }

        doRender(): wemQ.Promise<boolean> {

            var header = new DivEl('header');

            var namesAndIconView = new NamesAndIconView(new NamesAndIconViewBuilder().setSize(
                NamesAndIconViewSize.small)).setMainName(this.application.getDisplayName()).setSubName(
                this.application.getName() + "-" + this.application.getVersion()).setIconClass("icon-xlarge icon-puzzle");
            
            if (this.application.getIconUrl()) {
                namesAndIconView.setIconUrl(this.application.getIconUrl());
            }

            if (this.application.getDescription()) {
                namesAndIconView.setSubName(this.application.getDescription());
            }

            header.appendChild(namesAndIconView);

            this.appendChild(header);

            this.formValidityChangedHandler = (event: FormValidityChangedEvent) => {
                this.toggleClass("invalid", !event.isValid())
            };

            this.formView = this.createFormView(this.siteConfig);
            this.formView.layout();

            if (this.application.getForm().getFormItems().length > 0) {
                header.appendChild(this.createEditButton());
            }

            var removeButton = new AEl("remove-button icon-close");
            removeButton.onClicked((event: MouseEvent) => {
                this.notifyRemoveClicked();
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            header.appendChild(removeButton);

            return wemQ(true);
        }

        setSiteConfig(siteConfig: SiteConfig) {
            this.siteConfig = siteConfig;
        }

        private createEditButton(): AEl {
            var editButton = new AEl('edit-button');

            editButton.onClicked((event: MouseEvent) => {
                this.notifyEditClicked(event);
                this.initAndOpenConfigureDialog();
                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            return editButton;
        }

        initAndOpenConfigureDialog(comboBoxToUndoSelectionOnCancel?: SiteConfiguratorComboBox) {

            if (this.application.getForm().getFormItems().length > 0) {

                var tempSiteConfig: SiteConfig = this.makeTemporarySiteConfig();

                var formViewStateOnDialogOpen = this.formView;
                this.unbindValidationEvent(formViewStateOnDialogOpen);

                this.formView = this.createFormView(tempSiteConfig);
                this.bindValidationEvent(this.formView);

                var okCallback = () => {
                    if (!tempSiteConfig.equals(this.siteConfig)) {
                        this.applyTemporaryConfig(tempSiteConfig);
                        new ContentRequiresSaveEvent(this.formContext.getPersistedContent().getContentId()).fire();
                    }
                };

                var cancelCallback = () => {
                    this.revertFormViewToGivenState(formViewStateOnDialogOpen);
                    if (comboBoxToUndoSelectionOnCancel) {
                        this.undoSelectionOnCancel(comboBoxToUndoSelectionOnCancel);
                    }
                };

                var siteConfiguratorDialog = new SiteConfiguratorDialog(this.application,
                    this.formView,
                    okCallback,
                    cancelCallback);

                siteConfiguratorDialog.open();
            }
        }

        private revertFormViewToGivenState(formViewStateToRevertTo: FormView) {
            this.unbindValidationEvent(this.formView);
            this.formView = formViewStateToRevertTo;
            this.formView.validate(false, true);
            this.toggleClass("invalid", !this.formView.isValid())
        }

        private undoSelectionOnCancel(comboBoxToUndoSelectionOnCancel: SiteConfiguratorComboBox) {
            comboBoxToUndoSelectionOnCancel.deselect(this.application);
        }

        private applyTemporaryConfig(tempSiteConfig: SiteConfig) {
            tempSiteConfig.getConfig().forEach((property) => {
                this.siteConfig.getConfig().setProperty(property.getName(), property.getIndex(), property.getValue());
            });
            this.siteConfig.getConfig().forEach((property) => {
                var prop = tempSiteConfig.getConfig().getProperty(property.getName(), property.getIndex());
                if (!prop) {
                    this.siteConfig.getConfig().removeProperty(property.getName(), property.getIndex());
                }
            });
        }

        private makeTemporarySiteConfig(): SiteConfig {
            var propSet = (new PropertyTree(this.siteConfig.getConfig())).getRoot();
            propSet.setContainerProperty(this.siteConfig.getConfig().getProperty());
            return SiteConfig.create().setConfig(propSet).setApplicationKey(this.siteConfig.getApplicationKey()).build();
        }

        private createFormView(siteConfig: SiteConfig): FormView {
            var formView = new FormView(this.formContext, this.application.getForm(), siteConfig.getConfig());
            formView.addClass("site-form");

            formView.onLayoutFinished(() => {
                formView.validate(false, true);
                this.toggleClass("invalid", !formView.isValid());
                this.notifySiteConfigFormDisplayed(this.application.getApplicationKey());
            });

            return formView;
        }

        private bindValidationEvent(formView: FormView) {
            if (formView) {
                formView.onValidityChanged(this.formValidityChangedHandler);
            }
        }

        private unbindValidationEvent(formView: FormView) {
            if (formView) {
                formView.unValidityChanged(this.formValidityChangedHandler);
            }
        }

        getApplication(): Application {
            return this.application;
        }

        getSiteConfig(): SiteConfig {
            return this.siteConfig;
        }

        getFormView(): FormView {
            return this.formView;
        }

        onEditClicked(listener: (event: MouseEvent) => void) {
            this.editClickedListeners.push(listener);
        }

        unEditClicked(listener: (event: MouseEvent) => void) {
            this.editClickedListeners = this.editClickedListeners.filter((curr) => {
                return listener != curr;
            })
        }

        private notifyEditClicked(event: MouseEvent) {
            this.editClickedListeners.forEach((listener) => {
                listener(event);
            })
        }

        onSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey): void;}) {
            this.siteConfigFormDisplayedListeners.push(listener);
        }

        unSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey): void;}) {
            this.siteConfigFormDisplayedListeners =
                this.siteConfigFormDisplayedListeners.filter((curr) => (curr != listener));
        }

        private notifySiteConfigFormDisplayed(applicationKey: ApplicationKey) {
            this.siteConfigFormDisplayedListeners.forEach((listener) => listener(applicationKey));
        }
    }
