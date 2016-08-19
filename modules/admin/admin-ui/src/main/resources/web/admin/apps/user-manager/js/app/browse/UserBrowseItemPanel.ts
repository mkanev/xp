import {BrowseItemPanel} from "../../../../../common/js/app/browse/BrowseItemPanel";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";

import {UserBrowseItemsSelectionPanel} from "./UserBrowseItemsSelectionPanel";
import {UserTreeGridItem} from "./UserTreeGridItem";
import {UserItemStatisticsPanel} from "../view/UserItemStatisticsPanel";

export class UserBrowseItemPanel extends BrowseItemPanel<UserTreeGridItem> {

    createItemSelectionPanel(): UserBrowseItemsSelectionPanel {
        return new UserBrowseItemsSelectionPanel();
    }

    createItemStatisticsPanel(): ItemStatisticsPanel<UserTreeGridItem> {
        return new UserItemStatisticsPanel();
    }

}
