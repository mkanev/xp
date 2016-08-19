import {Action} from "../../../../../../common/js/ui/Action";
import {TreeGridActions} from "../../../../../../common/js/ui/treegrid/actions/TreeGridActions";
import {BrowseItem} from "../../../../../../common/js/app/browse/BrowseItem";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Content} from "../../../../../../common/js/content/Content";
import {AccessControlEntry} from "../../../../../../common/js/security/acl/AccessControlEntry";
import {AccessControlList} from "../../../../../../common/js/security/acl/AccessControlList";
import {GetContentTypeByNameRequest} from "../../../../../../common/js/schema/content/GetContentTypeByNameRequest";
import {ContentType} from "../../../../../../common/js/schema/content/ContentType";
import {IsAuthenticatedRequest} from "../../../../../../common/js/security/auth/IsAuthenticatedRequest";
import {LoginResult} from "../../../../../../common/js/security/auth/LoginResult";
import {GetContentPermissionsByIdRequest} from "../../../../../../common/js/content/resource/GetContentPermissionsByIdRequest";
import {Permission} from "../../../../../../common/js/security/acl/Permission";
import {PrincipalKey} from "../../../../../../common/js/security/PrincipalKey";
import {RoleKeys} from "../../../../../../common/js/security/RoleKeys";

import {ContentTreeGrid} from "../ContentTreeGrid";
import {ShowNewContentDialogAction} from "./ShowNewContentDialogAction";
import {EditContentAction} from "./EditContentAction";
import {DeleteContentAction} from "./DeleteContentAction";
import {DuplicateContentAction} from "./DuplicateContentAction";
import {MoveContentAction} from "./MoveContentAction";
import {SortContentAction} from "./SortContentAction";
import {PublishContentAction} from "./PublishContentAction";

export class MobileContentTreeGridActions implements TreeGridActions<ContentSummaryAndCompareStatus> {

    public SHOW_NEW_CONTENT_DIALOG_ACTION: Action;
    public EDIT_CONTENT: Action;
    public DELETE_CONTENT: Action;
    public DUPLICATE_CONTENT: Action;
    public MOVE_CONTENT: Action;
    public SORT_CONTENT: Action;
    public PUBLISH_CONTENT: Action;

    private actions: Action[] = [];

    constructor(grid: ContentTreeGrid) {

        this.SHOW_NEW_CONTENT_DIALOG_ACTION = new ShowNewContentDialogAction(grid);
        this.EDIT_CONTENT = new EditContentAction(grid);
        this.DELETE_CONTENT = new DeleteContentAction(grid);
        this.DUPLICATE_CONTENT = new DuplicateContentAction(grid);
        this.MOVE_CONTENT = new MoveContentAction(grid);
        this.SORT_CONTENT = new SortContentAction(grid);
        this.PUBLISH_CONTENT = new PublishContentAction(grid);

        this.actions.push(
            this.SHOW_NEW_CONTENT_DIALOG_ACTION,
            this.DELETE_CONTENT,
            this.DUPLICATE_CONTENT, this.MOVE_CONTENT,
            this.SORT_CONTENT,
            this.PUBLISH_CONTENT
        );

    }

    getAllActions(): Action[] {
        return this.actions;
    }

    updateActionsEnabledState(contentBrowseItems: BrowseItem<ContentSummaryAndCompareStatus>[]): wemQ.Promise<BrowseItem<ContentSummaryAndCompareStatus>[]> {

        var contentSummaries: ContentSummary[] = contentBrowseItems.map((elem: BrowseItem<ContentSummaryAndCompareStatus>) => {
            return elem.getModel().getContentSummary();
        });

        var deferred = wemQ.defer<BrowseItem<ContentSummaryAndCompareStatus>[]>();

        switch (contentBrowseItems.length) {
        case 0:
            this.EDIT_CONTENT.setEnabled(false);
            this.DELETE_CONTENT.setEnabled(false);
            this.DUPLICATE_CONTENT.setEnabled(false);
            this.MOVE_CONTENT.setEnabled(false);
            this.SORT_CONTENT.setEnabled(false);
            this.PUBLISH_CONTENT.setEnabled(false);
            deferred.resolve(contentBrowseItems);
            break;
        case 1:
            var contentSummary = contentSummaries[0];
            this.EDIT_CONTENT.setEnabled(!contentSummary ? false : contentSummary.isEditable());
            this.DELETE_CONTENT.setEnabled(!contentSummary ? false : contentSummary.isDeletable());
            this.DUPLICATE_CONTENT.setEnabled(true);
            this.MOVE_CONTENT.setEnabled(true);
            this.PUBLISH_CONTENT.setEnabled(true);
            var parallelPromises = [
                // check if selected content allows children and if user has create permission for it
                new GetContentTypeByNameRequest(contentSummary.getType()).sendAndParse().then(
                    (contentType: ContentType) => {
                        var allowsChildren = (contentType && contentType.isAllowChildContent());
                        this.SORT_CONTENT.setEnabled(allowsChildren);
                        var hasCreatePermission = false;
                        new IsAuthenticatedRequest().sendAndParse().then((loginResult: LoginResult) => {
                            new GetContentPermissionsByIdRequest(contentSummary.getContentId()).sendAndParse().then(
                                (accessControlList: AccessControlList) => {
                                    hasCreatePermission =
                                        this.hasPermission(Permission.CREATE, loginResult, accessControlList);
                                    this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(allowsChildren && hasCreatePermission);
                                })
                        })
                    })
            ];
            wemQ.all(parallelPromises).spread<any>(() => {
                deferred.resolve(contentBrowseItems);
                return wemQ(null);
            }).done();
            break;
        default:
            this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(false);
            this.EDIT_CONTENT.setEnabled(this.anyEditable(contentSummaries));
            this.DELETE_CONTENT.setEnabled(this.anyDeletable(contentSummaries));
            this.DUPLICATE_CONTENT.setEnabled(false);
            this.MOVE_CONTENT.setEnabled(true);
            this.SORT_CONTENT.setEnabled(false);
            this.PUBLISH_CONTENT.setEnabled(true);
            deferred.resolve(contentBrowseItems);
        }
        return deferred.promise;
    }

    private anyEditable(contentSummaries: ContentSummary[]): boolean {
        for (var i = 0; i < contentSummaries.length; i++) {
            var content: ContentSummary = contentSummaries[i];
            if (!!content && content.isEditable()) {
                return true;
            }
        }
        return false;
    }

    private anyDeletable(contentSummaries: ContentSummary[]): boolean {
        for (var i = 0; i < contentSummaries.length; i++) {
            var content: ContentSummary = contentSummaries[i];
            if (!!content && content.isDeletable()) {
                return true;
            }
        }
        return false;
    }

    private isPrincipalPresent(principalKey: PrincipalKey,
                               accessEntriesToCheck: AccessControlEntry[]): boolean {
        return accessEntriesToCheck.some((entry: AccessControlEntry) => {
            return entry.getPrincipalKey().equals(principalKey);
        });
    }

    private hasPermission(permission: Permission,
                          loginResult: LoginResult,
                          accessControlList: AccessControlList): boolean {
        var entries = accessControlList.getEntries();
        var accessEntriesWithGivenPermissions: AccessControlEntry[] = entries.filter((item: AccessControlEntry) => {
            return item.isAllowed(permission);
        });

        return loginResult.getPrincipals().some((principalKey: PrincipalKey) => {
            return RoleKeys.ADMIN.equals(principalKey) ||
                   this.isPrincipalPresent(principalKey, accessEntriesWithGivenPermissions);
        });
    }
}
