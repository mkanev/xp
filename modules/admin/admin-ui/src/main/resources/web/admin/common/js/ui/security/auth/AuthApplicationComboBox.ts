import {RichComboBox} from "../../selector/combobox/RichComboBox";
import {Application} from "../../../application/Application";
import {RichComboBoxBuilder} from "../../selector/combobox/RichComboBox";
import {AuthApplicationLoader} from "../../../security/auth/AuthApplicationLoader";
import {BaseSelectedOptionsView} from "../../selector/combobox/BaseSelectedOptionsView";
import {Option} from "../../selector/Option";
import {SelectedOption} from "../../selector/combobox/SelectedOption";
import {RichSelectedOptionView} from "../../selector/combobox/RichSelectedOptionView";
import {AuthConfig} from "../../../security/AuthConfig";
import {PropertyTree} from "../../../data/PropertyTree";
import {UriHelper} from "../../../util/UriHelper";
import {Element} from "../../../dom/Element";
import {AEl} from "../../../dom/AEl";
import {SiteConfiguratorDialog} from "../../../content/site/inputtype/siteconfigurator/SiteConfiguratorDialog";
import {FormView} from "../../../form/FormView";
import {FormContext} from "../../../form/FormContext";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {AuthApplicationViewer} from "./AuthApplicationViewer";

export class AuthApplicationComboBox extends RichComboBox<Application> {
        constructor() {
            var builder = new RichComboBoxBuilder<Application>();
            builder.
                setMaximumOccurrences(1).
                setComboBoxName("authApplicationSelector").
                setLoader(new AuthApplicationLoader()).
                setSelectedOptionsView(new AuthApplicationSelectedOptionsView()).
                setOptionDisplayValueViewer(new AuthApplicationViewer()).
                setDelayedInputValueChangedHandling(500);
            super(builder);
        }
    }

    export class AuthApplicationSelectedOptionsView extends BaseSelectedOptionsView<Application> {

        createSelectedOption(option: Option<Application>): SelectedOption<Application> {
            var optionView = new AuthApplicationSelectedOptionView(option);
            return new SelectedOption<Application>(optionView, this.count());
        }
    }

    export class AuthApplicationSelectedOptionView extends RichSelectedOptionView<Application> {

        private application: Application;

        private authConfig: AuthConfig;

        private formView;


        constructor(option: Option<Application>) {
            super(option);
            this.application = option.displayValue;
            this.authConfig = AuthConfig.create().
                setConfig(new PropertyTree(undefined)).
                setApplicationKey(this.application.getApplicationKey()).
                build();
        }

        getAuthConfig(): AuthConfig {
            return this.authConfig;
        }

        setAuthConfig(authConfig: AuthConfig) {
            this.authConfig = authConfig;
        }

        resolveIconUrl(content: Application): string {
            return UriHelper.getAdminUri("common/images/icons/icoMoon/32x32/puzzle.png");
        }

        resolveTitle(content: Application): string {
            return content.getDisplayName();
        }

        resolveSubTitle(content: Application): string {
            return content.getApplicationKey().toString();
        }

        createActionButtons(content: Application): Element[] {
            if (content.getAuthForm().getFormItems().length > 0) {
                let editButton = new AEl("edit");
                editButton.onClicked((event: MouseEvent) => {
                    this.initAndOpenConfigureDialog();
                });
                return [editButton];
            }
            return [];
        }

        initAndOpenConfigureDialog() {
            if (this.application.getAuthForm().getFormItems().length > 0) {

                var tempSiteConfig: AuthConfig = this.makeTemporaryAuthConfig();
                var formViewStateOnDialogOpen = this.formView;
                this.formView = this.createFormView(tempSiteConfig);

                var okCallback = () => {
                    if (!tempSiteConfig.equals(this.authConfig)) {
                        this.applyTemporaryConfig(tempSiteConfig); //TODO Save on apply?
                    }
                };

                var siteConfiguratorDialog = new SiteConfiguratorDialog(this.application,
                    this.formView,
                    okCallback,
                    () => {
                    });
                siteConfiguratorDialog.open();
            }
        }

        private makeTemporaryAuthConfig(): AuthConfig {
            return AuthConfig.create().
                setConfig(this.authConfig.getConfig().copy()).
                setApplicationKey(this.authConfig.getApplicationKey()).build();
        }

        private createFormView(authConfig: AuthConfig): FormView {
            var formView = new FormView(FormContext.create().build(), this.application.getAuthForm(),
                authConfig.getConfig().getRoot());
            formView.addClass("site-form");
            formView.layout().then(() => {
                this.formView.validate(false, true);
                this.toggleClass("invalid", !this.formView.isValid());
            }).catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();

            return formView;
        }

        private applyTemporaryConfig(tempSiteConfig: AuthConfig) {
            tempSiteConfig.getConfig().getRoot().forEach((property) => {
                this.authConfig.getConfig().setProperty(property.getName(), property.getIndex(), property.getValue());
            });
            this.authConfig.getConfig().getRoot().forEach((property) => {
                var prop = tempSiteConfig.getConfig().getProperty(property.getName(), property.getIndex());
                if (!prop) {
                    this.authConfig.getConfig().removeProperty(property.getName(), property.getIndex());
                }
            });
        }

    }
