import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {BrowseItemsSelectionPanel} from "../../../../../common/js/app/browse/BrowseItemsSelectionPanel";

import {UserTreeGridItemViewer} from "./UserTreeGridItemViewer";
import {UserTreeGridItem} from "./UserTreeGridItem";

export class UserBrowseItemsSelectionPanel extends BrowseItemsSelectionPanel<UserTreeGridItem> {

    createItemViewer(item: BrowseItem<UserTreeGridItem>): UserTreeGridItemViewer {
        var viewer = new UserTreeGridItemViewer();
        viewer.setObject(item.getModel());
        return viewer;
    }
}
