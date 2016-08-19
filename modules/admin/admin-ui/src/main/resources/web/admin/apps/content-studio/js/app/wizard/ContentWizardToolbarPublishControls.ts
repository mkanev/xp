import {Action} from "../../../../../common/js/ui/Action";
import {DialogButton} from "../../../../../common/js/ui/dialog/DialogButton";
import {SpanEl} from "../../../../../common/js/dom/SpanEl";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {MenuButton} from "../../../../../common/js/ui/button/MenuButton";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {Content} from "../../../../../common/js/content/Content";
import {IsAuthenticatedRequest} from "../../../../../common/js/security/auth/IsAuthenticatedRequest";
import {LoginResult} from "../../../../../common/js/security/auth/LoginResult";
import {PermissionHelper} from "../../../../../common/js/security/acl/PermissionHelper";
import {Permission} from "../../../../../common/js/security/acl/Permission";
import {CompareStatusFormatter} from "../../../../../common/js/content/CompareStatus";

export class ContentWizardToolbarPublishControls extends DivEl {

    private publishButton: MenuButton;
    private publishAction: Action;
    private publishTreeAction: Action;
    private unpublishAction: Action;
    private contentStateSpan: SpanEl;
    private contentCanBePublished: boolean = false;
    private userCanPublish: boolean = true;
    private leafContent: boolean = true;
    private contentCompareStatus: CompareStatus;

    constructor(publish: Action, publishTree: Action, unpublish: Action) {
        super("toolbar-publish-controls");

        this.publishAction = publish;
        this.publishAction.setIconClass("publish-action");
        this.publishTreeAction = publishTree;
        this.unpublishAction = unpublish;

        this.publishButton = new MenuButton(publish, [publishTree, unpublish]);
        this.publishButton.addClass("content-wizard-toolbar-publish-button");

        this.contentStateSpan = new SpanEl("content-status");

        this.appendChildren(this.contentStateSpan, this.publishButton);
    }

    public setCompareStatus(compareStatus: CompareStatus, refresh: boolean = true) {
        this.contentCompareStatus = compareStatus;
        if (refresh) {
            this.refreshState();
        }
    }

    public setContentCanBePublished(value: boolean, refresh: boolean = true) {
        this.contentCanBePublished = value;
        if (refresh) {
            this.refreshState();
        }
    }

    public setUserCanPublish(value: boolean, refresh: boolean = true) {
        this.userCanPublish = value;
        if (refresh) {
            this.refreshState();
        }
    }

    public setLeafContent(leafContent: boolean, refresh: boolean = true) {
        this.leafContent = leafContent;
        if (refresh) {
            this.refreshState();
        }
    }

    public refreshState() {
        let canBePublished = !this.isOnline() && this.contentCanBePublished && this.userCanPublish;
        let canTreeBePublished = !this.leafContent && this.contentCanBePublished && this.userCanPublish;
        let canBeUnpublished = this.contentCompareStatus != CompareStatus.NEW && this.contentCompareStatus != CompareStatus.UNKNOWN;
        
        this.publishAction.setEnabled(canBePublished);
        this.publishTreeAction.setEnabled(canTreeBePublished);
        this.unpublishAction.setEnabled(canBeUnpublished);

        this.contentStateSpan.setHtml(this.getContentStateValueForSpan(this.contentCompareStatus), false);
    }

    public isOnline(): boolean {
        return this.contentCompareStatus === CompareStatus.EQUAL;
    }

    public isPendingDelete(): boolean {
        return this.contentCompareStatus == CompareStatus.PENDING_DELETE;
    }

    public enableActionsForExisting(existing: Content) {
        new IsAuthenticatedRequest().sendAndParse().then((loginResult: LoginResult) => {
            var hasPublishPermission = PermissionHelper.hasPermission(Permission.PUBLISH,
                loginResult, existing.getPermissions());
            this.setUserCanPublish(hasPublishPermission);
        });
    }

    private getContentStateValueForSpan(compareStatus: CompareStatus): string {
        var status = new SpanEl();
        if (compareStatus === CompareStatus.EQUAL) {
            status.addClass("online");
        }
        status.setHtml(CompareStatusFormatter.formatStatus(compareStatus));
        return "Item is " + status.toString();
    }
}
