import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";
import {Site} from "../../../../../common/js/content/site/Site";
import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";
import {Content} from "../../../../../common/js/content/Content";
import {CreateContentFilter} from "../../../../../common/js/content/util/CreateContentFilter";

import {NewContentDialogList} from "./NewContentDialogList";
import {NewContentDialogListItem} from "./NewContentDialogListItem";
export class FilterableItemsList extends NewContentDialogList {

    private parentContent: Content;

    private listItems: NewContentDialogListItem[];

    constructor() {
        super();
    }

    filter(value: string) {
        var valueLowerCase = value ? value.toLowerCase() : undefined;

        var filteredItems = this.listItems.filter((item: NewContentDialogListItem) => {
            return (!valueLowerCase || (item.getDisplayName().toLowerCase().indexOf(valueLowerCase) != -1) ||
                    (item.getName().toLowerCase().indexOf(valueLowerCase) != -1));
        });

        this.setItems(filteredItems);
    }

    setParentContent(parent: Content) {
        this.parentContent = parent;
    }

    createItems(allContentTypes: ContentTypeSummary[], parentSite: Site) {
        var allListItems: NewContentDialogListItem[] = this.createListItems(allContentTypes);
        var siteApplications: ApplicationKey[] = parentSite ? parentSite.getApplicationKeys() : [];
        this.listItems = this.filterByParentContent(allListItems, siteApplications);
        this.setItems(this.listItems.slice());
    }

    private createListItems(contentTypes: ContentTypeSummary[]): NewContentDialogListItem[] {
        var contentTypesByName: {[name: string]: ContentTypeSummary} = {};
        var items: NewContentDialogListItem[] = [];

        contentTypes.forEach((contentType: ContentTypeSummary) => {
            // filter media type descendants out
            var contentTypeName = contentType.getContentTypeName();
            if (!contentTypeName.isMedia() && !contentTypeName.isDescendantOfMedia() && !contentTypeName.isFragment()) {
                contentTypesByName[contentType.getName()] = contentType;
                items.push(NewContentDialogListItem.fromContentType(contentType))
            }
        });

        items.sort(this.compareListItems);
        return items;
    }

    private compareListItems(item1: NewContentDialogListItem, item2: NewContentDialogListItem): number {
        if (item1.getDisplayName().toLowerCase() > item2.getDisplayName().toLowerCase()) {
            return 1;
        } else if (item1.getDisplayName().toLowerCase() < item2.getDisplayName().toLowerCase()) {
            return -1;
        } else if (item1.getName() > item2.getName()) {
            return 1;
        } else if (item1.getName() < item2.getName()) {
            return -1;
        } else {
            return 0;
        }
    }

    private filterByParentContent(items: NewContentDialogListItem[],
                                  siteApplicationKeys: ApplicationKey[]): NewContentDialogListItem[] {
        var createContentFilter = new CreateContentFilter().siteApplicationsFilter(siteApplicationKeys);
        return items.filter((item: NewContentDialogListItem) =>
            createContentFilter.isCreateContentAllowed(this.parentContent, item.getContentType())
        );
    }
}