import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";
import {LiEl} from "../../../../../common/js/dom/LiEl";
import {NamesAndIconViewBuilder} from "../../../../../common/js/app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../../../common/js/app/NamesAndIconViewSize";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ArrayHelper} from "../../../../../common/js/util/ArrayHelper";

import {MostPopularItem} from "./MostPopularItem";
import {NewContentDialogList} from "./NewContentDialogList";
import {NewContentDialogListItem} from "./NewContentDialogListItem";
import {MostPopularItemsBlock} from "./MostPopularItemsBlock";
export class MostPopularItemsList extends NewContentDialogList {

    constructor() {
        super("most-popular-content-types-list");
    }

    createItemView(item: MostPopularItem): LiEl {
        var namesAndIconView = new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small).build();
        namesAndIconView
            .setIconUrl(item.getIconUrl())
            .setMainName(item.getDisplayName() + " (" + item.getHits() + ")")
            .setSubName(item.getName())
            .setDisplayIconLabel(item.isSite());

        var itemEl = new LiEl('content-types-list-item' + (item.isSite() ? ' site' : ''));
        itemEl.getEl().setTabIndex(0);
        itemEl.appendChild(namesAndIconView);
        itemEl.onClicked((event: MouseEvent) => this.notifySelected(item));
        itemEl.onKeyPressed((event: KeyboardEvent) => {
            if (event.keyCode == 13) {
                this.notifySelected(item);
            }
        });
        return itemEl;
    }

    createItems(listItems: NewContentDialogListItem[],
                directChildContents: ContentSummary[]) {

        var contentTypes = listItems.map((el) => el.getContentType());

        var mostPopularItems: MostPopularItem[] = [],
            allowedContentTypes: ContentSummary[] = directChildContents.filter((content: ContentSummary) => {
                return this.isAllowedContentType(contentTypes, content);
            }),
            aggregatedList: ContentTypeInfo[] = this.getAggregatedItemList(allowedContentTypes);

        for (var i = 0; i < aggregatedList.length && i < MostPopularItemsBlock.DEFAULT_MAX_ITEMS; i++) {
            var contentType: ContentTypeSummary = ArrayHelper.findElementByFieldValue(contentTypes, "name",
                aggregatedList[i].contentType);
            mostPopularItems.push(new MostPopularItem(contentType, aggregatedList[i].count));
        }

        this.setItems(mostPopularItems);
    }

    private isAllowedContentType(allowedContentTypes: ContentTypeSummary[], content: ContentSummary) {
        return !content.getType().isMedia() && !content.getType().isDescendantOfMedia() &&
               Boolean(ArrayHelper.findElementByFieldValue(allowedContentTypes, "id", content.getType().toString()));
    }

    private getAggregatedItemList(contentTypes: ContentSummary[]) {
        var aggregatedList: ContentTypeInfo[] = [];

        contentTypes.forEach((content: ContentSummary) => {
            var contentType = content.getType().toString();
            var existingContent = ArrayHelper.findElementByFieldValue(aggregatedList, "contentType", contentType);

            if (existingContent) {
                existingContent.count++;
                if (content.getModifiedTime() > existingContent.lastModified) {
                    existingContent.lastModified = content.getModifiedTime();
                }
            }
            else {
                aggregatedList.push({contentType: contentType, count: 1, lastModified: content.getModifiedTime()});
            }
        });

        aggregatedList.sort(this.sortByCountAndDate);

        return aggregatedList;
    }

    private sortByCountAndDate(contentType1: ContentTypeInfo, contentType2: ContentTypeInfo) {
        if (contentType2.count == contentType1.count) {
            return contentType2.lastModified > contentType1.lastModified ? 1 : -1;
        }
        return contentType2.count - contentType1.count;
    }

}

export interface ContentTypeInfo {
    contentType: string;
    count: number;
    lastModified: Date;
}
