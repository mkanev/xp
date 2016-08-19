import {DivEl} from "../../../../../common/js/dom/DivEl";
import {H2El} from "../../../../../common/js/dom/H2El";

import {MostPopularItemsList} from "./MostPopularItemsList";

export class MostPopularItemsBlock extends DivEl {

    public static DEFAULT_MAX_ITEMS = 2;

    private mostPopularItemsList: MostPopularItemsList;

    private title: H2El;

    constructor(title = "Most Popular") {
        super("most-popular-content-types-container");

        this.title = new H2El();
        this.title.setHtml(title);

        this.mostPopularItemsList = new MostPopularItemsList();
        this.appendChildren(this.title, this.mostPopularItemsList);
    }

    getItemsList(): MostPopularItemsList {
        return this.mostPopularItemsList;
    }

    setTitle(newTitle: string) {
        this.title.setHtml(newTitle);
    }

    showIfNotEmpty() {
        if (this.mostPopularItemsList.getItems().length > 0) {
            this.show();
        }
    }
}

