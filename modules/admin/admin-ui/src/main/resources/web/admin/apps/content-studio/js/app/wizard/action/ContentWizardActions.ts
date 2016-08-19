import {WizardActions} from "../../../../../../common/js/app/wizard/WizardActions";
import {Content} from "../../../../../../common/js/content/Content";
import {Action} from "../../../../../../common/js/ui/Action";
import {SaveAction} from "../../../../../../common/js/app/wizard/SaveAction";
import {CloseAction} from "../../../../../../common/js/app/wizard/CloseAction";
import {SaveAndCloseAction} from "../../../../../../common/js/app/wizard/SaveAndCloseAction";
import {IsAuthenticatedRequest} from "../../../../../../common/js/security/auth/IsAuthenticatedRequest";
import {LoginResult} from "../../../../../../common/js/security/auth/LoginResult";
import {PermissionHelper} from "../../../../../../common/js/security/acl/PermissionHelper";
import {Permission} from "../../../../../../common/js/security/acl/Permission";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {CompareStatus} from "../../../../../../common/js/content/CompareStatus";
import {GetContentByPathRequest} from "../../../../../../common/js/content/resource/GetContentByPathRequest";
import {GetContentPermissionsByIdRequest} from "../../../../../../common/js/content/resource/GetContentPermissionsByIdRequest";
import {AccessControlList} from "../../../../../../common/js/security/acl/AccessControlList";
import {GetContentRootPermissionsRequest} from "../../../../../../common/js/content/resource/GetContentRootPermissionsRequest";

import {ContentWizardPanel} from "../ContentWizardPanel";
import {DuplicateContentAction} from "./DuplicateContentAction";
import {DeleteContentAction} from "./DeleteContentAction";
import {PublishAction} from "./PublishAction";
import {PublishTreeAction} from "./PublishTreeAction";
import {UnpublishAction} from "./UnpublishAction";
import {PreviewAction} from "./PreviewAction";
import {ShowLiveEditAction} from "./ShowLiveEditAction";
import {ShowFormAction} from "./ShowFormAction";
import {ShowSplitEditAction} from "./ShowSplitEditAction";

export class ContentWizardActions extends WizardActions<Content> {

    private save: Action;

    private close: Action;

    private saveAndClose: Action;

    private delete: Action;

    private duplicate: Action;

    private publish: Action;
    
    private publishTree: Action;

    private unpublish: Action;

    private preview: Action;

    private showLiveEditAction: Action;

    private showFormAction: Action;

    private showSplitEditAction: Action;

    private deleteOnlyMode: boolean = false;

    constructor(wizardPanel: ContentWizardPanel) {
        super(
            new SaveAction(wizardPanel, "Save draft"),
            new DeleteContentAction(wizardPanel),
            new DuplicateContentAction(wizardPanel),
            new PreviewAction(wizardPanel),
            new PublishAction(wizardPanel),
            new PublishTreeAction(wizardPanel),
            new UnpublishAction(wizardPanel),
            new CloseAction(wizardPanel),
            new ShowLiveEditAction(wizardPanel),
            new ShowFormAction(wizardPanel),
            new ShowSplitEditAction(wizardPanel),
            new SaveAndCloseAction(wizardPanel)
        );

        this.save = this.getActions()[0];
        this.delete = this.getActions()[1];
        this.duplicate = this.getActions()[2];
        this.preview = this.getActions()[3];
        this.publish = this.getActions()[4];
        this.publishTree = this.getActions()[5];
        this.unpublish = this.getActions()[6];
        this.close = this.getActions()[7];
        this.showLiveEditAction = this.getActions()[8];
        this.showFormAction = this.getActions()[9];
        this.showSplitEditAction = this.getActions()[10];
        this.saveAndClose = this.getActions()[11];
    }

    enableActionsForNew() {
        this.save.setEnabled(true);
        this.delete.setEnabled(true)
    }

    enableActionsForExisting(existing: Content) {
        this.save.setEnabled(existing.isEditable());
        this.delete.setEnabled(existing.isDeletable());

        this.enableActionsForExistingByPermissions(existing);
    }

