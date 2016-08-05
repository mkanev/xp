import "../../../api.ts";
import {MostPopularItemsBlock} from "../../create/MostPopularItemsBlock";
import {RecentItemsBlock} from "../../create/RecentItemsBlock";
import {NewContentDialogItemSelectedEvent} from "../../create/NewContentDialogItemSelectedEvent";
import {NewMediaUploadEvent} from "../../create/NewMediaUploadEvent";
import {NewContentEvent} from "../../create/NewContentEvent";
import {FilterableItemsList} from "../../create/FilterableItemsList";

import GetAllContentTypesRequest = api.schema.content.GetAllContentTypesRequest;
import GetContentTypeByNameRequest = api.schema.content.GetContentTypeByNameRequest;
import GetNearestSiteRequest = api.content.GetNearestSiteRequest;
import ContentName = api.content.ContentName;
import Content = api.content.Content;
import ContentPath = api.content.ContentPath;
import ContentTypeName = api.schema.content.ContentTypeName;
import ContentTypeSummary = api.schema.content.ContentTypeSummary;
import ContentType = api.schema.content.ContentType;
import Site = api.content.site.Site;
import ApplicationKey = api.application.ApplicationKey;
import FileUploadStartedEvent = api.ui.uploader.FileUploadStartedEvent;
import UploadItem = api.ui.uploader.UploadItem;
import ListContentByPathRequest = api.content.ListContentByPathRequest;
import LoadMask = api.ui.mask.LoadMask;

export class NewContentDialog extends api.material.ui.dialog.Dialog {

    private parentContent: api.content.Content;

    private fileInput: api.ui.text.FileInput;

    private dropzoneContainer: api.ui.uploader.DropzoneContainer;

    private allContentTypes: FilterableItemsList;

    private mostPopularContentTypes: MostPopularItemsBlock;

    private recentContentTypes: RecentItemsBlock;

    protected loadMask: LoadMask;

    constructor() {
        super(<api.material.ui.dialog.DialogConfig>{
            title: {title: "Create Content"}
        });

        this.addClass("material-new-content-dialog");

        this.initElements();

        api.dom.Body.get().appendChild(this);
    }

    private initElements() {
        this.initContentTypesLists();
        this.initFileInput();
        this.initDragAndDropUploaderEvents();
        this.initLoadMask();
    }

    getContentElements(): api.dom.Element[] {

        var section = new api.dom.SectionEl().setClass("column");

        this.mostPopularContentTypes.hide();

        var contentTypesListDiv = new api.dom.DivEl("content-types-content");
        contentTypesListDiv.appendChild(this.allContentTypes);

        section.appendChildren(<api.dom.Element>this.fileInput, <api.dom.Element>contentTypesListDiv);

        // Add MDL handlers
        this.fileInput.getHTMLElement().className =
            "material-new-content-dialog__file-input mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
        this.fileInput.getTextInput().addClass("mdl-textfield__input");
        const forEl = this.fileInput.getTextInput().getId();
        this.fileInput.insertChild(
            api.dom.Element.fromString('<label class="mdl-textfield__label" for="' + forEl + '">Search for content types...</label>'), 1);
        this.fileInput.getTextInput().setPlaceholder("");

        const uploadButton = this.fileInput.getUploader().getUploadButton();
        uploadButton.getHTMLElement().className =
            "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent material-new-content-dialog__uploader"
    );

    uploadButton
.
    setHtml(

    "Upload"
);
    componentHandler
.
    upgradeElement(uploadButton

.
    getHTMLElement()

);

    componentHandler
.
    upgradeElement(

    this
.
    fileInput
.
    getHTMLElement()

);

        const wrapper = new api.dom.DivEl("material-new-content-dialog__wrapper mdl-grid");
    section
.
    addClass(

    "material-new-content-dialog__types mdl-cell mdl-cell--6-col"
);

    const
    quickAccess = new api.dom.DivEl("material-new-content-dialog__quick-access mdl-cell mdl-cell--6-col");
        quickAccess.appendChild(this.mostPopularContentTypes);
        quickAccess.appendChild(this.recentContentTypes);
        
        wrapper.appendChild(section);
        wrapper.appendChild(quickAccess);
        wrapper.appendChild(this.dropzoneContainer);
        wrapper.appendChild(this.loadMask);

