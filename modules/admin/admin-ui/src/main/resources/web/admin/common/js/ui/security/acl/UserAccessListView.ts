import {Permission} from "../../../security/acl/Permission";
import {ContentId} from "../../../content/ContentId";
import {Content} from "../../../content/Content";
import {Principal} from "../../../security/Principal";
import {PrincipalType} from "../../../security/PrincipalType";
import {AccessControlEntry} from "../../../security/acl/AccessControlEntry";
import {ListBox} from "../../selector/list/ListBox";
import {UserAccessListItemView} from "./UserAccessListItemView";

export class UserAccessListView extends ListBox<AccessControlEntry> {

        private userAccessListItemViews: UserAccessListItemView[];


        constructor(className?: string) {
            super('user-access-list-view' + (className ? " " + className : ""));
        }

        doRender(): wemQ.Promise<boolean> {
            return super.doRender().then((rendered) => {

                if (this.userAccessListItemViews && this.userAccessListItemViews.length > 0) {
                    this.userAccessListItemViews.forEach((userAccessListItemView: UserAccessListItemView) => {
                        this.appendChild(userAccessListItemView);
                    });
                }
                return rendered;
            });
        }

        setItemViews(userAccessListItemViews: UserAccessListItemView[]) {
            this.userAccessListItemViews = userAccessListItemViews;
        }

    }

