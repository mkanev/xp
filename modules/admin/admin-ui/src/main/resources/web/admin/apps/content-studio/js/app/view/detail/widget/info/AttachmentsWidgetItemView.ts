import {ContentSummary} from "../../../../../../../../common/js/content/ContentSummary";
import {Attachments} from "../../../../../../../../common/js/content/attachment/Attachments";
import {Attachment} from "../../../../../../../../common/js/content/attachment/Attachment";
import {ContentId} from "../../../../../../../../common/js/content/ContentId";
import {AttachmentName} from "../../../../../../../../common/js/content/attachment/AttachmentName";
import {UlEl} from "../../../../../../../../common/js/dom/UlEl";
import {SpanEl} from "../../../../../../../../common/js/dom/SpanEl";
import {ObjectHelper} from "../../../../../../../../common/js/ObjectHelper";
import {GetContentAttachmentsRequest} from "../../../../../../../../common/js/content/resource/GetContentAttachmentsRequest";
import {LiEl} from "../../../../../../../../common/js/dom/LiEl";
import {AEl} from "../../../../../../../../common/js/dom/AEl";
import {UriHelper} from "../../../../../../../../common/js/util/UriHelper";

import {WidgetItemView} from "../../WidgetItemView";

export class AttachmentsWidgetItemView extends WidgetItemView {

    private content: ContentSummary;

    private list: UlEl;

    private placeholder: SpanEl;

    public static debug = false;

    constructor() {
        super('attachments-widget-item-view');
    }

    public setContent(content: ContentSummary) {
        if (AttachmentsWidgetItemView.debug) {
            console.debug('AttachmentsWidgetItemView.setContent: ', content);
        }
        if (!ObjectHelper.equals(content, this.content)) {
            this.content = content;
            return this.layout();
        }
        return wemQ<any>(null);
    }

    public layout(): wemQ.Promise<any> {
        if (AttachmentsWidgetItemView.debug) {
            console.debug('AttachmentsWidgetItemView.layout');
        }

        return super.layout().then(() => {
            if (this.content != undefined) {
                return this.layoutAttachments();
            } else {
                this.removeChildren();
            }
        });
    }

    private layoutAttachments(): wemQ.Promise<Attachments> {
        return new GetContentAttachmentsRequest(this.content.getContentId()).sendAndParse().then(
            (attachments: Attachments) => {

                if (this.hasChild(this.list)) {
                    this.removeChild(this.list);
                }

                if (this.hasChild(this.placeholder)) {
                    this.removeChild(this.placeholder);
                }

                if (attachments) {
                    this.list = new UlEl('attachment-list');

                    var contentId = this.content.getContentId();
                    attachments.forEach((attachment: Attachment) => {
                        var attachmentContainer = new LiEl('attachment-container');
                        var link = this.createLinkEl(contentId, attachment.getName());
                        attachmentContainer.appendChild(link);
                        this.list.appendChild(attachmentContainer);

                    });

                    this.appendChild(this.list);

                } else {
                    this.placeholder = new SpanEl('att-placeholder').setHtml('This item has no attachments');
                    this.appendChild(this.placeholder);
                }

                return attachments;
            });
    }

    private createLinkEl(contentId: ContentId, attachmentName: AttachmentName): AEl {
        var url = `content/media/${contentId.toString()}/${attachmentName.toString()}`;
        var link = new AEl().setUrl(UriHelper.getRestUri(url), '_blank');
        link.setHtml(attachmentName.toString());
        return link;
    }

}
