import {BrowseItemPanel} from "../../../../../common/js/app/browse/BrowseItemPanel";
import {Application} from "../../../../../common/js/application/Application";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";

import {ApplicationBrowseItemsSelectionPanel} from "./ApplicationBrowseItemsSelectionPanel";
import {ApplicationItemStatisticsPanel} from "../view/ApplicationItemStatisticsPanel";

export class ApplicationBrowseItemPanel extends BrowseItemPanel<Application> {

    createItemSelectionPanel(): ApplicationBrowseItemsSelectionPanel {
        return new ApplicationBrowseItemsSelectionPanel();
    }

    createItemStatisticsPanel(): ItemStatisticsPanel<Application> {
        return new ApplicationItemStatisticsPanel();
    }

}
