import {Region} from "../content/page/region/Region";
import {ItemViewContextMenuTitle} from "./ItemViewContextMenuTitle";
import {RegionItemType} from "./RegionItemType";

export class RegionViewContextMenuTitle extends ItemViewContextMenuTitle {

        constructor(region: Region) {
            super(region.getName(), RegionItemType.get().getConfig().getIconCls());
        }

    }

