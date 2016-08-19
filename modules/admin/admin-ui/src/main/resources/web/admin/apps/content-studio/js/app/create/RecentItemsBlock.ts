import {AsideEl} from "../../../../../common/js/dom/AsideEl";
import {H1El} from "../../../../../common/js/dom/H1El";

import {RecentItemsList} from "./RecentItemsList";

export class RecentItemsBlock extends AsideEl {

    private recentItemsList: RecentItemsList;

    private title: H1El;

    constructor(title = "Recently Used") {
        super("column");

        this.title = new H1El();
        this.title.setHtml(title);

        this.recentItemsList = new RecentItemsList();
        this.appendChildren(this.title, this.recentItemsList);
    }

    getItemsList(): RecentItemsList {
        return this.recentItemsList;
    }

    setTitle(newTitle: string) {
        this.title.setHtml(newTitle);
    }
}
