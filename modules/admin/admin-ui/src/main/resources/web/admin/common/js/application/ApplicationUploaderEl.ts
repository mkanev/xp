import {ValueTypes} from "../data/ValueTypes";
import {UploaderEl} from "../ui/uploader/UploaderEl";
import {UploaderElConfig} from "../ui/uploader/UploaderEl";
import {UriHelper} from "../util/UriHelper";
import {ApplicationInstallResultJson} from "./json/ApplicationInstallResultJson";
import {Element} from "../dom/Element";
import {AEl} from "../dom/AEl";
import {Application} from "./Application";
import {ApplicationInstallResult} from "./ApplicationInstallResult";

export class ApplicationUploaderEl extends UploaderEl<Application> {

        private failure: string;

        constructor(config: UploaderElConfig) {

            if (config.url == undefined) {
                config.url = UriHelper.getRestUri("application/install");
            }

            if (config.allowTypes == undefined) {
                config.allowTypes = [{title: 'Application files', extensions: 'jar,zip'}];
            }

            super(config);

            this.addClass('media-uploader-el');
        }


        createModel(serverResponse: ApplicationInstallResultJson): Application {
            if (serverResponse) {

                let result = ApplicationInstallResult.fromJson(serverResponse);

                this.failure = result.getFailure();

                return result.getApplication();
            }
            else {
                return null;
            }
        }

        getFailure(): string {
            return this.failure;
        }

        getModelValue(item: Application): string {
            return item.getId();
        }

        createResultItem(value: string): Element {
            return new AEl().setUrl(UriHelper.getRestUri('application/' + value), "_blank");
        }

        protected getErrorMessage(fileString: string): string {
            return "The application could not be installed";
        }
    }
