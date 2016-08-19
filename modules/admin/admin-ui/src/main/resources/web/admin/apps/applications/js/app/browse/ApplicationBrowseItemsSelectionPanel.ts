import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {Application} from "../../../../../common/js/application/Application";
import {ApplicationViewer} from "../../../../../common/js/application/ApplicationViewer";
import {BrowseItemsSelectionPanel} from "../../../../../common/js/app/browse/BrowseItemsSelectionPanel";

export class ApplicationBrowseItemsSelectionPanel extends BrowseItemsSelectionPanel<Application> {

    createItemViewer(item: BrowseItem<Application>): ApplicationViewer {
        var viewer = new ApplicationViewer();
        viewer.setObject(item.getModel());
        return viewer;
    }

}
