import {Application} from "../../../../../../common/js/application/Application";
import {Panel} from "../../../../../../common/js/ui/panel/Panel";
import {ResponsiveManager} from "../../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../../../../../common/js/ui/responsive/ResponsiveItem";

import {MarketAppsTreeGrid} from "./MarketAppsTreeGrid";

export class MarketAppPanel extends Panel {

    private marketAppsTreeGrid: MarketAppsTreeGrid;

    private gridDataLoaded: boolean = false;

    private isGridLoadingData: boolean = false;

    constructor(className?: string) {
        super(className);
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered) => {

            this.marketAppsTreeGrid = new MarketAppsTreeGrid();
            this.appendChild(this.marketAppsTreeGrid);

            this.initDataLoadListener();

            this.initAvailableSizeChangeListener();

            return rendered;
        });
    }

    private initDataLoadListener() {
        var firstLoadListener = () => {
            if (this.marketAppsTreeGrid.getGrid().getDataView().getLength() > 0) {
                this.marketAppsTreeGrid.unLoaded(firstLoadListener);
                setTimeout(() => {
                    if (!this.gridDataLoaded) {
                        this.gridDataLoaded = true;
                        this.marketAppsTreeGrid.refresh();// this helps to show default app icon if one provided in json fails to upload
                    }
                }, 500);
            }
        };

        this.marketAppsTreeGrid.onLoaded(firstLoadListener);
    }

    public updateInstallApplications(installApplications: Application[]) {
        this.marketAppsTreeGrid.updateInstallApplications(installApplications);
    }

    private initAvailableSizeChangeListener() {
        ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
            this.marketAppsTreeGrid.getGrid().resizeCanvas();
        });
    }

    public loadGrid() {
        if (this.isGridLoadingData) {
            return;
        }
        this.isGridLoadingData = true;
        this.marketAppsTreeGrid.reload().then(() => {
            this.isGridLoadingData = false;
            this.marketAppsTreeGrid.getGrid().resizeCanvas();
        });
    }

    public getMarketAppsTreeGrid(): MarketAppsTreeGrid {
        return this.marketAppsTreeGrid;
    }
}