        return [wrapper];
    }

    private initContentTypesLists() {
        this.allContentTypes = new FilterableItemsList();
        this.mostPopularContentTypes = new MostPopularItemsBlock();
        this.recentContentTypes = new RecentItemsBlock();

        this.allContentTypes.addClass("mdl-shadow--4dp");
        this.mostPopularContentTypes.getItemsList().addClass("mdl-shadow--4dp");
        this.recentContentTypes.getItemsList().addClass("mdl-shadow--4dp");

        this.allContentTypes.onSelected(this.closeAndFireEventFromContentType.bind(this));
        this.mostPopularContentTypes.getItemsList().onSelected(this.closeAndFireEventFromContentType.bind(this));
        this.recentContentTypes.getItemsList().onSelected(this.closeAndFireEventFromContentType.bind(this));
    }


    private initFileInput() {
        this.dropzoneContainer = new api.ui.uploader.DropzoneContainer(true);
        this.dropzoneContainer.hide();

        this.fileInput = new api.ui.text.FileInput('large', undefined).setPlaceholder("Search for content types").setUploaderParams(
            {parent: ContentPath.ROOT.toString()});

        this.fileInput.getUploader().addDropzone(this.dropzoneContainer.getDropzone().getId());

        this.initFileInputEvents();
    }

    private initFileInputEvents() {
        this.fileInput.onUploadStarted(this.closeAndFireEventFromMediaUpload.bind(this));

        this.fileInput.onInput((event: Event) => {
            this.allContentTypes.filter(this.fileInput.getValue());
        });

        this.fileInput.onKeyUp((event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.close();
            }
        });
    }

    private initLoadMask() {
        this.loadMask = new LoadMask(this);
    }

    // in order to toggle appropriate handlers during drag event
    // we catch drag enter on this element and trigger uploader to appear,
    // then catch drag leave on uploader's dropzone to get back to previous state
    private initDragAndDropUploaderEvents() {
        var dragOverEl;
        this.onDragEnter((event: DragEvent) => {
            if (this.fileInput.getUploader().isEnabled()) {
                var target = <HTMLElement> event.target;

                if (!!dragOverEl || dragOverEl == this.getHTMLElement()) {
                    this.dropzoneContainer.show();
                }
                dragOverEl = target;
            }
        });

        this.fileInput.getUploader().onDropzoneDragLeave(() => this.dropzoneContainer.hide());
        this.fileInput.getUploader().onDropzoneDrop(() => this.dropzoneContainer.hide());
    }

    private closeAndFireEventFromMediaUpload(event: FileUploadStartedEvent<Content>) {
        this.close();
        new NewMediaUploadEvent(event.getUploadItems(), this.parentContent).fire();
    }

    private closeAndFireEventFromContentType(event: NewContentDialogItemSelectedEvent) {
        this.close();
        new NewContentEvent(event.getItem().getContentType(), this.parentContent).fire();
    }

setParentContent(parent
:
api.content.Content
)
{
    this.parentContent = parent;
    this.allContentTypes.setParentContent(parent);

    var params: {[key: string]: any} = {
        parent: parent ? parent.getPath().toString() : api.content.ContentPath.ROOT.toString()
    };

    this.fileInput.setUploaderParams(params)
}

    open() {
        super.open();
        var keyBindings = [
            new api.ui.KeyBinding('up', () => {
                api.dom.FormEl.moveFocusToPrevFocusable(api.dom.Element.fromHtmlElement(<HTMLElement>document.activeElement),
                    "input,li");
            }).setGlobal(true),
            new api.ui.KeyBinding('down', () => {
                api.dom.FormEl.moveFocusToNextFocusable(api.dom.Element.fromHtmlElement(<HTMLElement>document.activeElement),
                    "input,li");
            }).setGlobal(true)];

        api.ui.KeyBindings.get().bindKeys(keyBindings);

        this.updateDialogTitlePath();

        this.fileInput.disable();
        this.resetFileInputWithUploader();

        // CMS-3711: reload content types each time when dialog is show.
        // It is slow but newly create content types are displayed.
        this.loadContentTypes();
    }

    show() {
        this.updateDialogTitlePath();

        this.fileInput.disable();
        this.resetFileInputWithUploader();

        super.show();

        // CMS-3711: reload content types each time when dialog is show.
        // It is slow but newly create content types are displayed.
        this.loadContentTypes();
    }

    private loadContentTypes() {

        this.loadMask.show();

        wemQ.all(this.sendRequestsToFetchContentData())
            .spread((contentTypes: ContentTypeSummary[], directChilds: api.content.ContentResponse<api.content.ContentSummary>,
                     parentSite: Site) => {

                this.allContentTypes.createItems(contentTypes, parentSite);
                this.mostPopularContentTypes.getItemsList().createItems(this.allContentTypes.getItems(), directChilds.getContents());
                this.recentContentTypes.getItemsList().createItems(this.allContentTypes.getItems());

            }).catch((reason: any) => {

            api.DefaultErrorHandler.handle(reason);

        }).finally(() => {
            this.fileInput.enable();
            this.fileInput.giveFocus();
            this.fileInput.removeClass("has-placeholder");
            this.fileInput.removeClass("is-disabled");
            this.fileInput.removeClass("is-upgraded");
            this.toggleUploadersEnabled();
            this.loadMask.hide();
            this.mostPopularContentTypes.showIfNotEmpty();
        }).done();
    }

    private sendRequestsToFetchContentData(): wemQ.Promise<any>[] {
        var requests: wemQ.Promise<any>[] = [];
        requests.push(new GetAllContentTypesRequest().sendAndParse());
        if (this.parentContent) {
            requests.push(new ListContentByPathRequest(this.parentContent.getPath()).sendAndParse());
            requests.push(new GetNearestSiteRequest(this.parentContent.getContentId()).sendAndParse());
        } else {
            requests.push(new ListContentByPathRequest(ContentPath.ROOT).sendAndParse());
        }

        return requests;
    }

    private updateDialogTitlePath() {
        const subtitle = this.parentContent ? this.parentContent.getPath().toString() : "";
        this.updateHeader({subtitle});
    }

    private toggleUploadersEnabled() {
        var uploaderEnabled = !this.parentContent || !this.parentContent.getType().isTemplateFolder();
        this.toggleClass("no-uploader-el", !uploaderEnabled);
        this.fileInput.getUploader().setEnabled(uploaderEnabled);
    }

    private resetFileInputWithUploader() {
        this.fileInput.reset();
        this.fileInput.getUploader().setEnabled(false);
    }
}
