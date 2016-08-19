import {Content} from "../content/Content";
import {ItemViewContextMenuTitle} from "./ItemViewContextMenuTitle";
import {PageItemType} from "./PageItemType";

export class PageViewContextMenuTitle extends ItemViewContextMenuTitle {

        constructor(content: Content) {
            super(content.getDisplayName(), PageItemType.get().getConfig().getIconCls());
        }

    }

