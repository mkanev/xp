import {Equitable} from "../../Equitable";
import {BrowseItem} from "./BrowseItem";

export class ItemDeselectedEvent<M extends Equitable> {

        private browseItem: BrowseItem<M>;

        constructor(browseItem: BrowseItem<M>) {
            this.browseItem = browseItem;
        }

        getBrowseItem(): BrowseItem<M> {
            return this.browseItem;
        }
    }
