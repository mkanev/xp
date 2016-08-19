import {ContentPath} from "../../../../../common/js/content/ContentPath";
import {ContentType} from "../../../../../common/js/schema/content/ContentType";
import {GetContentTypeByNameRequest} from "../../../../../common/js/schema/content/GetContentTypeByNameRequest";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentResponse} from "../../../../../common/js/content/resource/result/ContentResponse";
import {ContentIds} from "../../../../../common/js/content/ContentIds";
import {MoveContentResult} from "../../../../../common/js/content/resource/result/MoveContentResult";
import {MoveContentResultFailure} from "../../../../../common/js/content/resource/result/MoveContentResult";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {H6El} from "../../../../../common/js/dom/H6El";
import {LoadMask} from "../../../../../common/js/ui/mask/LoadMask";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {showError} from "../../../../../common/js/notify/MessageBus";
import {Action} from "../../../../../common/js/ui/Action";
import {MoveContentRequest} from "../../../../../common/js/content/resource/MoveContentRequest";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {showWarning} from "../../../../../common/js/notify/MessageBus";
import {Body} from "../../../../../common/js/dom/Body";

import {OpenMoveDialogEvent} from "./OpenMoveDialogEvent";
import {ContentMoveComboBox} from "./ContentMoveComboBox";

export class MoveContentDialog extends ModalDialog {

    private destinationSearchInput: ContentMoveComboBox;

    private movedContentSummaries: ContentSummary[];

    private contentPathSubHeader: H6El;

    private moveMask: LoadMask;

    constructor() {
        super({
            title: new ModalDialogHeader("Move item with children")
        });
        this.addClass("move-content-dialog");

        this.contentPathSubHeader = new H6El().addClass("content-path");
        var descMessage = new H6El().addClass("desc-message").setHtml(
            "Moves selected items with all children and current permissions to selected destination");
        this.moveMask = new LoadMask(this);
        this.initSearchInput();
        this.initMoveAction();

        this.listenOpenMoveDialogEvent();

        this.appendChildToContentPanel(this.contentPathSubHeader);
        this.appendChildToContentPanel(descMessage);
        this.appendChildToContentPanel(this.destinationSearchInput);
        this.appendChildToContentPanel(this.moveMask);
        this.addCancelButtonToBottom();
    }

    private listenOpenMoveDialogEvent() {
        OpenMoveDialogEvent.on((event) => {

            this.movedContentSummaries = event.getContentSummaries();
            this.destinationSearchInput.clearCombobox();

            if (event.getContentSummaries().length == 1) {
                var contentToMove = event.getContentSummaries()[0];

                new GetContentTypeByNameRequest(contentToMove.getType()).sendAndParse().then((contentType: ContentType) => {

                    this.destinationSearchInput.setFilterContentPath(contentToMove.getPath());
                    this.destinationSearchInput.setFilterSourceContentType(contentType);
                    this.contentPathSubHeader.setHtml(contentToMove.getPath().toString());

                    this.open();
                }).catch((reason)=> {
                    showError(reason.getMessage());
                }).done();
            } else {
                this.destinationSearchInput.setFilterContentPath(null);
                this.contentPathSubHeader.setHtml("");
                this.open();
            }

        });
    }

    private initSearchInput() {
        this.destinationSearchInput = new ContentMoveComboBox();
        this.destinationSearchInput.addClass("content-selector");
        this.destinationSearchInput.onKeyUp((event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.getCancelAction().execute();
            }
        });
    }

    private initMoveAction() {

        this.addAction(new Action("Move", "").onExecuted(() => {

            this.moveMask.show();

            var parentContent = this.getParentContent();
            this.moveContent(parentContent);
        }));
    }

    private moveContent(parentContent: ContentSummary) {
        var parentRoot = (!!parentContent) ? parentContent.getPath() : ContentPath.ROOT;

        var contentIds = ContentIds.create().fromContentIds(this.movedContentSummaries.map(summary => summary.getContentId())).build();

        new MoveContentRequest(contentIds, parentRoot).sendAndParse().then((response: MoveContentResult) => {
            if (parentContent) {
                this.destinationSearchInput.deselect(parentContent);
            }
            this.moveMask.hide();

            if (response.getMoved().length > 0) {
                if (response.getMoved().length > 1) {
                    showFeedback(response.getMoved().length + ' items moved');
                } else {
                    showFeedback("\"" + response.getMoved()[0] + '\" moved');
                }
            }

            response.getMoveFailures().forEach((failure: MoveContentResultFailure) => {
                showWarning(failure.getReason());
            });
            this.close();
        }).catch((reason)=> {
            showWarning(reason.getMessage());
            this.close();
            this.destinationSearchInput.deselect(this.getParentContent());
        }).done();
    }

    private getParentContent(): ContentSummary {
        return <ContentSummary>this.destinationSearchInput.getSelectedDisplayValues()[0];
    }

    show() {
        Body.get().appendChild(this);
        super.show();
        this.destinationSearchInput.giveFocus();
    }

}
