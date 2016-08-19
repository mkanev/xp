import {Application} from "../../../../application/Application";
import {ApplicationKey} from "../../../../application/ApplicationKey";
import {FormView} from "../../../../form/FormView";
import {Option} from "../../../../ui/selector/Option";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {SelectedOptionView} from "../../../../ui/selector/combobox/SelectedOptionView";
import {BaseSelectedOptionsView} from "../../../../ui/selector/combobox/BaseSelectedOptionsView";
import {ContentFormContext} from "../../ContentFormContext";
import {AuthApplicationSelectedOptionView} from "./AuthApplicationSelectedOptionView";
import {SiteConfigProvider} from "../../../site/inputtype/siteconfigurator/SiteConfigProvider";

export class AuthApplicationSelectedOptionsView extends BaseSelectedOptionsView<Application> {

        private siteConfigProvider: SiteConfigProvider;

        private siteConfigFormDisplayedListeners: {(applicationKey: ApplicationKey, formView: FormView) : void}[] = [];

        private beforeOptionCreatedListeners: {():void}[] = [];

        private afterOptionCreatedListeners: {():void}[] = [];

        private formContext: ContentFormContext;

        private items: AuthApplicationSelectedOptionView[] = [];

        private readOnly: boolean;

        constructor(siteConfigProvider: SiteConfigProvider, formContext: ContentFormContext, readOnly: boolean) {
            super();
            this.readOnly = readOnly;
            this.siteConfigProvider = siteConfigProvider;
            this.formContext = formContext;

            this.siteConfigProvider.onPropertyChanged(() => {

                this.items.forEach((optionView) => {
                    let newConfig = this.siteConfigProvider.getConfig(optionView.getSiteConfig().getApplicationKey(), false);
                    if (newConfig) {
                        optionView.setSiteConfig(newConfig);
                    }
                });

            });

            this.setOccurrencesSortable(true);
        }

        createSelectedOption(option: Option<Application>): SelectedOption<Application> {
            this.notifyBeforeOptionCreated();

            let siteConfig = this.siteConfigProvider.getConfig(option.displayValue.getApplicationKey());
            let optionView = new AuthApplicationSelectedOptionView(option, siteConfig, this.formContext, this.readOnly);

            optionView.onSiteConfigFormDisplayed((applicationKey: ApplicationKey) => {
                this.notifySiteConfigFormDisplayed(applicationKey, optionView.getFormView());
            });
            this.items.push(optionView);

            this.notifyAfterOptionCreated();
            return new SelectedOption<Application>(optionView, this.count());
        }

        removeOption(optionToRemove: Option<Application>, silent: boolean = false) {
            this.items = this.items.filter(item => !item.getSiteConfig().getApplicationKey().
                equals(optionToRemove.displayValue.getApplicationKey()));
            super.removeOption(optionToRemove, silent);
        }

        onSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.siteConfigFormDisplayedListeners.push(listener);
        }

        unSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.siteConfigFormDisplayedListeners =
                this.siteConfigFormDisplayedListeners.filter((curr) => (curr != listener));
        }

        private notifySiteConfigFormDisplayed(applicationKey: ApplicationKey, formView: FormView) {
            this.siteConfigFormDisplayedListeners.forEach((listener) => listener(applicationKey, formView));
        }


        onBeforeOptionCreated(listener: () => void) {
            this.beforeOptionCreatedListeners.push(listener);
        }

        unBeforeOptionCreated(listener: () => void) {
            this.beforeOptionCreatedListeners = this.beforeOptionCreatedListeners.filter((curr) => {
                return listener !== curr;
            });
        }

        private notifyBeforeOptionCreated() {
            this.beforeOptionCreatedListeners.forEach((listener) => listener());
        }

        onAfterOptionCreated(listener: () => void) {
            this.afterOptionCreatedListeners.push(listener);
        }

        unAfterOptionCreated(listener: () => void) {
            this.afterOptionCreatedListeners = this.afterOptionCreatedListeners.filter((curr) => {
                return listener !== curr;
            });
        }

        private notifyAfterOptionCreated() {
            this.afterOptionCreatedListeners.forEach((listener) => listener());
        }

    }
