import {Equitable} from "../Equitable";
import {NavigatedDeckPanel} from "../ui/panel/NavigatedDeckPanel";
import {BrowsePanel} from "./browse/BrowsePanel";
import {AppBarTabMenu} from "./bar/AppBarTabMenu";
import {AppBarTabMenuItemBuilder} from "./bar/AppBarTabMenuItem";
import {AppBarTabId} from "./bar/AppBarTabId";
import {Panel} from "../ui/panel/Panel";
import {ShowBrowsePanelEvent} from "./ShowBrowsePanelEvent";

export class AppPanel<M extends Equitable> extends NavigatedDeckPanel {

        private browsePanel: BrowsePanel<M>;

        constructor(tabNavigator: AppBarTabMenu) {
            super(tabNavigator);
        }

        addBrowsePanel(browsePanel: BrowsePanel<M>) {
            // limit to 1 browse panel
            if (!this.browsePanel) {
                var browseMenuItem = new AppBarTabMenuItemBuilder().setLabel("<Select>").
                    setTabId(new AppBarTabId("hidden", "____home")).
                    build();
                browseMenuItem.setVisibleInMenu(false);
                this.addNavigablePanel(browseMenuItem, browsePanel, true);
                this.browsePanel = browsePanel;
            }
        }

        getBrowsePanel(): BrowsePanel<M> {
            return this.browsePanel;
        }

        removeNavigablePanel(panel: Panel, checkCanRemovePanel: boolean = true): number {
            var index = super.removeNavigablePanel(panel, checkCanRemovePanel);
            this.checkBrowsePanelNeedsToBeShown(index, panel);
            return index;
        }

        private checkBrowsePanelNeedsToBeShown(index: number, panel: Panel) {
            if (panel == this.browsePanel && index > -1) {
                this.browsePanel = undefined;
            } else if (this.getSize() == 0) {
                // show browse panel if all others were removed
                new ShowBrowsePanelEvent().fire();
            }
        }

        getNavigator(): AppBarTabMenu {
            return <AppBarTabMenu>super.getNavigator();
        }
    }
