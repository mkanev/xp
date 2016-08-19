import {Equitable} from "../../Equitable";
import {DeckPanel} from "../../ui/panel/DeckPanel";
import {ItemStatisticsPanel} from "../view/ItemStatisticsPanel";
import {BrowseItem} from "./BrowseItem";
import {ViewItem} from "../view/ViewItem";
import {BrowseItemsChanges} from "./BrowseItemsChanges";
import {BrowseItemsSelectionPanel} from "./BrowseItemsSelectionPanel";
import {ItemDeselectedEvent} from "./ItemDeselectedEvent";

export class BrowseItemPanel<M extends Equitable> extends DeckPanel {

        private itemStatisticsPanel: ItemStatisticsPanel<M>;

        private itemsSelectionPanel: BrowseItemsSelectionPanel<M>;

        constructor() {
            super("browse-item-panel");

            this.itemsSelectionPanel = this.createItemSelectionPanel();
            this.itemStatisticsPanel = this.createItemStatisticsPanel();

            this.addPanel(this.itemsSelectionPanel);
            this.addPanel(this.itemStatisticsPanel);
            this.showPanelByIndex(0);
        }

        createItemSelectionPanel(): BrowseItemsSelectionPanel<M> {
            return new BrowseItemsSelectionPanel<M>();
        }

        createItemStatisticsPanel(): ItemStatisticsPanel<M> {
            return new ItemStatisticsPanel<M>();
        }

        setMobileView(mobileView: boolean) {
            this.itemsSelectionPanel.setMobileView(mobileView);
        }

        setItems(items: BrowseItem<M>[]): BrowseItemsChanges<M> {
            let changes = this.itemsSelectionPanel.setItems(items);
            this.updateDisplayedPanel();

            return changes;
        }

        getItems(): BrowseItem<M>[] {
            return this.itemsSelectionPanel.getItems();
        }

        updateItemViewers(items: BrowseItem<M>[]) {
            this.itemsSelectionPanel.updateItemViewers(items);
        }

        updateDisplayedPanel() {
            var selectedItems = this.getItems();
            if (selectedItems.length == 1) {
                this.showPanelByIndex(1);
                this.itemStatisticsPanel.setItem(selectedItems[0].toViewItem());
            } else {
                this.showPanelByIndex(0);
            }
        }

        setStatisticsItem(item: BrowseItem<M>) {
            this.itemStatisticsPanel.setItem(item.toViewItem());
        }

        getStatisticsItem(): ViewItem<M> {
            return this.itemStatisticsPanel.getItem();
        }

        onDeselected(listener: (event: ItemDeselectedEvent<M>)=>void) {
            this.itemsSelectionPanel.onDeselected(listener);
        }
    }
