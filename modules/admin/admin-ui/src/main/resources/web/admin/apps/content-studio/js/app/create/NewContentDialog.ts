import {GetAllContentTypesRequest} from "../../../../../common/js/schema/content/GetAllContentTypesRequest";
import {GetContentTypeByNameRequest} from "../../../../../common/js/schema/content/GetContentTypeByNameRequest";
import {GetNearestSiteRequest} from "../../../../../common/js/content/resource/GetNearestSiteRequest";
import {ContentName} from "../../../../../common/js/content/ContentName";
import {Content} from "../../../../../common/js/content/Content";
import {ContentPath} from "../../../../../common/js/content/ContentPath";
import {ContentTypeName} from "../../../../../common/js/schema/content/ContentTypeName";
import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";
import {ContentType} from "../../../../../common/js/schema/content/ContentType";
import {Site} from "../../../../../common/js/content/site/Site";
import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {FileUploadStartedEvent} from "../../../../../common/js/ui/uploader/FileUploadStartedEvent";
import {UploadItem} from "../../../../../common/js/ui/uploader/UploadItem";
import {ListContentByPathRequest} from "../../../../../common/js/content/resource/ListContentByPathRequest";
import {LoadMask} from "../../../../../common/js/ui/mask/LoadMask";
import {ContentResponse} from "../../../../../common/js/content/resource/result/ContentResponse";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {FileInput} from "../../../../../common/js/ui/text/FileInput";
import {DropzoneContainer} from "../../../../../common/js/ui/uploader/UploaderEl";
import {Body} from "../../../../../common/js/dom/Body";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {SectionEl} from "../../../../../common/js/dom/SectionEl";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {Element} from "../../../../../common/js/dom/Element";
import {KeyBinding} from "../../../../../common/js/ui/KeyBinding";
import {FormEl} from "../../../../../common/js/dom/FormEl";
import {KeyBindings} from "../../../../../common/js/ui/KeyBindings";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {DefaultErrorHandler} from "../../../../../common/js/DefaultErrorHandler";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {PEl} from "../../../../../common/js/dom/PEl";

import {MostPopularItemsBlock} from "./MostPopularItemsBlock";
import {RecentItemsBlock} from "./RecentItemsBlock";
import {NewContentDialogItemSelectedEvent} from "./NewContentDialogItemSelectedEvent";
import {NewMediaUploadEvent} from "./NewMediaUploadEvent";
import {NewContentEvent} from "./NewContentEvent";
import {FilterableItemsList} from "./FilterableItemsList";

export class NewContentDialog extends ModalDialog {

    private contentDialogTitle: NewContentDialogTitle;

    private parentContent: Content;

    private fileInput: FileInput;

    private dropzoneContainer: DropzoneContainer;

    private allContentTypes: FilterableItemsList;

    private mostPopularContentTypes: MostPopularItemsBlock;

    private recentContentTypes: RecentItemsBlock;

    protected loadMask: LoadMask;

    constructor() {
        this.contentDialogTitle = new NewContentDialogTitle("Create Content", "");

        super({
            title: this.contentDialogTitle
        });

        this.addClass("new-content-dialog");

        this.initElements();

        this.appendElementsToDialog();

        Body.get().appendChild(this);
    }

    private initElements() {
        this.initContentTypesLists();
        this.initFileInput();
        this.initDragAndDropUploaderEvents();
        this.initLoadMask();
    }

    private initContentTypesLists() {
        this.allContentTypes = new FilterableItemsList();
        this.mostPopularContentTypes = new MostPopularItemsBlock();
        this.recentContentTypes = new RecentItemsBlock();

        this.allContentTypes.onSelected(this.closeAndFireEventFromContentType.bind(this));
        this.mostPopularContentTypes.getItemsList().onSelected(this.closeAndFireEventFromContentType.bind(this));
        this.recentContentTypes.getItemsList().onSelected(this.closeAndFireEventFromContentType.bind(this));
    }


    private initFileInput() {
        this.dropzoneContainer = new DropzoneContainer(true);
        this.dropzoneContainer.hide();
        this.appendChild(this.dropzoneContainer);

        this.fileInput = new FileInput('large', undefined).
            setPlaceholder("Search for content types").
            setUploaderParams({parent: ContentPath.ROOT.toString()});

        this.fileInput.getUploader().addDropzone(this.dropzoneContainer.getDropzone().getId());

        this.initFileInputEvents();
    }

