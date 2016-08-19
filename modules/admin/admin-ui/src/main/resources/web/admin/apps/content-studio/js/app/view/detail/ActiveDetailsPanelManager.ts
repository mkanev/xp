import {ViewItem} from "../../../../../../common/js/app/view/ViewItem";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {AppHelper} from "../../../../../../common/js/util/AppHelper";

import {DetailsPanel} from "./DetailsPanel";
import {WidgetView} from "./WidgetView";

export class ActiveDetailsPanelManager {

    private static activeDetailsPanel: DetailsPanel;

    private static debouncedSetActiveDetailsPanel: (detailsPanel: DetailsPanel) => void = AppHelper.debounce(
        ActiveDetailsPanelManager.doSetActiveDetailsPanel,
        300, false);

    constructor() {

    }

    static setActiveDetailsPanel(detailsPanelToMakeActive: DetailsPanel) {
        ActiveDetailsPanelManager.debouncedSetActiveDetailsPanel(detailsPanelToMakeActive);
    }

    static getActiveDetailsPanel(): DetailsPanel {
        return ActiveDetailsPanelManager.activeDetailsPanel;
    }

    private static doSetActiveDetailsPanel(detailsPanelToMakeActive: DetailsPanel) {
        var activeItem: ContentSummaryAndCompareStatus = null,
            currentlyActivePanel = ActiveDetailsPanelManager.getActiveDetailsPanel(),
            currentlyActiveWidget: WidgetView;

        if (currentlyActivePanel == detailsPanelToMakeActive || !detailsPanelToMakeActive) {
            return;
        } else if (currentlyActivePanel) {
            activeItem = currentlyActivePanel.getItem();
            currentlyActiveWidget = currentlyActivePanel.getActiveWidget();
        }
        ActiveDetailsPanelManager.activeDetailsPanel = detailsPanelToMakeActive;
        detailsPanelToMakeActive.getCustomWidgetViewsAndUpdateDropdown().then(() => {
            detailsPanelToMakeActive.setItem(activeItem);
            if (currentlyActiveWidget) {
                detailsPanelToMakeActive.setActiveWidgetWithName(currentlyActiveWidget.getWidgetName());
            }
        });
    }
}
