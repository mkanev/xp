import {CompareStatus} from "../../../../../../../../common/js/content/CompareStatus";
import {ContentSummary} from "../../../../../../../../common/js/content/ContentSummary";
import {Content} from "../../../../../../../../common/js/content/Content";
import {ContentId} from "../../../../../../../../common/js/content/ContentId";
import {CompareStatusFormatter} from "../../../../../../../../common/js/content/CompareStatus";
import {AccessControlList} from "../../../../../../../../common/js/security/acl/AccessControlList";
import {Access} from "../../../../../../../../common/js/ui/security/acl/Access";
import {AccessControlEntry} from "../../../../../../../../common/js/security/acl/AccessControlEntry";
import {AccessControlEntryView} from "../../../../../../../../common/js/ui/security/acl/AccessControlEntryView";
import {UserAccessListView} from "../../../../../../../../common/js/ui/security/acl/UserAccessListView";
import {UserAccessListItemView} from "../../../../../../../../common/js/ui/security/acl/UserAccessListItemView";
import {Permission} from "../../../../../../../../common/js/security/acl/Permission";
import {Principal} from "../../../../../../../../common/js/security/Principal";
import {PrincipalKey} from "../../../../../../../../common/js/security/PrincipalKey";
import {User} from "../../../../../../../../common/js/security/User";
import {SpanEl} from "../../../../../../../../common/js/dom/SpanEl";
import {RoleKeys} from "../../../../../../../../common/js/security/RoleKeys";
import {DivEl} from "../../../../../../../../common/js/dom/DivEl";
import {AEl} from "../../../../../../../../common/js/dom/AEl";
import {OpenEditPermissionsDialogEvent} from "../../../../../../../../common/js/content/event/OpenEditPermissionsDialogEvent";
import {GetEffectivePermissionsRequest} from "../../../../../../../../common/js/content/resource/GetEffectivePermissionsRequest";
import {EffectivePermission} from "../../../../../../../../common/js/ui/security/acl/EffectivePermission";
import {IsAuthenticatedRequest} from "../../../../../../../../common/js/security/auth/IsAuthenticatedRequest";
import {GetContentByIdRequest} from "../../../../../../../../common/js/content/resource/GetContentByIdRequest";

import {WidgetItemView} from "../../WidgetItemView";

export class UserAccessWidgetItemView extends WidgetItemView {

    private contentId: ContentId;

    private accessListView: UserAccessListView;

    private headerEl: SpanEl;

    private bottomEl;

    private currentUser: User;// TODO: need to implement caching for current user value;

    private everyoneAccessValue: Access;

    public static debug = false;

    private static OPTIONS: any[] = [
        {value: Access.FULL, name: 'has full access to'},
        {value: Access.PUBLISH, name: 'can publish'},
        {value: Access.WRITE, name: 'can write'},
        {value: Access.READ, name: 'can read'},
        {value: Access.CUSTOM, name: 'has custom access to'}
    ];


    constructor() {
        super("user-access-widget-item-view");
        this.accessListView = new UserAccessListView();
    }

    public setContentId(contentId: ContentId): wemQ.Promise<any> {
        if (UserAccessWidgetItemView.debug) {
            console.debug('UserAccessWidgetItemView.setContentId: ', contentId);
        }
        this.contentId = contentId;
        return this.layout();
    }


    private layoutHeader(content: Content) {
        var entry = content.getPermissions().getEntry(RoleKeys.EVERYONE);
        this.everyoneAccessValue = null;

        if (this.hasChild(this.headerEl)) {
            this.removeChild(this.headerEl);
        }

        if (entry) {

            this.everyoneAccessValue = AccessControlEntryView.getAccessValueFromEntry(entry);
            var headerStr = entry.getPrincipalDisplayName() + " " + this.getOptionName(this.everyoneAccessValue) +
                            " this item";
            var headerStrEl = new SpanEl("header-string").setHtml(headerStr);

            this.headerEl = new DivEl("user-access-widget-header");

            this.headerEl.appendChild(new DivEl("icon-menu4"));
            this.headerEl.appendChild(headerStrEl);
            this.prependChild(this.headerEl);
        }
    }

    private layoutBottom(content: Content) {

        if (this.hasChild(this.bottomEl)) {
            this.removeChild(this.bottomEl);
        }

        this.bottomEl = new AEl("edit-permissions-link").setHtml("Edit Permissions");
        this.appendChild(this.bottomEl);

        this.bottomEl.onClicked((event: MouseEvent) => {
            new OpenEditPermissionsDialogEvent(content).fire();
            event.stopPropagation();
            event.preventDefault();
            return false;
        });

    }

    private layoutList(content: Content): wemQ.Promise<boolean> {

        var deferred = wemQ.defer<boolean>();

        var request = new GetEffectivePermissionsRequest(content.getContentId());

        request.sendAndParse().then((results: EffectivePermission[]) => {

            if (this.hasChild(this.accessListView)) {
                this.removeChild(this.accessListView);
            }
            var userAccessList = this.getUserAccessList(results);

            this.accessListView = new UserAccessListView();
            this.accessListView.setItemViews(userAccessList);
            this.appendChild(this.accessListView);

            deferred.resolve(true);
        }).done();

        return deferred.promise;

    }

    public layout(): wemQ.Promise<any> {
        if (UserAccessWidgetItemView.debug) {
            console.debug('UserAccessWidgetItemView.layout');
        }

        return super.layout().then(this.layoutUserAccess.bind(this));
    }

    private layoutUserAccess(): wemQ.Promise<any> {
        return new IsAuthenticatedRequest().sendAndParse().then((loginResult) => {

            this.currentUser = loginResult.getUser();
            if (this.contentId) {
                return new GetContentByIdRequest(this.contentId).sendAndParse().then((content: Content) => {
                    if (content) {
                        this.layoutHeader(content);
                        return this.layoutList(content).then(() => {
                            if (content.isAnyPrincipalAllowed(loginResult.getPrincipals(),
                                    Permission.WRITE_PERMISSIONS)) {

                                this.layoutBottom(content);
                            }
                        });
                    }
                });
            }
        });
    }

    private getUserAccessList(results: EffectivePermission[]): UserAccessListItemView[] {

        return results.filter(item => item.getAccess() != this.everyoneAccessValue &&
                                      item.getPermissionAccess().getCount() > 0).map((item: EffectivePermission) => {
            var view = new UserAccessListItemView();
            view.setObject(item);
            view.setCurrentUser(this.currentUser);
            return view;
        });
    }

    private getOptionName(access: Access): string {
        var currentOption = UserAccessWidgetItemView.OPTIONS.filter(option => {
            return option.value == access;
        });
        if (currentOption && currentOption.length > 0) {
            return currentOption[0].name;
        }
    }
}
