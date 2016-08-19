import {ApplicationUploaderEl} from "../../../../../../common/js/application/ApplicationUploaderEl";
import {InputEl} from "../../../../../../common/js/dom/InputEl";
import {FileUploadStartedEvent} from "../../../../../../common/js/ui/uploader/FileUploadStartedEvent";
import {FileUploadCompleteEvent} from "../../../../../../common/js/ui/uploader/FileUploadCompleteEvent";
import {FileUploadFailedEvent} from "../../../../../../common/js/ui/uploader/FileUploadFailedEvent";
import {ApplicationInstallResult} from "../../../../../../common/js/application/ApplicationInstallResult";
import {Action} from "../../../../../../common/js/ui/Action";
import {Application} from "../../../../../../common/js/application/Application";
import {CompositeFormInputEl} from "../../../../../../common/js/dom/CompositeFormInputEl";
import {LoadMask} from "../../../../../../common/js/ui/mask/LoadMask";
import {ValidationRecordingViewer} from "../../../../../../common/js/form/ValidationRecordingViewer";
import {UploadItem} from "../../../../../../common/js/ui/uploader/UploadItem";
import {StringHelper} from "../../../../../../common/js/util/StringHelper";
import {InstallUrlApplicationRequest} from "../../../../../../common/js/application/InstallUrlApplicationRequest";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";

export class ApplicationInput extends CompositeFormInputEl {

    private textInput: InputEl;
    private applicationUploaderEl: ApplicationUploaderEl;
    private lastTimeKeyPressedTimer;
    private LAST_KEY_PRESS_TIMEOUT: number;
    private mask: LoadMask;
    private cancelAction: Action;

    private errorPanel: ValidationRecordingViewer;

    private static APPLICATION_ADDRESS_MASK: string = "^(http|https)://\\S+";

    constructor(cancelAction: Action, className?: string, originalValue?: string) {

        this.textInput = new InputEl("text");

        this.applicationUploaderEl = new ApplicationUploaderEl({
            name: 'application-input-uploader',
            allowDrop: true,
            showResult: false,
            allowMultiSelection: true,
            deferred: false,
            value: originalValue,
            showCancel: false
        });

        super(this.textInput, this.applicationUploaderEl);

        this.LAST_KEY_PRESS_TIMEOUT = 1500;
        this.cancelAction = cancelAction;

        this.applicationUploaderEl.onUploadStarted((event: FileUploadStartedEvent<Application>) => {
            var names = event.getUploadItems().map((uploadItem: UploadItem<Application>) => {
                return uploadItem.getName();
            });
            this.textInput.setValue(names.join(', '));
        });

        this.errorPanel = new ValidationRecordingViewer();
        this.appendChild(this.errorPanel);
        this.errorPanel.hide();

        this.onHidden(() => {
            this.errorPanel.hide();
        });

        this.addClass("file-input" + (className ? " " + className : ""));
        this.initUrlEnteredHandler();
    }

    private initUrlEnteredHandler() {
        this.onKeyDown((event) => {
            clearTimeout(this.lastTimeKeyPressedTimer);

            this.errorPanel.hide();
            switch (event.keyCode) {
            case 13: //enter
                this.startInstall();
                break;
            case 27: //esc
                break;
            default :
                this.lastTimeKeyPressedTimer = setTimeout(() => {
                    this.startInstall();
                }, this.LAST_KEY_PRESS_TIMEOUT);
                break;
            }
        });
    }

    private initMask() {
        if (!this.mask) {
            this.mask = new LoadMask(this);
            this.getParentElement().appendChild(this.mask);
        }
    }

    private startInstall() {
        if (!StringHelper.isEmpty(this.textInput.getValue())) {

            let url = this.textInput.getValue();
            if (StringHelper.testRegex(ApplicationInput.APPLICATION_ADDRESS_MASK, url)) {
                this.initMask();
                this.mask.show();

                this.installWithUrl(url);
                console.log("url: " + url);
            }
        }
    }

    private installWithUrl(url: string) {
        this.mask.show();
        new InstallUrlApplicationRequest(url).sendAndParse().then((result: ApplicationInstallResult)=> {

            let failure = result.getFailure();

            this.showFailure(failure);
            if (!failure) {
                this.cancelAction.execute();
            }

            this.mask.hide();

        }).catch((reason: any) => {
            this.mask.hide();
            DefaultErrorHandler.handle(reason);
        });
    }

    showFailure(failure) {
        if (failure) {
            this.errorPanel.setError(failure);
            this.errorPanel.show();
        } else {
            this.errorPanel.hide();
        }
    }

    setUploaderParams(params: {[key: string]: any}): ApplicationInput {
        this.applicationUploaderEl.setParams(params);
        return this;
    }

    getUploaderParams(): {[key: string]: string} {
        return this.applicationUploaderEl.getParams();
    }

    setPlaceholder(placeholder: string): ApplicationInput {
        this.textInput.setPlaceholder(placeholder);
        return this;
    }

    getPlaceholder(): string {
        return this.textInput.getPlaceholder();
    }

    reset(): ApplicationInput {
        this.textInput.reset();
        this.applicationUploaderEl.reset();
        return this;
    }

    stop(): ApplicationInput {
        this.applicationUploaderEl.stop();
        return this;
    }

    getUploader(): ApplicationUploaderEl {
        return this.applicationUploaderEl;
    }

    onUploadStarted(listener: (event: FileUploadStartedEvent<Application>) => void) {
        this.applicationUploaderEl.onUploadStarted(listener);
    }

    unUploadStarted(listener: (event: FileUploadStartedEvent<Application>) => void) {
        this.applicationUploaderEl.unUploadStarted(listener);
    }

    onUploadFailed(listener: (event: FileUploadFailedEvent<Application>) => void) {
        this.applicationUploaderEl.onUploadFailed(listener);
    }

    unUploadFailed(listener: (event: FileUploadFailedEvent<Application>) => void) {
        this.applicationUploaderEl.unUploadFailed(listener);
    }

    onUploadCompleted(listener: (event: FileUploadCompleteEvent<Application>) => void) {
        this.applicationUploaderEl.onUploadCompleted(listener);
    }

    unUploadCompleted(listener: (event: FileUploadCompleteEvent<Application>) => void) {
        this.applicationUploaderEl.unUploadCompleted(listener);
    }
}
