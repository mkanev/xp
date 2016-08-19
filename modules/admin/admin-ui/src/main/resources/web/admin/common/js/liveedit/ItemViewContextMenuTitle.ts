import {NamesAndIconView} from "../app/NamesAndIconView";
import {NamesAndIconViewBuilder} from "../app/NamesAndIconView";

export class ItemViewContextMenuTitle extends NamesAndIconView {

        constructor(name: string, icon: string) {
            super(new NamesAndIconViewBuilder().setAddTitleAttribute(false));
            this.setMainName(name);
            this.setIconClass(icon);
        }

    }

