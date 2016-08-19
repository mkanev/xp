import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {FileUploadCompleteEvent} from "../../../../../common/js/ui/uploader/FileUploadCompleteEvent";
import {FileUploadStartedEvent} from "../../../../../common/js/ui/uploader/FileUploadStartedEvent";
import {FileUploadFailedEvent} from "../../../../../common/js/ui/uploader/FileUploadFailedEvent";
import {ApplicationUploaderEl} from "../../../../../common/js/application/ApplicationUploaderEl";
import {Application} from "../../../../../common/js/application/Application";
import {DockedPanel} from "../../../../../common/js/ui/panel/DockedPanel";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {DropzoneContainer} from "../../../../../common/js/ui/uploader/UploaderEl";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {Body} from "../../../../../common/js/dom/Body";
import {ApplicationUploadStartedEvent} from "../../../../../common/js/application/ApplicationUploadStartedEvent";

import {MarketAppPanel} from "./view/MarketAppPanel";
import {UploadAppPanel} from "./view/UploadAppPanel";

export class InstallAppDialog extends ModalDialog {

    private dockedPanel: DockedPanel;

    private uploadAppPanel: UploadAppPanel;

    private marketAppPanel: MarketAppPanel;

    private dropzoneContainer: DropzoneContainer;

    private onMarketLoaded;

    constructor() {
        super({
            title: new ModalDialogHeader("Install Application")
        });

        this.addClass("install-application-dialog hidden");

        this.onMarketLoaded = this.centerMyself.bind(this);

        Body.get().appendChild(this);
    }

    updateInstallApplications(installApplications: Application[]) {
        this.marketAppPanel.updateInstallApplications(installApplications);
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered) => {

            if (!this.marketAppPanel) {
                this.marketAppPanel = new MarketAppPanel("market-app-panel");
            }

            if (!this.uploadAppPanel) {
                this.uploadAppPanel = new UploadAppPanel(this.getCancelAction(), "upload-app-panel");
                this.uploadAppPanel.onRendered((event) => {
                    this.uploadAppPanel.getApplicationInput().onKeyUp((event: KeyboardEvent) => {
                        if (event.keyCode === 27) {
                            this.getCancelAction().execute();
                        }
                    });

                    this.initUploaderListeners(this.uploadAppPanel);

                    this.dropzoneContainer = new DropzoneContainer(true);
                    this.dropzoneContainer.hide();
                    this.appendChild(this.dropzoneContainer);

                    this.uploadAppPanel.getApplicationInput().getUploader().addDropzone(this.dropzoneContainer.getDropzone().getId());

                    this.initDragAndDropUploaderEvents();
                });
            }

            if (!this.dockedPanel) {
                this.dockedPanel = new DockedPanel();
                this.dockedPanel.addClass("install-app-docked-panel");
                this.dockedPanel.addItem("Enonic Market", true, this.marketAppPanel);
                this.dockedPanel.addItem("Upload", true, this.uploadAppPanel);

                this.dockedPanel.getNavigator().onNavigationItemSelected(() => this.centerMyself());

                this.appendChildToContentPanel(this.dockedPanel);
            }

            return rendered;
        });
    }

    // in order to toggle appropriate handlers during drag event
    // we catch drag enter on this element and trigger uploader to appear,
    // then catch drag leave on uploader's dropzone to get back to previous state
    private initDragAndDropUploaderEvents() {
        var dragOverEl;
        this.onDragEnter((event: DragEvent) => {
            var target = <HTMLElement> event.target;

            if (!!dragOverEl || dragOverEl == this.getHTMLElement()) {
                this.dropzoneContainer.show();
            }
            dragOverEl = target;
        });

        this.uploadAppPanel.getApplicationInput().getUploader().onDropzoneDragLeave(() => this.dropzoneContainer.hide());
        this.uploadAppPanel.getApplicationInput().getUploader().onDropzoneDrop(() => this.dropzoneContainer.hide());
    }

    private initUploaderListeners(uploadAppPanel: UploadAppPanel) {

        let uploadFailedHandler = (event: FileUploadFailedEvent<Application>, uploader: ApplicationUploaderEl) => {
            uploadAppPanel.getApplicationInput().showFailure(
                uploader.getFailure());
            this.resetFileInputWithUploader();
        };

        uploadAppPanel.getApplicationInput().onUploadFailed((event) => {
            uploadFailedHandler(event, uploadAppPanel.getApplicationInput().getUploader())
        });

        let uploadCompletedHandler = (event: FileUploadCompleteEvent<Application>) => {
            if (event.getUploadItems()) {
                this.close();
            }
        };

        this.uploadAppPanel.getApplicationInput().onUploadCompleted(uploadCompletedHandler);

        let uploadStartedHandler = (event: FileUploadStartedEvent<Application>) => {
            new ApplicationUploadStartedEvent(event.getUploadItems()).fire();
        };

        this.uploadAppPanel.getApplicationInput().onUploadStarted(uploadStartedHandler);
    }

    show() {
        this.marketAppPanel.getMarketAppsTreeGrid().onLoaded(this.onMarketLoaded);
        this.resetFileInputWithUploader();
        super.show();
        this.marketAppPanel.loadGrid();
    }

    hide() {
        this.marketAppPanel.getMarketAppsTreeGrid().unLoaded(this.onMarketLoaded);
        super.hide();
        this.uploadAppPanel.getApplicationInput().stop();
        this.addClass("hidden");
        this.removeClass("animated");
    }

    close() {
        this.uploadAppPanel.getApplicationInput().reset();
        super.close();
    }

    private resetFileInputWithUploader() {
        this.uploadAppPanel.getApplicationInput().reset();
    }
}
