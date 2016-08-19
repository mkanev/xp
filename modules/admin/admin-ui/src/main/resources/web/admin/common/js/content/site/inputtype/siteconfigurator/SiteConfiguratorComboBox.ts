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
import {ContentFormContext} from "../../../form/ContentFormContext";
import {RichComboBoxBuilder} from "../../../../ui/selector/combobox/RichComboBox";
import {SiteConfigProvider} from "./SiteConfigProvider";
import {SiteConfiguratorSelectedOptionsView} from "./SiteConfiguratorSelectedOptionsView";
import {SiteConfiguratorSelectedOptionView} from "./SiteConfiguratorSelectedOptionView";

export class SiteConfiguratorComboBox extends RichComboBox<Application> {

        private siteConfiguratorSelectedOptionsView: SiteConfiguratorSelectedOptionsView;

        constructor(maxOccurrences: number, siteConfigProvider: SiteConfigProvider,
                    formContext: ContentFormContext, value?: string) {

            var filterObject = {
                state: Application.STATE_STARTED
            };

            this.siteConfiguratorSelectedOptionsView = new SiteConfiguratorSelectedOptionsView(siteConfigProvider, formContext);
            var builder = new RichComboBoxBuilder<Application>();
            builder.
                setMaximumOccurrences(maxOccurrences).
                setIdentifierMethod('getApplicationKey').
                setComboBoxName("applicationSelector").
                setLoader(new ApplicationLoader(500, filterObject)).
                setSelectedOptionsView(this.siteConfiguratorSelectedOptionsView).
                setOptionDisplayValueViewer(new ApplicationViewer()).
                setValue(value).
                setDelayedInputValueChangedHandling(500);

            super(builder);
        }

        getSelectedOptionViews(): SiteConfiguratorSelectedOptionView[] {
            var views: SiteConfiguratorSelectedOptionView[] = [];
            this.getSelectedOptions().forEach((selectedOption: SelectedOption<Application>) => {
                views.push(<SiteConfiguratorSelectedOptionView>selectedOption.getOptionView());
            });
            return views;
        }

        onSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.siteConfiguratorSelectedOptionsView.onSiteConfigFormDisplayed(listener);
        }

        unSiteConfigFormDisplayed(listener: {(applicationKey: ApplicationKey, formView: FormView): void;}) {
            this.siteConfiguratorSelectedOptionsView.unSiteConfigFormDisplayed(listener);
        }

    }

