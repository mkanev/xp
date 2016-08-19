import {Equitable} from "../../Equitable";
import {TabMenu} from "../../ui/tab/TabMenu";
import {NavigatedDeckPanel} from "../../ui/panel/NavigatedDeckPanel";
import {TabMenuItem} from "../../ui/tab/TabMenuItem";
import {Panel} from "../../ui/panel/Panel";
import {ItemStatisticsPanel} from "./ItemStatisticsPanel";

export class MultiItemStatisticsPanel<M extends Equitable> extends ItemStatisticsPanel<M> {

        private tabMenu: TabMenu;

        private deckPanel: NavigatedDeckPanel;

        constructor(className?: string) {
            super(className);

            this.tabMenu = new TabMenu();
            this.tabMenu.hide();
            this.appendChild(this.tabMenu);


            this.deckPanel = new NavigatedDeckPanel(this.tabMenu);
            this.deckPanel.setDoOffset(false);
            this.appendChild(this.deckPanel);
        }


        getTabMenu(): TabMenu {
            return this.tabMenu;
        }

        getDeckPanel(): NavigatedDeckPanel {
            return this.deckPanel;
        }

        addNavigablePanel(tab: TabMenuItem, panel: Panel, select?: boolean) {
            this.tabMenu.show();
            this.deckPanel.addNavigablePanel(tab, panel, select);
        }

        showPanel(index: number) {
            this.tabMenu.selectNavigationItem(index);
        }
    }
