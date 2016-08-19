import {ContentItemType} from "./ContentItemType";
import {ContentView} from "./ContentView";
import {ItemViewContextMenuTitle} from "./ItemViewContextMenuTitle";

export class ContentViewContextMenuTitle extends ItemViewContextMenuTitle {

        constructor(contentView: ContentView) {
            super(contentView.getName(), ContentItemType.get().getConfig().getIconCls());
        }

    }