    setDeleteOnlyMode(content: Content, valueOn: boolean = true) {
        if (this.deleteOnlyMode == valueOn) {
            return;
        }
        this.deleteOnlyMode = valueOn;

        this.save.setEnabled(!valueOn);
        this.duplicate.setEnabled(!valueOn);
        this.publish.setEnabled(!valueOn);

        if (valueOn) {
            this.enableDeleteIfAllowed(content);
        }
        else {
            this.delete.setEnabled(true);
            this.enableActionsForExistingByPermissions(content);
        }
    }

    private enableDeleteIfAllowed(content: Content) {
        new IsAuthenticatedRequest().sendAndParse().then((loginResult: LoginResult) => {
            var hasDeletePermission = PermissionHelper.hasPermission(Permission.DELETE,
                loginResult, content.getPermissions());
            this.delete.setEnabled(hasDeletePermission);
        });
    }

    private enableActionsForExistingByPermissions(existing: Content) {
        new IsAuthenticatedRequest().sendAndParse().then((loginResult: LoginResult) => {

            var hasModifyPermission = PermissionHelper.hasPermission(Permission.MODIFY,
                loginResult, existing.getPermissions());
            var hasDeletePermission = PermissionHelper.hasPermission(Permission.DELETE,
                loginResult, existing.getPermissions());
            var hasPublishPermission = PermissionHelper.hasPermission(Permission.PUBLISH,
                loginResult, existing.getPermissions());

            if (!hasModifyPermission) {
                this.save.setEnabled(false);
                this.saveAndClose.setEnabled(false);
            }
            if (!hasDeletePermission) {
                this.delete.setEnabled(false);
            }
            if (!hasPublishPermission) {
                this.publish.setEnabled(false);
                this.publishTree.setEnabled(false);
            } else {
                // check if already published to show unpublish button
                ContentSummaryAndCompareStatusFetcher.fetchByContent(existing)
                    .then((contentAndCompare: ContentSummaryAndCompareStatus) => {

                        var status = contentAndCompare.getCompareStatus();
                        var isPublished = status !== CompareStatus.NEW &&
                                          status != CompareStatus.UNKNOWN;

                        this.unpublish.setVisible(isPublished);
                    });
            }

            if (existing.hasParent()) {
                new GetContentByPathRequest(existing.getPath().getParentPath()).sendAndParse().then(
                    (parent: Content) => {
                        new GetContentPermissionsByIdRequest(parent.getContentId()).sendAndParse().then(
                            (accessControlList: AccessControlList) => {
                                var hasParentCreatePermission = PermissionHelper.hasPermission(
                                    Permission.CREATE,
                                    loginResult,
                                    accessControlList);

                                if (!hasParentCreatePermission) {
                                    this.duplicate.setEnabled(false);
                                }
                            })
                    })
            } else {
                new GetContentRootPermissionsRequest().sendAndParse().then(
                    (accessControlList: AccessControlList) => {
                        var hasParentCreatePermission = PermissionHelper.hasPermission(Permission.CREATE,
                            loginResult,
                            accessControlList);

                        if (!hasParentCreatePermission) {
                            this.duplicate.setEnabled(false);
                        }
                    })
            }

        })
    }

    getDeleteAction(): Action {
        return this.delete;
    }

    getSaveAction(): Action {
        return this.save;
    }

    getDuplicateAction(): Action {
        return this.duplicate;
    }

    getCloseAction(): Action {
        return this.close;
    }

    getPublishAction(): Action {
        return this.publish;
    }

    getPublishTreeAction(): Action {
        return this.publishTree;
    }

    getUnpublishAction(): Action {
        return this.unpublish;
    }

    getPreviewAction(): Action {
        return this.preview;
    }

    getShowLiveEditAction(): Action {
        return this.showLiveEditAction;
    }

    getShowFormAction(): Action {
        return this.showFormAction;
    }

    getShowSplitEditAction(): Action {
        return this.showSplitEditAction;
    }
}
