import {Property} from "../../../../data/Property";
import {PropertyTree} from "../../../../data/PropertyTree";
import {Application} from "../../../../application/Application";
import {ApplicationKey} from "../../../../application/ApplicationKey";
import {ApplicationViewer} from "../../../../application/ApplicationViewer";
import {ApplicationLoader} from "../../../../application/ApplicationLoader";
import {FormView} from "../../../../form/FormView";
import {Option} from "../../../../ui/selector/Option";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {SelectedOptionView} from "../../../../ui/selector/combobox/SelectedOptionView";
import {RichComboBox} from "../../../../ui/selector/combobox/RichComboBox";
import {ContentFormContext} from "../../ContentFormContext";
import {RichComboBoxBuilder} from "../../../../ui/selector/combobox/RichComboBox";
import {AuthApplicationLoader} from "../../../../security/auth/AuthApplicationLoader";
import {AuthApplicationSelectedOptionsView} from "./AuthApplicationSelectedOptionsView";
import {AuthApplicationSelectedOptionView} from "./AuthApplicationSelectedOptionView";
import {SiteConfigProvider} from "../../../site/inputtype/siteconfigurator/SiteConfigProvider";

export class AuthApplicationComboBox extends RichComboBox<Application> {

        private authApplicationSelectedOptionsView: AuthApplicationSelectedOptionsView;

        constructor(maxOccurrences: number, siteConfigProvider: SiteConfigProvider,
                    formContext: ContentFormContext, value: string, readOnly: boolean) {

            this.authApplicationSelectedOptionsView = new AuthApplicationSelectedOptionsView(siteConfigProvider, formContext, readOnly);
            var builder = new RichComboBoxBuilder<Application>();
            builder.
                setMaximumOccurrences(maxOccurrences).
                setIdentifierMethod('getApplicationKey').
                setComboBoxName("applicationSelector").
                setLoader(new AuthApplicationLoader()).
                setSelectedOptionsView(this.authApplicationSelectedOptionsView).
                setOptionDisplayValueViewer(new ApplicationViewer()).
                setValue(value).
                setDelayedInputValueChangedHandling(500);

            super(builder);
        }

        getSelectedOptionViews(): AuthApplicationSelectedOptionView[] {
            var views: AuthApplicationSelectedOptionView[] = [];
            this.getSelectedOptions().forEach((selectedOption: SelectedOption<Application>) => {
                views.push(<AuthApplicationSelectedOptionView>selectedOption.getOptionView());
            });
            return views;
        }

        onSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.authApplicationSelectedOptionsView.onSiteConfigFormDisplayed(listener);
        }

        unSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.authApplicationSelectedOptionsView.unSiteConfigFormDisplayed(listener);
        }

        onBeforeOptionCreated(listener: () => void) {
            this.authApplicationSelectedOptionsView.onBeforeOptionCreated(listener);
        }

        unBeforeOptionCreated(listener: () => void) {
            this.authApplicationSelectedOptionsView.unBeforeOptionCreated(listener);
        }

        onAfterOptionCreated(listener: () => void) {
            this.authApplicationSelectedOptionsView.onAfterOptionCreated(listener);
        }

        unAfterOptionCreated(listener: () => void) {
            this.authApplicationSelectedOptionsView.unAfterOptionCreated(listener);
        }
    }