    private initFileInputEvents() {
        this.fileInput.onUploadStarted(this.closeAndFireEventFromMediaUpload.bind(this));

        this.fileInput.onInput((event: Event) => {
            if (StringHelper.isEmpty(this.fileInput.getValue())) {
                this.mostPopularContentTypes.showIfNotEmpty();
            } else {
                this.mostPopularContentTypes.hide();
            }

            this.allContentTypes.filter(this.fileInput.getValue());
        });

        this.fileInput.onKeyUp((event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.getCancelAction().execute();
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

    private appendElementsToDialog() {
        var section = new SectionEl().setClass("column");
        this.appendChildToContentPanel(section);

        this.mostPopularContentTypes.hide();

        var contentTypesListDiv = new DivEl("content-types-content");
        contentTypesListDiv.appendChildren(<Element>this.mostPopularContentTypes,
            <Element>this.allContentTypes);

        section.appendChildren(<Element>this.fileInput, <Element>contentTypesListDiv);

        this.appendChildToContentPanel(this.recentContentTypes);

        this.getContentPanel().getParentElement().appendChild(this.loadMask);
    }

    setParentContent(parent: Content) {
        this.parentContent = parent;
        this.allContentTypes.setParentContent(parent);

        var params: {[key: string]: any} = {
            parent: parent ? parent.getPath().toString() : ContentPath.ROOT.toString()
        };

        this.fileInput.setUploaderParams(params)
    }

    open() {
        super.open();
        var keyBindings = [
            new KeyBinding('up', () => {
                FormEl.moveFocusToPrevFocusable(Element.fromHtmlElement(<HTMLElement>document.activeElement),
                    "input,li");
            }).setGlobal(true),
            new KeyBinding('down', () => {
                FormEl.moveFocusToNextFocusable(Element.fromHtmlElement(<HTMLElement>document.activeElement),
                    "input,li");
            }).setGlobal(true)];

        KeyBindings.get().bindKeys(keyBindings);
    }

    show() {
        this.updateDialogTitlePath();

        this.fileInput.disable();
        //this.uploader.setEnabled(false);
        this.resetFileInputWithUploader();

        super.show();

        // CMS-3711: reload content types each time when dialog is show.
        // It is slow but newly create content types are displayed.
        this.loadContentTypes();
    }

    hide() {
        super.hide();
        this.mostPopularContentTypes.hide();
        this.clearAllItems();
    }

    close() {
        this.fileInput.reset();
        super.close();
    }

    private loadContentTypes() {

        this.loadMask.show();

        wemQ.all(this.sendRequestsToFetchContentData())
            .spread((contentTypes: ContentTypeSummary[], directChilds: ContentResponse<ContentSummary>,
                     parentSite: Site) => {

                this.allContentTypes.createItems(contentTypes, parentSite);
                this.mostPopularContentTypes.getItemsList().createItems(this.allContentTypes.getItems(), directChilds.getContents());
                this.recentContentTypes.getItemsList().createItems(this.allContentTypes.getItems());

            }).catch((reason: any) => {

            DefaultErrorHandler.handle(reason);

        }).finally(() => {
            this.fileInput.enable();
            this.fileInput.giveFocus();
            this.toggleUploadersEnabled();
            this.loadMask.hide();
            this.mostPopularContentTypes.showIfNotEmpty();
            this.centerMyself();
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
        if (this.parentContent) {
            this.contentDialogTitle.setPath(this.parentContent.getPath().toString());
        } else {
            this.contentDialogTitle.setPath('');
        }
    }

    private clearAllItems() {
        this.mostPopularContentTypes.getItemsList().clearItems();
        this.allContentTypes.clearItems();
        this.recentContentTypes.getItemsList().clearItems();
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

export class NewContentDialogTitle extends ModalDialogHeader {

    private pathEl: PEl;

    constructor(title: string, path: string) {
        super(title);

        this.pathEl = new PEl('path');
        this.pathEl.setHtml(path);
        this.appendChild(this.pathEl);
    }

    setPath(path: string) {
        this.pathEl.setHtml(path).setVisible(!StringHelper.isBlank(path));
    }
}
