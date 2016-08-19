import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {AccessControlList} from "../../../../../common/js/security/acl/AccessControlList";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";
import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {Equitable} from "../../../../../common/js/Equitable";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";

export class ContentBrowseItem extends BrowseItem<ContentSummaryAndCompareStatus> {

    private accessControlList: AccessControlList;

    constructor(model: ContentSummaryAndCompareStatus) {
        super(model);
        this.accessControlList = null;
    }

    getAccessControlList(): AccessControlList {
        return this.accessControlList;
    }

    setAccessControlList(accessControlList: AccessControlList) {
        this.accessControlList = accessControlList;
    }

    equals(o: Equitable): boolean {
        if (!ObjectHelper.iFrameSafeInstanceOf(o, ContentBrowseItem)) {
            return false;
        }
        let other = <ContentBrowseItem> o;
        return super.equals(o) &&
               ObjectHelper.equals(this.accessControlList, other.getAccessControlList());
    }
}
